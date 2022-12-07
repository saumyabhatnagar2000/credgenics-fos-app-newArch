import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    ToastAndroid,
    View
} from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import {
    FeedbackQuestionType,
    FeedbackResponseSectionType,
    FeedbackResponseType,
    FeedbackSectionType
} from '../../types';
import Questionnaire from '../components/questionnaire/Questionnaire';
import CustomAppBar from '../components/common/AppBar';
import Typography, { TypographyVariants } from '../components/ui/Typography';
import { BLUE_DARK } from '../constants/Colors';
import { useAuth } from '../hooks/useAuth';
import {
    getFormDetails,
    getFormResponses,
    getForms,
    saveResponseToVisit,
    submitForm
} from '../services/feedbackService';
import ResultModal from '../components/modals/ResultModal';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { TaskTypes } from '../../enums';

export default function QuestionnaireScreen({
    route,
    navigation
}: {
    route: any;
    navigation: any;
}) {
    const {
        responseId,
        visitId,
        modal = false,
        modalDetails = { message: '', loanData: null },
        loanData,
        allocation_month
    } = route?.params ?? {};
    const isPrefilledFrom = !!responseId && responseId?.length > 0;

    const screenTitle = `Feedback ${isPrefilledFrom ? 'Responses' : 'Form'}`;
    const loan_data = loanData ?? modalDetails?.loanData;
    const { authData } = useAuth();
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [formid, setFormid] = useState('');

    const [questions, setQuestions] = useState<
        FeedbackQuestionType[] | FeedbackResponseType[]
    >([]);
    const [formData, setFormData] = useState<any>({});

    const onSaveLater = () => {
        Alert.alert('Saved for Later');
    };

    const onSubmit = async () => {
        setSubmitting(true);
        if (!visitId) {
            ToastAndroid.show('Visit id not found', ToastAndroid.LONG);
            return;
        }

        try {
            const data = await submitForm(formid, answers, authData);
            const { response_id } = data;

            if (!response_id) {
                ToastAndroid.show('Response id not found', ToastAndroid.LONG);
                return;
            }

            await setResponseForVisit(
                visitId,
                response_id,
                loan_data?.loan_id ?? ''
            );
            ToastAndroid.show('Form submitted', ToastAndroid.LONG);
        } catch (e) {
            ToastAndroid.show('Error submitting form', ToastAndroid.LONG);
        } finally {
            setSubmitting(false);
            setAnswers({});
            handleClose();
        }
    };

    const onDoneClicked = () => {
        setIsModalVisible(false);
        navigation.reset({
            index: 1,
            routes: [
                {
                    name: 'Drawer'
                },
                {
                    name: 'PortfolioDetailScreen'
                }
            ]
        });
    };

    const handleClose = () => {
        if (modal) {
            setIsModalVisible(true);
            return;
        }
        onDoneClicked();
    };

    const fetchDetails = async (formResponseId: string) => {
        try {
            const formResponses = await getFormResponses(
                formResponseId,
                authData
            );

            if (formResponses?.data?.[0]?.sections?.length > 0) {
                let questionsData: FeedbackResponseType[] = [];
                let answersData = {};

                formResponses?.data[0]?.sections.forEach(
                    (_section: FeedbackResponseSectionType) => {
                        if (_section.questions) {
                            let questionsL = _section.questions.map(
                                (ques: FeedbackResponseType, idx) => {
                                    const options = Array.isArray(ques.answer)
                                        ? ques.answer
                                        : [ques.answer];

                                    const question_id = idx;

                                    answersData = {
                                        ...answersData,
                                        [question_id]: ques.answer
                                    };

                                    return {
                                        ...ques,
                                        options: options ?? [],
                                        question_id
                                    };
                                }
                            );

                            questionsData = [...questionsData, ...questionsL];
                        }
                    }
                );
                setQuestions(questionsData);
                setAnswers(answersData);
            }
        } catch (e) {
            ToastAndroid.show('Error fetching form', ToastAndroid.LONG);
        }
    };
    const fetchForm = async (formId: string) => {
        try {
            const data = await getFormDetails(formId, authData);
            setFormData(data);
            if (data?.sections?.length > 0) {
                let questionsData: FeedbackQuestionType[] = [];
                data.sections.forEach((_section: FeedbackSectionType) => {
                    if (_section.questions) {
                        questionsData = [
                            ...questionsData,
                            ..._section.questions
                        ];
                    }
                });
                setQuestions(questionsData);
            } else {
                ToastAndroid.show('Form incorrect', ToastAndroid.LONG);
            }
        } catch (e) {
            ToastAndroid.show('Cannot find form', ToastAndroid.LONG);
        }
    };

    useEffect(() => {
        async function init() {
            setLoading(true);
            const data = await getForms(authData);
            setFormid(data?._id);
            try {
                if (isPrefilledFrom) await fetchDetails(responseId);
                else await fetchForm(data?._id);
            } catch (e) {
                //
            }
            setLoading(false);
        }

        init();
    }, []);

    const setResponseForVisit = async (
        visitId: string,
        responseId: string,
        loanId: string
    ) => {
        try {
            const formResponses = await saveResponseToVisit(
                visitId,
                responseId,
                loanId,
                allocation_month,
                authData
            );
        } catch (e) {}
    };

    let loadingText = isPrefilledFrom
        ? 'Loading feedback responses'
        : 'Loading feedback form';

    if (submitting) loadingText = 'Submitting response';

    let content = (
        <>
            <ActivityIndicator
                size="large"
                color={BLUE_DARK}
                style={{ margin: RFPercentage(2) }}
            />
            <Typography
                variant={TypographyVariants.title}
                style={{ alignSelf: 'center' }}
            >
                {loadingText}
            </Typography>
        </>
    );

    const createFollowUp = (type: TaskTypes) => {
        if (!modalDetails?.loanData) {
            ToastAndroid.show('Loan Details not found', ToastAndroid.LONG);
            return;
        }

        navigation.replace('NewTaskScreen', {
            loanData: [modalDetails?.loanData],
            taskType: type,
            allocation_month
        });
    };

    if (!loading && !submitting) {
        const modalExtraProps = (
            <View style={styles.followContainer}>
                <Typography
                    variant={TypographyVariants.body1}
                    style={styles.followUpText}
                >
                    Create follow up
                </Typography>
                <View style={styles.followUpButtonContainer}>
                    <TouchableOpacity
                        onPress={() => createFollowUp(TaskTypes.visit)}
                        activeOpacity={0.6}
                    >
                        <Typography
                            variant={TypographyVariants.body2}
                            style={styles.followUpButton}
                        >
                            Visit
                        </Typography>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => createFollowUp(TaskTypes.ptp)}
                        activeOpacity={0.6}
                    >
                        <Typography
                            variant={TypographyVariants.body2}
                            style={styles.followUpButton}
                        >
                            PTP
                        </Typography>
                    </TouchableOpacity>
                </View>
            </View>
        );

        content = (
            <>
                <Questionnaire
                    editable={!isPrefilledFrom}
                    questions={questions}
                    questionPerPage={4}
                    onSaveLater={onSaveLater}
                    onSubmit={onSubmit}
                    answers={answers}
                    setAnswers={setAnswers}
                />
                <ResultModal
                    visible={isModalVisible}
                    message={modalDetails?.message ?? 'Success'}
                    buttonText="DONE"
                    positive={true}
                    extra={modalExtraProps}
                    onDone={onDoneClicked}
                />
            </>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#F6F8FB' }}>
            <CustomAppBar
                title={screenTitle}
                backButton
                onBackClicked={() => {
                    const goBack = () => {
                        if (navigation.canGoBack()) navigation.goBack();
                    };

                    if (isPrefilledFrom) {
                        goBack();
                        return;
                    }

                    Alert.alert(
                        'Feedback pending',
                        'Your feedback form is pending!',
                        [
                            {
                                text: 'Fill Now',
                                style: 'cancel'
                            },
                            {
                                text: 'Fill later',
                                onPress: onDoneClicked
                            }
                        ],
                        {
                            cancelable: true
                        }
                    );
                }}
            />
            {content}
        </View>
    );
}

const styles = StyleSheet.create({
    buttonWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: RFPercentage(2)
    },
    followContainer: {
        alignItems: 'center',
        marginVertical: RFPercentage(2),
        paddingBottom: RFPercentage(3),
        width: '80%'
    },
    followUpButton: {
        backgroundColor: BLUE_DARK,
        borderRadius: RFPercentage(1),
        color: 'white',
        paddingHorizontal: RFPercentage(4),
        paddingVertical: RFPercentage(1)
    },
    followUpButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%'
    },
    followUpText: {
        marginBottom: 16
    }
});
