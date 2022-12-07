import React, {useEffect, useState} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import {Button} from '@rneui/base';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {ProgressBar} from '../common/ProgressBar';
import {Options} from '../questionnaire/Options';
import Colors, {BLUE_DARK, GREY} from '../../constants/Colors';
import {
  FeedbackQuestionType,
  FeedbackResponseType,
  QuesAnsType,
} from '../../../types';
import Typography, {
  TypographyFontFamily,
  TypographyVariants,
} from '../ui/Typography';
import {ScrollView} from 'react-native-gesture-handler';
import {SideChevron} from '../common/Icons/SideChevron';

export default function Questionnaire({
  questions,
  questionPerPage,
  onSubmit,
  onSaveLater,
  answers,
  setAnswers,
  editable = true,
}: {
  questions: FeedbackQuestionType[] | FeedbackResponseType[];
  questionPerPage: number;
  onSubmit: Function;
  onSaveLater: Function;
  answers: QuesAnsType;
  setAnswers: React.Dispatch<React.SetStateAction<QuesAnsType>>;
  editable?: boolean;
}) {
  const scrollRef = React.useRef(null);
  const [pageNumber, setPageNumber] = useState(0);

  const totalQuestions = Object.keys(questions).length;
  const totalAnswers = Object.keys(answers).length;

  const [visibleData, setVisibleData] = useState<
    FeedbackQuestionType[] | FeedbackResponseType[]
  >([]);

  useEffect(() => {
    const newData = Object.values(questions).slice(
      pageNumber * questionPerPage,
      pageNumber * questionPerPage + 4,
    );
    setVisibleData(newData);
  }, [pageNumber, questions]);

  const clickNext = () => {
    if (totalAnswers < questionPerPage * (pageNumber + 1)) {
      Alert.alert('Please answer the questions before moving forward');
      //
    } else {
      setPageNumber(num => num + 1);
      scrollRef?.current?.scrollTo({y: 0});
    }
  };
  const clickPrev = () => {
    setPageNumber(num => num - 1);
    scrollRef?.current?.scrollTo({y: 0});
  };

  return (
    <>
      {editable && (
        <ProgressBar total={totalQuestions} progress={totalAnswers} />
      )}
      <ScrollView ref={scrollRef}>
        {visibleData.map((question, index) => {
          var qId = question.question_id;
          var options = question.options;

          const onAnswer = (str: string) => {
            setAnswers(answersData => ({
              ...answersData,
              [qId]: str,
            }));
          };

          return (
            <View key={qId} style={styles.card}>
              <View style={styles.questionContainer}>
                <Typography
                  style={styles.questionText}
                  variant={TypographyVariants.body4}>
                  Q{questionPerPage * pageNumber + index + 1}.{' '}
                  {question.question}
                </Typography>
              </View>
              <Options
                editable={editable}
                options={options}
                answer={answers[qId]}
                onAnswer={onAnswer}
              />
            </View>
          );
        })}
        {editable && (
          <View style={styles.buttonContainer}>
            {
              <Button
                disabled={pageNumber < 1}
                disabledTitleStyle={{color: GREY}}
                title="Prev"
                titleStyle={[
                  styles.titleStyle,
                  {
                    marginLeft: 5,
                    color: BLUE_DARK,
                    fontSize: RFPercentage(2),
                  },
                ]}
                icon={
                  <SideChevron
                    color={pageNumber < 1 ? GREY : BLUE_DARK}
                    rotate={90}
                  />
                }
                buttonStyle={[
                  styles.buttonStyle,
                  {
                    paddingHorizontal: 20,
                    borderWidth: 0,
                    backgroundColor: '#F8F6FB',
                  },
                ]}
                onPress={clickPrev}
              />
            }

            <Button
              disabled={totalAnswers < questionPerPage * (pageNumber + 1)}
              disabledTitleStyle={{color: GREY}}
              title="Submit"
              titleStyle={styles.titleStyle}
              buttonStyle={[styles.buttonStyle, {paddingHorizontal: 35}]}
              onPress={() => onSubmit()}
              style={{marginHorizontal: 10}}
            />

            <Button
              disabled={totalQuestions <= questionPerPage * (pageNumber + 1)}
              disabledTitleStyle={{color: GREY}}
              title="Next"
              icon={
                <SideChevron
                  color={
                    totalQuestions >= questionPerPage * (pageNumber + 1)
                      ? GREY
                      : BLUE_DARK
                  }
                />
              }
              iconRight
              titleStyle={[
                styles.titleStyle,
                {
                  marginRight: 5,
                  color: '#043E90',
                  fontSize: RFPercentage(2),
                },
              ]}
              buttonStyle={[
                styles.buttonStyle,
                {
                  paddingHorizontal: 20,
                  borderWidth: 0,
                  backgroundColor: '#F6F8FB',
                },
              ]}
              onPress={clickNext}
            />
          </View>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: 'center',
    backgroundColor: '#F6F8FB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  buttonStyle: {
    backgroundColor: BLUE_DARK,
    borderColor: BLUE_DARK,
    borderWidth: 1,
    marginRight: 5,
    paddingVertical: 6,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: RFPercentage(1.4),
    marginVertical: RFPercentage(0.4),
    padding: RFPercentage(1.8),
    paddingVertical: RFPercentage(1.6),
  },
  containerStyle: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'space-between',
    width: '80%',
  },
  flatListContainer: {
    backgroundColor: '#F6F8FB',
    flex: 1,
  },
  questionContainer: {
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: RFPercentage(0.4),
    paddingHorizontal: RFPercentage(1),
  },
  questionText: {
    color: Colors.common.blue,
  },
  titleStyle: {
    fontFamily: TypographyFontFamily.normal,
  },
});
