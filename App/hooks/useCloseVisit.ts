import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { ReceiptGenerationDataType, TaskType } from './../../types';
import { useNavigation } from '@react-navigation/native';
import { RequestMethods } from '../../enums';
import { closeVisitType } from '../../types';
import Urls from '../constants/Urls';
import { apiRequest } from '../services/apiRequest';
import useCommon from './useCommon';
import useOfflineVisitData from './useOfflineVisitData';
import useTask from './useTask';
import useConfig from './useConfig';
import { useAppSelector } from '../redux/hooks';
import { selectCloseVisit } from '../redux/offlineVisitDataSlice';
import { useCallback, useMemo } from 'react';
import { ToastAndroid } from 'react-native';
import { COLLECTION_LIMIT_ERROR_TEXT } from '../constants/constants';
import { keyConverter } from '../services/utils';
import { useAuth } from './useAuth';
import { toWords } from 'number-to-words';
import moment from 'moment';
import { getTemplate } from '../assets/OfflineReceipt/template';

const { FOS_SERVICE_BASE_URL } = Urls;

export const useCloseVisit = () => {
    const { setOfflineVisitData } = useOfflineVisitData();
    const { navigate } = useNavigation();
    const { updateTaskList, taskList } = useTask();

    const { isInternetAvailable } = useCommon();
    const { collectionLimitsDetails } = useConfig();
    const submittedVisitData = useAppSelector(selectCloseVisit);

    const {
        companyAddressCity,
        companyAddressPincode,
        companyAddressState,
        companyAddressText,
        companyLogo,
        companyType,
        companyName,
        currencySymbol,
        authData
    } = useAuth();
    const offlineRecoveredAmount = useMemo(() => {
        let total = 0;
        Object.values(submittedVisitData).forEach((a) => {
            total += parseFloat(
                String(
                    a?.amount_recovered?.length > 0 ? a?.amount_recovered : '0'
                )
            );
        });
        return total;
    }, [submittedVisitData]);

    const isAmountCollectionAllowed = useCallback(
        (newAmount) => {
            if (
                collectionLimitsDetails.available_limit -
                    offlineRecoveredAmount -
                    newAmount >=
                0
            ) {
                return true;
            }
            return false;
        },
        [offlineRecoveredAmount, collectionLimitsDetails]
    );

    const generateOfflineReceipt = async (
        address: string,
        applicant_name: string,
        taskData: any,
        recVarsFormData: any
    ) => {
        const createPDF = async (data: any) => {
            let options = {
                html: getTemplate(data),
                fileName: 'offlinevisit',
                directory: 'Documents',
                base64: true
            };
            let file: any;

            try {
                file = await RNHTMLtoPDF.convert(options);
                return file;
            } catch (e) {
                throw e;
            }
        };
        const data: ReceiptGenerationDataType = {
            address: address,
            applicant_name: applicant_name!,
            company_name: companyName,
            company_address: companyAddressText,
            company_city: companyAddressCity,
            company_state: companyAddressState,
            company_pincode: companyAddressPincode,
            company_type: companyType!,
            agent_name: authData?.name!,
            loan_id: taskData.loan_id,
            payment_method: taskData.payment_method,
            amount_bifurcation: recVarsFormData,
            currency_code: currencySymbol,
            amount_recovered: taskData.amount_recovered,
            amount_recovered_in_words: keyConverter(
                toWords(taskData.amount_recovered)
            ),
            visit_date: moment().format('DD-MM-YYYY'),
            companyLogo: companyLogo
        };
        let file: any;
        try {
            file = await createPDF(data);
        } catch (e) {
            ToastAndroid.show('Error generating receipt', ToastAndroid.SHORT);
        }
        navigate('ReceiptPDFScreen', {
            url: file.filePath,
            extraData: { type: 'TASK' },
            base64: file.base64
        });
    };

    const closeVisitHook = async (data: closeVisitType, test = false) => {
        const {
            taskType,
            taskData,
            visit_id,
            recVarsFormData,
            isRecoveryAmountBifurcationEnabled,
            applicant_index,
            applicant_type,
            location,
            address,
            address_location,
            allocationMonth,
            applicant_name,
            isTransactionData,
            authData,
            payment_details,
            payment_collection_mode
        } = data;

        const company_id = authData?.company_id;
        const final_statuses = JSON.stringify({
            disposition: taskData.final_status.disposition,
            ...(taskData.final_status.sub_disposition_1.length > 0 && {
                sub_disposition_1: taskData.final_status.sub_disposition_1
            }),
            ...(taskData.final_status.sub_disposition_2.length > 0 && {
                sub_disposition_2: taskData.final_status.sub_disposition_2
            })
        });
        const tempLocation = location?.latitude ? location : {};
        const url = `${FOS_SERVICE_BASE_URL}/visit/close`;

        const formData = new FormData();

        const formdataJSON: any = {
            loan_id: taskData.loan_id,
            visit_id,
            visit_purpose: taskType,
            is_customer_met: taskData.is_customer_met ? '1' : '0',
            is_recovery_done: taskData.is_recovery_done ? '1' : '0',
            is_visit_done: taskData.is_visit_done ? '1' : '0',
            visit_proof_file: taskData.visit_proof_file,
            visit_proof_coordinates: JSON.stringify(location),
            ...(!!payment_details && {
                payment_details: JSON.stringify(payment_details)
            }),
            payment_method: taskData.payment_method,
            payment_proof_coordinates: JSON.stringify(location),
            payment_proof_file: taskData.payment_proof_file,
            amount_recovered: taskData.amount_recovered,
            ...(isRecoveryAmountBifurcationEnabled && {
                amount_bifurcation: JSON.stringify(recVarsFormData)
            }),
            company_id: company_id!,
            allocation_month: allocationMonth!,
            applicant_index: applicant_index,
            applicant_type: applicant_type,
            marked_location: JSON.stringify(tempLocation),
            address_location: JSON.stringify(address_location),
            agent_marked_status: final_statuses,
            reminder_id: taskData.reminder_id ? taskData.reminder_id : '',
            address: address ?? '',
            applicant_name: applicant_name ?? '',
            comment: taskData.comment ?? '',
            payment_collection_mode: payment_collection_mode ?? '',
            ...(isTransactionData && {
                transactions_data: JSON.stringify(taskData.transanctions_data)
            }),
            ...(taskData.committed_amount.length != 0 && {
                committed_amount: taskData.committed_amount ?? ''
            })
        };

        for (let key in formdataJSON) {
            formData.append(key, formdataJSON[key]);
        }

        if (!isInternetAvailable) {
            // checking if collection limit is not exceeded by the user

            if (!isAmountCollectionAllowed(taskData.amount_recovered)) {
                ToastAndroid.show(
                    COLLECTION_LIMIT_ERROR_TEXT,
                    ToastAndroid.LONG
                );
                return;
            }
            setOfflineVisitData({ [visit_id]: formdataJSON });
            const newList = taskList.filter((_task: TaskType) => {
                return _task.visit_id != visit_id;
            });
            updateTaskList(newList);
            return 'success';
        } else {
            const response = await apiRequest({
                url,
                body: formData,
                method: RequestMethods.patch,
                headers: {
                    authenticationtoken: authData?.authenticationtoken,
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response;
        }
    };

    return { closeVisitHook, generateOfflineReceipt };
};
