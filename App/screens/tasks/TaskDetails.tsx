import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import {
  Alert,
  BackHandler,
  StyleSheet,
  ToastAndroid,
  View
} from 'react-native';
import ProofSelectorContainer from '../../components/common/ProofSelector/ProofSelector';
import { useAuth } from '../../hooks/useAuth';
import {
  ImageInputType,
  LoanInternalDetailsType,
  LocationType,
  ModalButtonType,
  TaskBottomSheetData,
  TaskSubmitType,
  VisitData,
  VisitOtpDataType
} from '../../../types';
import DetailsHeader from '../../components/DetailsHeader';
import CustomAppBar from '../../components/common/AppBar';
import {
  generateVisitOtp,
  getFieldVisitHistory
} from '../../services/taskService';
import { useTaskAction } from '../../hooks/useTaskAction';
import {
  checkIfStatusIsPTP,
  checkProofAttached,
  getDecimalCountInString,
  getStraightLineDistance,
  getValidAmountString,
  leadingDebounce,
  showToast
} from '../../services/utils';
import { ProgressDialog } from '../../components/common/Dialogs/ProgessDialog';
import ResultModal from '../../components/modals/ResultModal';
import {
  getPaymentLink,
  getPaymentTemplate
} from '../../services/communicationService';
import {
  CollectionModeTypes,
  DepositTypes,
  LoanStatusType,
  LocationAccessType,
  OtpVerifyTypes,
  PAYMENT_TYPES,
  PermissionType,
  ReminderFromType,
  TaskTypes,
  VisitPurposeType
} from '../../../enums';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { CustomRadioButton } from '../../components/ui/CustomRadioButton';
import { HorizontalLine } from '../../components/HorizontalLine';
import InputWithLabel from '../../components/common/InputWithLabel';
import Typography, {
  TypographyFontFamily,
  TypographyVariants
} from '../../components/ui/Typography';
import CustomButton from '../../components/ui/CustomButton';
import Colors, { BLUE_3, BLUE_DARK } from '../../constants/Colors';
import { TaskBottomSheet } from '../../components/tasks/TaskBottomSheet';
import moment from 'moment';
import {
  LOAN_STATUS_TEXT,
  SMS_CONTENT_TEMPLATE_ID,
  SMS_PRINCIPAL_ENTITY_ID,
  SOMETHING_WENT_WRONG,
  get_email_body,
  get_sms_body,
  otp_max_try_error_string,
  OFFLINE_NOT_ALLOWED_STRING,
  LOAN_IS_CLOSED,
  CLOCK_IN_BEFORE_VISIT
} from '../../constants/constants';
import { CustomModal } from '../../components/modals/ReusableModal';
import { CustomActivityIndicator } from '../../components/placeholders/CustomActivityIndicator';
import { getAddress } from '../../services/utils';
import BottomSheet from '@gorhom/bottom-sheet';
import PaymentLinkBottomSheet from '../../components/tasks/PaymentBottomSheet/PaymentBottomSheet';
import _ from 'lodash';
import { DispositionDropdown } from '../../components/common/DispositionStatusDropdown';
import {
  DispositionFormErrorType,
  DispositionType,
  DropDownType
} from '../../../types';
import { StringCompare } from '../../services/utils';
import {
  createNewReminder,
  getCallingHistory
} from '../../services/callingService';
import {
  createTask,
  getDigitalNotice,
  getLoanDetailsWithLoan,
  getLoanProfile,
  getSpeedPost
} from '../../services/portfolioService';
import { useClockIn } from '../../hooks/useClockIn';
import { ClockInNudgeInitPage } from '../../contexts/ClockInStatusContext';
import CollectionAmountHeading from '../../components/tasks/CollectionAmountHeading';
import CollectionAmountInput from '../../components/tasks/CollectionAmountInput';
import AmountBifurcation from '../../components/tasks/AmountBifurcation';
import { getRecoveredKey } from '../../constants/Keys';
import {
  getDefaultObject,
  modifyCallingHistory,
  modifyReduxLoanDetails
} from '../../constants/ModifyData';
import { useLocation } from '../../hooks/useLocation';
import { getStorageData, setStorageData } from '../../utils/Storage';
import { VISIT_COMPLETE_STORAGE_KEY } from '../../constants/Storage';
import ChequeMethodBottomSheet from '../../components/tasks/ChequeMethodBottomSheet';
import { GreenTickIcon } from '../../components/common/Icons/GreenTickIcon';
import { useMixpanel } from '../../contexts/MixpanelContext';
import { EventScreens, TaskDetailsEventTypes } from '../../constants/Events';
import useLoanDetails from '../../hooks/useLoanData';
import useCommon from '../../hooks/useCommon';
import { useAction } from '../../hooks/useAction';
import { useCloseVisit } from '../../hooks/useCloseVisit';
import ClosedLoanErrorModal from '../../components/modals/ClosedLoanErrorModal';
import useOfflineVisitData from '../../hooks/useOfflineVisitData';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';

const radioButtonColors = [Colors.common.green1, Colors.common.red2];

const HorizontalLineContainer = () => (
  <HorizontalLine
    type="dashed"
    style={{
      paddingHorizontal: 20,
      paddingVertical: 15
    }}
  />
);

export default function TaskDetails({
  route,
  navigation
}: {
  route: any;
  navigation: any;
}) {
  const { visit_id, reminder_id } = route.params;
  const {
    authData,
    collectionModes,
    isFeedbackResponseNeeded,
    companyName,
    otpVerificationRequired,
    getCurrencyString,
    geoFencingRequired,
    geofencingDistance,
    isRecoveryAmountBifurcationEnabled,
    showBalanceClaimAmount,
    locationAccess,
    chequeDetailsInput,
    setMockLocationEnabled,
    onlineCollectionMode,
    setDepositBranch
  } = useAuth();
  const { allowLocationAccess, requestLocation } = useLocation();
  const { checkClockInNudge } = useClockIn();
  const { logEvent } = useMixpanel();
  const { closeVisitHook, generateOfflineReceipt } = useCloseVisit();
  const { recoveryVariables } = useOfflineVisitData();
  const { loanDetailMap, selectedLoanData, getAddressData, setLoanDetailMap } =
    useLoanDetails();
  const { newAddressAdded } = useAction();

  useEffect(() => {
    logEvent(
      TaskDetailsEventTypes.screen_mounted,
      EventScreens.visit_submission_screen,
      {}
    );
    checkClockInNudge(ClockInNudgeInitPage.visit);
  }, []);

  let task_type;
  if (
    StringCompare(
      selectedLoanData.visit_purpose,
      VisitPurposeType.surprise_visit
    )
  ) {
    task_type = TaskTypes.visit;
  } else if (
    StringCompare(
      selectedLoanData.visit_purpose,
      VisitPurposeType.promise_to_pay
    )
  ) {
    task_type = TaskTypes.ptp;
  }
  const taskType = route?.params?.taskType ?? task_type;

  const VISIT_ID = visit_id ? visit_id : selectedLoanData.visit_id;
  const REMINDER_ID = selectedLoanData.reminder_id ?? reminder_id;
  const ALLOCATION_MONTH = selectedLoanData.allocation_month;

  const {
    imageProvider,
    imageSetterProvider,
    setUpdateTaskDetails,
    updatedContactDetails,
    updatedAddressIndex,
    setNewVisitCreated,
    setVisitSubmitted,
    setOnlineTabChangeIdx
  } = useTaskAction();

  const { showNudge, clockInStatus } = useClockIn();
  const isFocused = useIsFocused();

  const paymentLinkBottomSheetRef = useRef<BottomSheet>(null);
  const chequeMethodBottomSheetRef = useRef<BottomSheet>(null);
  const [onlinePaymentLink, setOnlinePaymentLink] = useState('');

  const [button, setButton] = useState(false);
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);
  const [details, setDetails] = useState<LoanInternalDetailsType>();
  const [detailsLoading, setDetailsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [visit, isVisit] = useState(false);
  const [recovery, isRecovery] = useState(false);
  const [customer, isCustomer] = useState(false);
  const [paymentMode, setPaymentMode] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [finalStatus, setFinalStatus] = useState('');
  const [error, setError] = useState(true);
  const [otpInput, setOtpInput] = useState(false);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [resendOtpTime, setResendOtpTime] = useState(30);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [geoFencingErrors, setGeoFencingErrors] = useState(false);
  const [locationLoader, setLocationLoader] = useState(false);
  const [localLocation, setLocalLocation] = useState<LocationType>({
    latitude: 0,
    longitude: 0
  });
  const [reminderRequired, setReminderRequired] = useState(false);
  const [amountRequired, setAmountRequired] = useState(false);
  const [checkedStep, setCheckedStep] = useState('');
  const [remarkRequired, setRemarkRequired] = useState(false);
  const [dispositionDropdown, setDispositonDropdown] = useState<
    Array<DropDownType>
  >([]);
  const [subDispositionOneDropdown, setSubDispositionOneDropdown] = useState<
    Array<DropDownType>
  >([]);
  const [subDispositionTwoDropdown, setSubDispositionTwoDropdown] = useState<
    Array<DropDownType>
  >([]);
  const [selectedDisposition, setSelectedDisposition] =
    useState<DispositionType>();
  const [selectedDispositionOne, setSelectedDispositionOne] =
    useState<DispositionType>();
  const [selectedDispositionTwo, setSelectedDispositionTwo] =
    useState<DispositionType>();
  const [dispositon, setDisposition] = useState('');
  const [subDispositionOne, setSubDispostionOne] = useState('');
  const [subDispositionTwo, setSubDispostionTwo] = useState('');
  const [reminderDate, setReminderDate] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const [committedAmount, setCommittedAmount] = useState('');
  const [subDispositionOneReq, setSubDispositionOneReq] = useState(false);
  const [subDispositionTwoReq, setSubDispositionTwoReq] = useState(false);

  const [recVars, setRecVars] = useState({});
  const [recVarsFormData, setRecVarsFormData] = useState({});
  const [chequePaymentFormData, setChequePaymentFormData] = useState({});
  const [bankTransferFormData, setBankTransferFormData] = useState({});
  const [isBifurcatedCollection, setIsBifurcatedCollection] = useState(false);
  const [digitalNotice, setDigitalNotice] = useState([]);
  const [speedPost, setSpeedPost] = useState([]);
  const [isEditClicked, setIsEditClicked] = useState(true);
  const [isPaymentTemplatePresent, setIsPaymentTemplatePresent] = useState({
    sms: false,
    email: false
  });
  const [verificationOTP, setVerificationOTP] = useState('');
  const [automaticBifurMode, setAutomaticBifurMode] = useState(false);
  const { isInternetAvailable, continueIfOnline } = useCommon();
  const [paymentType, setPaymentType] = useState('');
  const [isVisitAlreadyClicked, setIsVisitAlreadyClicked] = useState(false);

  const bottomSheetData: TaskBottomSheetData = {
    visit_id: VISIT_ID,
    contact_number: details?.contact_number,
    email_address: details?.email_address
  };
  const proofs: Array<ImageInputType> = [
    {
      title: 'Proof of Visit',
      show: visit,
      imageTag: 'visit'
    },
    {
      title: 'Proof of Collection',
      show: recovery,
      imageTag: 'recovery'
    }
  ];
  const addressData = getAddressData(
    ALLOCATION_MONTH,
    selectedLoanData.loan_id
  );

  const convertedPrimaryAddress = getAddress(
    addressData?.applicant_type,
    details?.address?.primary
  );

  const [emailsArray, setEmailsArray] = useState<Array<string>>([]);
  const [mobilesArray, setMobilesArray] = useState<Array<string>>([]);
  const [callingHistory, setCallingHistory] = useState<any>();
  const [visitHistory, setVisitHistory] = useState([]);
  const [utrNumber, setUtrNumber] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  console.log(authData?.authenticationtoken);
  const onSetPaymentMode = (method: string) => {
    if (!isInternetAvailable && method == DepositTypes.online) {
      return;
    }
    setPaymentMode(method);
    if (method === DepositTypes.online && !!onlineCollectionMode) {
      paymentLinkBottomSheetRef.current?.snapToIndex(1);
      chequeMethodBottomSheetRef.current?.close();
      setOnlineTabChangeIdx(0);
      setDepositBranch(undefined);
      setPaymentDate('');
      setUtrNumber('');
      ToastAndroid.showWithGravityAndOffset(
        `Use the online method for receiving money only in your company's account`,
        ToastAndroid.LONG,
        ToastAndroid.TOP,
        0,
        120
      );
      setIsBifurcatedCollection(false);
    } else if (method === DepositTypes.cheque && chequeDetailsInput) {
      isEditClicked
        ? chequeMethodBottomSheetRef.current?.snapToIndex(2)
        : chequeMethodBottomSheetRef.current?.snapToIndex(1);

      paymentLinkBottomSheetRef.current?.close();
    } else {
      paymentLinkBottomSheetRef.current?.close();
      chequeMethodBottomSheetRef.current?.close();
    }
  };

  const logVisitSubmissionEvent = (
    taskType: TaskTypes,
    taskData: TaskSubmitType,
    applicant_index: string,
    applicant_type: string,
    location: LocationType | any,
    address_location: LocationType | any
  ) => {
    const final_statuses = JSON.stringify({
      disposition: taskData.final_status.disposition,
      ...(taskData.final_status.sub_disposition_1.length > 0 && {
        sub_disposition_1: taskData.final_status.sub_disposition_1
      }),
      ...(taskData.final_status.sub_disposition_2.length > 0 && {
        sub_disposition_2: taskData.final_status.sub_disposition_2
      })
    });
    logEvent(TaskDetailsEventTypes.visit_submission, route.name, {
      success: false,
      value: {
        loan_id: taskData?.loan_id,
        visit_id: VISIT_ID,
        visit_purpose: taskType,
        is_visit_done: taskData.is_visit_done,
        is_recovery_done: taskData.is_recovery_done,
        is_customer_met: taskData.is_customer_met,
        amount_recovered: taskData.amount_recovered,
        payment_method: taskData.payment_method,
        agent_marked_status: final_statuses,
        marked_location: JSON.stringify(location),
        address_location: JSON.stringify(address_location),
        applicant_index: applicant_index,
        applicant_type: applicant_type
      }
    });
  };

  function checkIfDateTimeValid(date: string, time: string) {
    try {
      if (
        reminderRequired &&
        reminderDate.length > 0 &&
        reminderTime.length > 0
      ) {
        const d = date.split('-');
        const t = time.split(':');
        const x = new Date(...d, ...t);
        x.setMonth(x.getMonth() - 1); // months are indexes
        return x > new Date();
      } else return true;
    } catch (e) {}
  }

  const generate_visit_otp = async () => {
    const emailBodyString = get_email_body(
      amount,
      moment(selectedLoanData.visit_date).format('DD-MM-YYYY, HH:MM:SS'),
      selectedLoanData.loan_id,
      companyName,
      authData?.name
    );
    const smsBodyString = get_sms_body(
      amount,
      moment(selectedLoanData.visit_date).format('DD-MM-YYYY, HH:MM:SS'),
      selectedLoanData.loan_id,
      companyName,
      authData?.name
    );

    if (!details?.email_address && !details?.contact_number) {
      ToastAndroid.show(
        'No Email Address and Mobile number found for OTP verification',
        ToastAndroid.LONG
      );
      return;
    }

    const VisitOtpData: VisitOtpDataType = {
      destination: VISIT_ID,
      otp_type: 'visit',
      other_fields: {
        email: emailsArray,
        mobile: mobilesArray,
        email_data: {
          from_data: {
            name: 'Visit Report',
            email: 'info@credgenics.com'
          },
          subject: 'Field Verification OTP',
          email_body: emailBodyString
        },
        sms_data: {
          sms_body: smsBodyString,
          content_template_id: SMS_CONTENT_TEMPLATE_ID,
          principal_entity_id: SMS_PRINCIPAL_ENTITY_ID
        }
      }
    };
    try {
      const apiResponse = await generateVisitOtp(VisitOtpData);
      bottomSheetRef.current?.expand();
      setBottomSheetOpen(true);
      setOtpInput(true);
      setResendOtpTime(30);
      return apiResponse?.status;
    } catch (e) {
      if (e.response.status == 401)
        ToastAndroid.show(otp_max_try_error_string, ToastAndroid.LONG);
      else ToastAndroid.show(`Unable to send the OTP`, ToastAndroid.LONG);
      return e.response.status;
    }
  };

  const createFollowUp = (type: TaskTypes) => {
    navigation.replace('NewTaskScreen', {
      loanData: [selectedLoanData],
      taskType: type,
      allocationMonth: ALLOCATION_MONTH
    });
  };

  const enableSubmitButton = () => {
    if (
      (recovery && finalStatus === '') ||
      (recovery && amount === '') ||
      (recovery && paymentMode === '') ||
      (recovery &&
        paymentMode === DepositTypes.cheque &&
        chequeDetailsInput &&
        !(Object.keys(chequePaymentFormData).length > 0)) ||
      (recovery &&
        paymentMode === DepositTypes.online &&
        paymentType === PAYMENT_TYPES.bankTransfer &&
        !(Object.keys(bankTransferFormData).length > 0))
    ) {
      return true;
    }

    if (recovery && !LOAN_STATUS_TEXT.includes(finalStatus)) return true;

    // check for status
    if (!recovery && Object.keys(validateDispositionForm()).length != 0) {
      return true;
    }

    const visit_proof = checkProofAttached(visit, imageProvider('visit'));
    const recovery_proof = checkProofAttached(
      recovery,
      imageProvider('recovery')
    );
    if ((visit && !visit_proof) || (recovery && !recovery_proof)) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    (async () => {
      try {
        const paymentLinkResponse = await getPaymentLink(
          selectedLoanData.loan_id,
          ALLOCATION_MONTH,
          authData
        );
        if (paymentLinkResponse?.data) {
          setOnlinePaymentLink(
            paymentLinkResponse?.data?.data[selectedLoanData.loan_id] ?? ''
          );
        }
      } catch {}
      try {
        const paymentTemplateResponse = await getPaymentTemplate(authData);

        if (paymentTemplateResponse?.data) {
          const data = paymentTemplateResponse?.data?.output ?? [];
          for (let _data of data) {
            if (StringCompare(_data?.event_name, 'fos_payment_template')) {
              if (_data?.email)
                setIsPaymentTemplatePresent((_p) => ({
                  ..._p,
                  ['email']: true
                }));
              if (_data?.sms) {
                setIsPaymentTemplatePresent((_p) => ({
                  ..._p,
                  ['sms']: true
                }));
              }
              break;
            }
          }
        }
      } catch {}
    })();
  }, []);

  useEffect(() => {
    if (!isRecoveryAmountBifurcationEnabled) return;
    try {
      const data = getDefaultObject(
        loanDetailMap[selectedLoanData.loan_id].loan_data,
        ALLOCATION_MONTH
      );

      const newObj: any = {};
      const newObjForm: any = {};
      recoveryVariables.forEach((a: string) => {
        if (data[a]) {
          newObj[a] = data[a];
          newObjForm[getRecoveredKey(a)] = 0;
        }
      });

      setRecVars(newObj);
      setRecVarsFormData(newObjForm);
    } catch (e) {
      ToastAndroid.show(
        'Error fetching recovery variables',
        ToastAndroid.SHORT
      );
    }
  }, [isRecoveryAmountBifurcationEnabled, recoveryVariables]);

  useEffect(() => {
    if (!recovery) {
      setAmount('');
      onSetPaymentMode('');
      imageSetterProvider('recovery')('');
    }

    if (!visit) {
      imageSetterProvider('visit')('');
      if (!collectionModes.includes(DepositTypes.online)) {
        setAmount('');
        onSetPaymentMode('');
        isRecovery(false);
      }
    }
    const timer = setInterval(() => {
      const value = enableSubmitButton();
      setError(value);
    }, 500);
    return () => clearInterval(timer);
  }, [enableSubmitButton, recovery, visit, paymentMode]);

  useEffect(() => {
    if (isFocused) {
      if (isVisitAlreadyClicked && clockInStatus) {
        setIsVisitAlreadyClicked(false);
        openConfirmModal();
      }
    } else setIsVisitAlreadyClicked(false);
  }, [isVisitAlreadyClicked, clockInStatus]);

  const openConfirmModal = async () => {
    if (!clockInStatus && isInternetAvailable) {
      ToastAndroid.show(CLOCK_IN_BEFORE_VISIT, ToastAndroid.SHORT);
      showNudge();
      setIsVisitAlreadyClicked(true);
      return;
    }

    const isValid = checkIfDateTimeValid(reminderDate, reminderTime);
    if (!isValid) {
      ToastAndroid.show(
        'This time has passed, please select a future time.',
        ToastAndroid.LONG
      );
      return;
    }
    if (recovery && paymentMode === DepositTypes.online && !paymentType) {
      showToast('Please select at least one online collection mode');
      return;
    }
    if (
      !recovery &&
      checkedStep.length > 0 &&
      (reminderDate.length == 0 || reminderTime.length == 0)
    ) {
      ToastAndroid.show(
        'Please select reminder date or time',
        ToastAndroid.SHORT
      );
      return;
    }
    if (!recovery && getDecimalCountInString(committedAmount) > 1) {
      ToastAndroid.show(
        'Please enter correct amount in Committed Amount',
        ToastAndroid.SHORT
      );
      return;
    }

    if (recovery && getDecimalCountInString(amount) > 1) {
      ToastAndroid.show(
        'Please enter correct amount in Collection Amount',
        ToastAndroid.SHORT
      );
      return;
    }
    let permission = PermissionType.DENIED;
    if (locationAccess != LocationAccessType.disable_all) {
      permission = await requestLocation();
    }

    if (permission == PermissionType.GRANTED) {
      setLocationLoader(true);
      try {
        const locationObject = await allowLocationAccess();
        if (locationObject?.isMocked) {
          setMockLocationEnabled(true);
          return;
        }

        const { isMocked, ...latestLocation } = locationObject.location;
        setLocalLocation(latestLocation);
        const address_location = {
          latitude: convertedPrimaryAddress?.latitude ?? '',
          longitude: convertedPrimaryAddress?.longitude ?? ''
        };
        const linearDistance = getStraightLineDistance(
          address_location,
          latestLocation
        );
        let localGeoFencingError;
        localGeoFencingError =
          linearDistance > geofencingDistance ? true : false;
        setGeoFencingErrors(localGeoFencingError);
        if (geoFencingRequired && localGeoFencingError) {
          setShowErrorModal(true);
        } else setShowConfirmModal(true);
      } catch (e) {
        ToastAndroid.show('Unable to fetch live location', ToastAndroid.SHORT);
      }
      setLocationLoader(false);
    } else {
      if (locationAccess == LocationAccessType.enable_hard_prompt) {
        ToastAndroid.show(
          'This functionality is supported only with location access',
          ToastAndroid.LONG
        );
        return;
      } else setShowConfirmModal(true);
    }
  };

  //DISPOSITION STATUSES DROPDOWN CONFIG

  const validateDispositionForm = () => {
    let errors: DispositionFormErrorType = {};
    if (continueIfOnline(reminderDate.length == 0 && reminderRequired)) {
      errors.reminder_date_required = 'Reminder date is required';
    }
    if (continueIfOnline(reminderTime.length == 0 && reminderRequired)) {
      errors.reminder_time_required = 'Reminder time is required';
    }
    if (committedAmount.length == 0 && amountRequired) {
      errors.amount_required = 'Commmitted amount is required';
    }
    if (dispositon.length == 0) {
      errors.disposition = 'Disposition is required';
    }
    if (subDispositionOne.length == 0 && subDispositionOneReq) {
      errors.sub_disposition1 = 'Sub disposition 1 is required';
    }
    if (subDispositionTwo.length == 0 && subDispositionTwoReq) {
      errors.sub_disposition2 = 'Sub disposition 2 is required';
    }
    if (continueIfOnline(reminderDate.length > 0 && checkedStep.length == 0)) {
      errors.checked_step = 'Checked step is required';
    }
    if (comment.length == 0 && remarkRequired) {
      errors.remark_required = 'Remark/Comment is required';
    }
    return errors;
  };
  const onTaskSubmit = async function () {
    await onTaskSubmitInternal();
  };

  const onTaskSubmitWrapper = useCallback(
    leadingDebounce(() => {
      if (
        (paymentMode == DepositTypes.cash ||
          paymentMode == DepositTypes.cheque) &&
        otpVerificationRequired
      ) {
        if (!isInternetAvailable) {
          ToastAndroid.show(OFFLINE_NOT_ALLOWED_STRING, ToastAndroid.SHORT);
          return;
        }
        generate_visit_otp();
      } else {
        onTaskSubmit();
      }
      setShowConfirmModal(false);
    }, 2000),
    [generate_visit_otp, onTaskSubmit]
  );

  const onTaskSubmitInternal = async (): Promise<void> => {
    if (!taskType) {
      ToastAndroid.show('Invalid field visit type', ToastAndroid.SHORT);
      return;
    }
    let recVarsValidAmt = 0;
    let recInputValues = Object.values(recVarsFormData);
    let recValidValues = Object.values(recVars);
    let errorFlag = false;
    // for (let i = 0; i < recInputValues.length; i++) {
    //     recVarsValidAmt += parseFloat(String(recValidValues[i]));
    //     if (
    //         parseFloat(String(recInputValues[i])) >
    //         parseFloat(String(recValidValues[i]))
    //     ) {
    //         errorFlag = true;
    //         break;
    //     }
    // }
    //console.log(recVarsValidAmt, amount);
    // if (
    //     (recVarsValidAmt < parseFloat(amount) || errorFlag) &&
    //     isRecoveryAmountBifurcationEnabled &&
    //     paymentMode != DepositTypes.online
    // ) {
    //     ToastAndroid.show(
    //         'Enter valid recovery amount',
    //         ToastAndroid.SHORT
    //     );
    //     return;
    // }

    if (loading) return;
    setLoading(true);
    setShowConfirmModal(false);
    const taskData: TaskSubmitType = {
      loan_id: selectedLoanData.loan_id ?? '',
      visit_id: VISIT_ID,
      is_visit_done: visit,
      is_recovery_done: recovery,
      is_customer_met: customer,
      reminder_id: REMINDER_ID ?? '',
      amount_recovered: getValidAmountString(amount),
      payment_method: paymentMode,
      visit_proof_file: '',
      payment_proof_file: '',
      final_status: {
        disposition: !recovery ? selectedDisposition?.text ?? '' : finalStatus,
        sub_disposition_1: !recovery ? selectedDispositionOne?.text ?? '' : '',
        sub_disposition_2: !recovery ? selectedDispositionTwo?.text ?? '' : ''
      },
      comment: comment.trim(),
      address_index: selectedLoanData?.address_index ?? 0,
      committed_amount: getValidAmountString(committedAmount) ?? ''
    };

    const visit_proof = checkProofAttached(visit, imageProvider('visit'));
    const recovery_proof = checkProofAttached(
      recovery,
      imageProvider('recovery')
    );
    taskData.payment_proof_file = recovery_proof !== true ? recovery_proof : '';
    taskData.visit_proof_file = visit_proof !== true ? visit_proof : '';

    let address_location = {};

    if (details?.address?.primary) {
      if (
        convertedPrimaryAddress?.latitude &&
        convertedPrimaryAddress?.longitude
      ) {
        address_location = {
          latitude: Number(convertedPrimaryAddress?.latitude ?? 0),
          longitude: Number(convertedPrimaryAddress?.longitude ?? 0)
        };
      }
    }
    logVisitSubmissionEvent(
      taskType,
      taskData,
      addressData?.applicant_index ?? -1,
      addressData?.applicant_type,
      localLocation,
      address_location
    );

    let payment_details =
      paymentMode === DepositTypes.cheque
        ? chequePaymentFormData
        : paymentMode === DepositTypes.online &&
          paymentType === PAYMENT_TYPES.bankTransfer
        ? bankTransferFormData
        : null;
    let payment_collection_mode =
      paymentType === PAYMENT_TYPES.bankTransfer
        ? CollectionModeTypes.bank_transfer
        : paymentType === PAYMENT_TYPES.qrLink ||
          paymentType === PAYMENT_TYPES.paymentLink
        ? CollectionModeTypes.payment_link_qr
        : '';
    try {
      const apiResponse = await closeVisitHook({
        taskType,
        taskData,
        visit_id: VISIT_ID,
        recVarsFormData,
        isRecoveryAmountBifurcationEnabled,
        applicant_index: addressData?.applicant_index ?? -1,
        applicant_type: addressData?.applicant_type,
        location: localLocation,
        address: convertedPrimaryAddress?.address_text,
        allocationMonth: ALLOCATION_MONTH,
        address_location: address_location,
        payment_details: payment_details,
        payment_collection_mode: payment_collection_mode,
        isTransactionData: false,
        applicant_name: selectedLoanData?.applicant_name,
        authData: authData
      });
      if (apiResponse === 'success') {
        setVisible(true);
        setButton(true);
        setMessage('Visit closed successfully');
      }
      if (apiResponse?.success) {
        const message = apiResponse?.message;

        logEvent(TaskDetailsEventTypes.visit_submission_api, route.name, {
          success: apiResponse?.success ?? '',
          value: {
            data: apiResponse?.data ?? {},
            message
          },
          visit_id: VISIT_ID
        });
        setVisitSubmitted(true);
        if (
          apiResponse?.data?.collection_receipt &&
          !apiResponse?.data?.collection_receipt?.success
        ) {
          ToastAndroid.show(
            apiResponse?.data?.collection_receipt?.message,
            ToastAndroid.SHORT
          );
        }
        if (
          apiResponse?.data?.mark_location &&
          !apiResponse?.data?.mark_location?.success
        ) {
          ToastAndroid.show(
            apiResponse?.data?.mark_location?.message,
            ToastAndroid.SHORT
          );
        }

        const close = () => {
          setMessage(message);
          setButton(true);
          setVisible(true);
          setUpdateTaskDetails(selectedLoanData);
        };

        if (isFeedbackResponseNeeded) {
          Alert.alert(
            'Feedback Form',
            'Please fill the survey form',
            [
              {
                text: 'Fill Now',
                onPress: () => {
                  navigation.navigate('QuestionnaireScreen', {
                    visitId: VISIT_ID,
                    modal: true,
                    modalDetails: {
                      message,
                      selectedLoanData
                    },
                    ALLOCATION_MONTH
                  });
                }
              },
              {
                text: 'Fill Later',
                style: 'cancel',
                onPress: () => close()
              }
            ],
            {
              cancelable: false
            }
          );
        } else {
          close();
          try {
            let completeVisitsData: any = {};
            try {
              const storageVisitsData = await getStorageData(
                VISIT_COMPLETE_STORAGE_KEY
              );
              if (storageVisitsData)
                completeVisitsData = JSON.parse(storageVisitsData);
            } catch (error) {}
            completeVisitsData[VISIT_ID] = true;
            await setStorageData(
              VISIT_COMPLETE_STORAGE_KEY,
              JSON.stringify(completeVisitsData)
            );
          } catch (e) {}
        }
      }
    } catch (error) {
      logEvent(TaskDetailsEventTypes.visit_submission_api, route.name, {
        success: false,
        value: {
          message: error ?? ''
        }
      });
    }
    if (reminderDate.length > 0) {
      let apiRemindertime = reminderTime;
      if (reminderTime.length == 0) apiRemindertime = '00:00:00';
      const newReminderBody = {
        reminder_status: selectedDisposition?.text ?? '',
        reminder_date: `${reminderDate} ${apiRemindertime}`,
        reminder_from: 'field_visit',
        next_step: checkedStep == 'Visit' ? 'field_visit' : 'call',
        source: 'fos_app',
        comment: '',
        shoot_id: VISIT_ID
      };
      if (checkedStep === 'Call') {
        try {
          const createNewReminderResponse = await createNewReminder(
            newReminderBody,
            selectedLoanData.loan_id,
            ALLOCATION_MONTH,
            authData
          );
          if (createNewReminderResponse?.data) {
            ToastAndroid.show(
              createNewReminderResponse.data?.output ??
                'Reminder created successfully',
              ToastAndroid.SHORT
            );
          }
        } catch (e) {
          ToastAndroid.show('Some error occurred', ToastAndroid.SHORT);
        }
      } else if (checkedStep == 'Visit') {
        const ifPTP = checkIfStatusIsPTP(
          selectedDisposition,
          selectedDispositionOne,
          selectedDispositionTwo
        );

        if (ifPTP) {
          try {
            const newReminderRes = await createNewReminder(
              newReminderBody,
              selectedLoanData.loan_id,
              ALLOCATION_MONTH,
              authData
            );
            ToastAndroid.show(
              newReminderRes?.data?.output ?? 'Reminder created successfully',
              ToastAndroid.SHORT
            );
            if (newReminderRes?.data) {
              try {
                const newTaskResponse = await createTask(
                  {
                    loan_id: selectedLoanData.loan_id,
                    visit_date: `${reminderDate} ${apiRemindertime}`,
                    address_index: selectedLoanData.address_index,
                    applicant_index: selectedLoanData.applicant_index,
                    applicant_name: selectedLoanData.applicant_name,
                    applicant_type: selectedLoanData.applicant_type,
                    comment: ''
                  } as VisitData,
                  ALLOCATION_MONTH,
                  TaskTypes.ptp,
                  authData,
                  false,
                  ReminderFromType.field_visit,
                  newReminderRes.data.reminder_id ?? ''
                );
                if (newTaskResponse?.success) {
                  ToastAndroid.show(
                    newTaskResponse?.message ??
                      'Visit/PTP submitted successfully',
                    ToastAndroid.SHORT
                  );
                }
              } catch (e) {}
            }
          } catch (e: any) {
            ToastAndroid.show(
              e.response?.message ?? 'Error',
              ToastAndroid.SHORT
            );
          }
        } else {
          try {
            const newReminderRes = await createNewReminder(
              newReminderBody,
              selectedLoanData.loan_id,
              ALLOCATION_MONTH,
              authData
            );
            if (newReminderRes?.data) {
              if (!newReminderRes?.data) {
                ToastAndroid.show(
                  'Reminder Created successfully',
                  ToastAndroid.SHORT
                );
                return;
              }
              try {
                const newTaskResponse = await createTask(
                  {
                    loan_id: selectedLoanData.loan_id,
                    visit_date: `${reminderDate} ${apiRemindertime}`,
                    address_index: selectedLoanData.address_index,
                    applicant_index: selectedLoanData.applicant_index,
                    applicant_name: selectedLoanData.applicant_name,
                    applicant_type: selectedLoanData.applicant_type,
                    comment: ''
                  } as VisitData,
                  ALLOCATION_MONTH,
                  TaskTypes.visit,
                  authData,
                  false,
                  ReminderFromType.field_visit,
                  newReminderRes.data.reminder_id ?? ''
                );
                if (newTaskResponse?.success) {
                  ToastAndroid.show(
                    newTaskResponse?.message ?? 'Success',
                    ToastAndroid.SHORT
                  );
                }
              } catch (e) {}
            }
          } catch (e) {}
        }
      }
    }
    setLoading(false);
  };

  //RESET IMAGE FIELDS
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      imageSetterProvider('visit')('');
      imageSetterProvider('recovery')('');
      imageSetterProvider('deposit')('');
    });
    return unsubscribe;
  }, [navigation]);

  //LOAD STATUS LIST FOR TASK DETAILS
  useEffect(() => {
    setEmailsArray([...(details?.email_address?.split(',') ?? [''])]);
    setMobilesArray([...(details?.contact_number?.split(',') ?? [''])]);
  }, [details]);

  //LOAD TASK DETAILS

  const fetchTaskDetails = async () => {
    setDetailsLoading(true);
    try {
      let tempLoanDetail: any = {};
      if (!isInternetAvailable) {
        tempLoanDetail = _.cloneDeep(loanDetailMap[selectedLoanData.loan_id]);
      } else {
        const res = await getLoanDetailsWithLoan(
          [
            {
              allocation_month: ALLOCATION_MONTH,
              loan_id: selectedLoanData.loan_id
            }
          ],
          authData
        );
        tempLoanDetail = res[selectedLoanData.loan_id];
      }

      const loanDetails = await modifyReduxLoanDetails(
        tempLoanDetail,
        ALLOCATION_MONTH,
        showBalanceClaimAmount
      );
      setDetails(loanDetails);
    } catch (e: any) {
      console.log(e, 'error');
      ToastAndroid.show(
        e?.response?.output ?? 'Some error occurred',
        ToastAndroid.SHORT
      );
    }
    if (isInternetAvailable) {
      try {
        const [
          callingApiResponse,
          visitHistoryApiResponse,
          digitalNoticeApiResponse,
          speedPostApiResponse
        ] = await Promise.all([
          getCallingHistory(selectedLoanData.loan_id, authData),
          getFieldVisitHistory(selectedLoanData.loan_id, authData),
          getDigitalNotice(
            selectedLoanData.loan_id,
            ALLOCATION_MONTH,
            authData
          ),
          getSpeedPost(selectedLoanData.loan_id, ALLOCATION_MONTH, authData)
        ]);
        if (callingApiResponse?.success) {
          const tempHis = modifyCallingHistory(callingApiResponse?.data ?? []);
          setCallingHistory(tempHis);
        }
        if (visitHistoryApiResponse?.data) {
          setVisitHistory(visitHistoryApiResponse?.data ?? []);
        }
        if (digitalNoticeApiResponse?.data) {
          setDigitalNotice(digitalNoticeApiResponse?.data?.output ?? []);
        }
        if (speedPostApiResponse?.data) {
          setSpeedPost(speedPostApiResponse?.data?.output ?? []);
        }
      } catch (e: any) {
        let msg = SOMETHING_WENT_WRONG;
        ToastAndroid.show(
          e?.response?.data?.output ?? e?.response?.data?.message ?? msg,
          ToastAndroid.SHORT
        );
      }
    }
    setDetailsLoading(false);
  };

  const updateLoanDetails = async () => {
    try {
      const response = await getLoanDetailsWithLoan(
        [
          {
            loan_id: selectedLoanData.loan_id,
            allocation_month: selectedLoanData.allocation_month
          }
        ],
        authData
      );
      setLoanDetailMap({
        [selectedLoanData.loan_id]: response[selectedLoanData.loan_id]
      });
    } catch {}
  };

  useEffect(() => {
    if (isInternetAvailable) updateLoanDetails();
  }, [newAddressAdded]);

  useEffect(() => {
    fetchTaskDetails();
  }, [
    selectedLoanData,
    updatedContactDetails,
    updatedAddressIndex,
    loanDetailMap
  ]);

  let modalExtraProps = null;
  if (button)
    modalExtraProps = (
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

  //BottomSheetConfig
  const bottomSheetRef = useRef<BottomSheet>(null);
  useEffect(() => {
    const backAction = () => {
      paymentLinkBottomSheetRef.current?.close();
      chequeMethodBottomSheetRef.current?.close();
      if (bottomSheetOpen) {
        bottomSheetRef.current?.close();
        setBottomSheetOpen(false);
        setOtpInput(false);
      }
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [
    bottomSheetRef,
    bottomSheetOpen,
    paymentLinkBottomSheetRef,
    chequeMethodBottomSheetRef
  ]);

  const CustomHeaderString = 'Are you sure you want to submit the Visit Form?';
  const CustomHeaderComponent = () => (
    <View>
      {parseInt(getValidAmountString(amount)) > 0 ? (
        <Typography
          style={[
            styles.headerText,
            {
              marginBottom: RFPercentage(1),
              fontSize: RFPercentage(2.1)
            }
          ]}
        >{`Amount Collected: ${getCurrencyString(
          getValidAmountString(amount)
        )}`}</Typography>
      ) : null}
      <Typography style={styles.headerText}>{CustomHeaderString}</Typography>
    </View>
  );

  const CustomModaldata: Array<ModalButtonType> = [
    {
      buttonText: 'No, Wait',
      buttonTextStyle: styles.buttonOneText,
      buttonStyle: styles.buttonOneContainer,
      buttonFunction: () => setShowConfirmModal(false)
    },
    {
      buttonText: 'Yes, Submit',
      buttonTextStyle: styles.buttonTwoText,
      buttonStyle: styles.buttonTwoContainer,
      buttonFunction: onTaskSubmitWrapper
    }
  ];

  const CustomErrorHeaderModal = () => {
    return (
      <View>
        <Typography
          style={[styles.headerText, { lineHeight: RFPercentage(3) }]}
        >
          {`Not allowed to close the visit outside the allowed distance from the customer.`}
        </Typography>
      </View>
    );
  };

  const checkVisitType = (modalExtraProps: any) => {
    if (
      (reminderDate.length == 0 && reminderTime.length == 0) ||
      checkedStep == 'Call'
    ) {
      return modalExtraProps;
    }
    return null;
  };

  const CustomModalErrorData: Array<ModalButtonType> = [
    {
      buttonText: 'Okay',
      buttonFunction: () => {
        setShowErrorModal(false);
      },
      buttonTextStyle: styles.buttonTwoText,
      buttonStyle: styles.buttonTwoContainer
    }
  ];

  let extraStyles = {};
  if (recovery && paymentMode == DepositTypes.online) {
    extraStyles = { paddingBottom: '10%' };
  }

  const setIsBifurcatedCollectionWrapper = (updatedIsBifColl: boolean) => {
    if (updatedIsBifColl) {
      let total = 0;
      Object.values(recVarsFormData).forEach(
        (data) => (total += parseInt(data as string))
      );
      setAmount(String(total));
    }
    setIsBifurcatedCollection(updatedIsBifColl);
  };

  const filteredCollectionModes = useMemo(() => {
    return visit
      ? collectionModes
      : collectionModes.filter((mode) => mode === DepositTypes.online);
  }, [collectionModes, visit]);

  const showBifurcation = useMemo(() => {
    let _showBifurcation = isRecoveryAmountBifurcationEnabled;

    return _showBifurcation;
  }, [isRecoveryAmountBifurcationEnabled]);

  const generateOfflineReceiptWrapper = () => {
    const taskData = {
      loan_id: selectedLoanData.loan_id,
      payment_method: paymentMode,
      amount_recovered: getValidAmountString(amount)
    };
    generateOfflineReceipt(
      convertedPrimaryAddress?.address_text!,
      selectedLoanData.applicant_name,
      taskData,
      recVarsFormData
    );
    setVisible(false);
  };
  const disableCollectionInput = useMemo(() => {
    return isRecoveryAmountBifurcationEnabled && !automaticBifurMode;
  }, [isRecoveryAmountBifurcationEnabled, automaticBifurMode]);

  return (
    <>
      <ClosedLoanErrorModal
        visible={StringCompare(
          details?.loan_details[0]?.final_status,
          LoanStatusType.closed
        )}
        navigation={navigation}
      />
      <CustomAppBar
        title={selectedLoanData.applicant_name}
        subtitle={`Loan Id : ${selectedLoanData.loan_id}`}
        headerImage={details?.applicant_photo_link || 'default'}
        filter={false}
        sort={false}
        search={false}
        backButton={true}
        add={false}
        calendar={false}
        notifications={false}
        options={false}
        talkingPoints={details?.loan_details[0]?.talking_point}
      />

      {detailsLoading && (
        <View style={styles.loaderStyle}>
          <CustomActivityIndicator />
        </View>
      )}
      {locationLoader && (
        <ProgressDialog
          title="Fetching your location"
          visible={locationLoader}
        />
      )}
      {!detailsLoading && (
        <>
          <CustomModal
            visible={showConfirmModal}
            dismissable={false}
            HeaderComponent={CustomHeaderComponent}
            data={CustomModaldata}
          />
          <CustomModal
            visible={showErrorModal}
            dismissable={false}
            HeaderComponent={CustomErrorHeaderModal}
            data={CustomModalErrorData}
          />
          <ResultModal
            visible={visible}
            message={message}
            buttonText={button ? 'DONE' : 'CLOSE'}
            positive={button}
            extra={checkVisitType(modalExtraProps)}
            onDone={() => {
              setVisible(false);
              setNewVisitCreated(true);
              if (navigation.canGoBack()) navigation.goBack();
            }}
            generateReceipt={() => {
              generateOfflineReceiptWrapper();
            }}
            showReceiptButton={
              !isInternetAvailable &&
              parseFloat(getValidAmountString(amount)) > 0
            }
          />
          <ProgressDialog title="Submitting..." visible={loading} />
          <View style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView
              contentContainerStyle={[styles.contentStyle, extraStyles]}
            >
              <View style={{ flex: 1 }}>
                <DetailsHeader
                  loanData={selectedLoanData}
                  tabDetails={details}
                  notShowUnplanned={true}
                  visitHistory={visitHistory}
                  callingHistory={callingHistory}
                  digitalNoticeHistory={digitalNotice}
                  speedPostHistory={speedPost}
                  showLoanDetailsByDefault={false}
                  allocation_month={ALLOCATION_MONTH}
                  addressData={addressData}
                />

                <View
                  style={{
                    paddingHorizontal: RFPercentage(1)
                  }}
                >
                  <View style={styles.checkboxContainer}>
                    <CustomRadioButton
                      checked={visit}
                      buttons={[true, false]}
                      optionColors={radioButtonColors}
                      setChecked={isVisit}
                      label="Visit Done"
                    />
                    <CustomRadioButton
                      checked={customer && visit}
                      buttons={[true, false]}
                      optionColors={radioButtonColors}
                      setChecked={isCustomer}
                      label="Customer Met"
                    />
                    <CustomRadioButton
                      checked={recovery}
                      buttons={[true, false]}
                      optionColors={radioButtonColors}
                      setChecked={isRecovery}
                      label="Amount Collected"
                    />
                  </View>

                  <View>
                    <HorizontalLineContainer />
                    {!recovery ? (
                      <>
                        <Typography
                          variant={TypographyVariants.title1}
                          style={{
                            paddingLeft: RFPercentage(3),
                            marginBottom: RFPercentage(1)
                          }}
                        >
                          Status
                        </Typography>
                        <DispositionDropdown
                          setSelectedDisposition={setSelectedDisposition}
                          setSelectedDispositionOne={setSelectedDispositionOne}
                          setSelectedDispositionTwo={setSelectedDispositionTwo}
                          selectedDispositionOne={selectedDispositionOne}
                          selectedDispositionTwo={selectedDispositionTwo}
                          disposition={dispositon}
                          subDispositionOne={subDispositionOne}
                          subDispositionTwo={subDispositionTwo}
                          dispositionDropdown={dispositionDropdown}
                          subDispositionOneDropdown={subDispositionOneDropdown}
                          subDispositionTwoDropdown={subDispositionTwoDropdown}
                          setReminderDate={setReminderDate}
                          setReminderTime={setReminderTime}
                          reminderRequired={reminderRequired}
                          amountRequired={amountRequired}
                          amount={committedAmount}
                          setAmountRequired={setAmountRequired}
                          setReminderRequired={setReminderRequired}
                          setSubDispositionOneDropdown={
                            setSubDispositionOneDropdown
                          }
                          setSubDispositionTwoDropdown={
                            setSubDispositionTwoDropdown
                          }
                          setDispositonDropdown={setDispositonDropdown}
                          setDisposition={setDisposition}
                          setSubDispostionOne={setSubDispostionOne}
                          setSubDispostionTwo={setSubDispostionTwo}
                          setAmount={setCommittedAmount}
                          checkedStep={checkedStep}
                          setCheckedStep={setCheckedStep}
                          setSubDispositionOneReq={setSubDispositionOneReq}
                          setSubDispositionTwoReq={setSubDispositionTwoReq}
                          remarkRequired={remarkRequired}
                          setRemarkRequired={setRemarkRequired}
                        />
                      </>
                    ) : (
                      <>
                        <Typography
                          variant={TypographyVariants.title1}
                          style={{
                            paddingLeft: RFPercentage(3)
                          }}
                        >
                          Select Status
                        </Typography>
                        <CustomRadioButton
                          checked={finalStatus}
                          buttons={LOAN_STATUS_TEXT}
                          setChecked={setFinalStatus}
                          containerStyle={styles.dropdownStyle}
                          buttonStyle={{ padding: 7 }}
                        />
                      </>
                    )}
                    <HorizontalLineContainer />
                  </View>

                  {recovery && (
                    <>
                      <CollectionAmountHeading
                        showBifurcation={showBifurcation}
                        isBifurcatedCollection={isBifurcatedCollection}
                        setIsBifurcatedCollection={
                          setIsBifurcatedCollectionWrapper
                        }
                      />
                      <CollectionAmountInput
                        disabled={disableCollectionInput}
                        loading={loading}
                        amount={amount}
                        setAmount={setAmount}
                      />
                      {showBifurcation && (
                        <AmountBifurcation
                          recoveryVariables={recVars}
                          setAmount={setAmount}
                          recVarsFormData={recVarsFormData}
                          setRecVarsFormData={setRecVarsFormData}
                          isAutomaticEnabled={automaticBifurMode}
                          setIsAutomaticEnabled={setAutomaticBifurMode}
                          amount={amount}
                        />
                      )}
                      <HorizontalLineContainer />
                    </>
                  )}
                  {recovery && (
                    <>
                      <CustomRadioButton
                        checked={paymentMode}
                        buttons={filteredCollectionModes}
                        setChecked={onSetPaymentMode}
                      />
                      {Object.keys(chequePaymentFormData).length > 0 ? (
                        <View style={styles.captionWrapper}>
                          <GreenTickIcon />
                          <Typography
                            variant={TypographyVariants.caption}
                            style={styles.captionText}
                          >
                            Added cheque details successfully.
                          </Typography>
                          <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() =>
                              onSetPaymentMode(DepositTypes.cheque)
                            }
                          >
                            <Typography
                              variant={TypographyVariants.caption}
                              style={styles.captionViewText}
                            >
                              View
                            </Typography>
                          </TouchableOpacity>
                        </View>
                      ) : null}
                    </>
                  )}

                  {(visit || recovery) && (
                    <ProofSelectorContainer proofs={proofs} />
                  )}
                  <InputWithLabel
                    containerStyle={{
                      marginTop: RFPercentage(2)
                    }}
                    label={`Add Comment${remarkRequired ? '*' : ''}`}
                    value={comment}
                    setText={setComment}
                    multiline={true}
                    numberOfLines={3}
                  />
                </View>
                <View style={styles.buttonWrapper}>
                  <CustomButton
                    title="Submit"
                    onPress={openConfirmModal}
                    disabled={error}
                  />
                </View>
              </View>
            </ScrollView>
            <PaymentLinkBottomSheet
              emailIds={emailsArray}
              mobileNumbers={mobilesArray}
              allocationMonth={ALLOCATION_MONTH}
              loanData={selectedLoanData}
              ref={paymentLinkBottomSheetRef}
              setMobileArray={setMobilesArray}
              setEmailArray={setEmailsArray}
              loanDetails={details}
              collectionAmount={amount ?? ''}
              visit_id={VISIT_ID}
              onlinePaymentLink={onlinePaymentLink}
              isPaymentTemplatePresent={isPaymentTemplatePresent}
              bankTransferFormData={bankTransferFormData}
              setBankTransferFormData={setBankTransferFormData}
              paymentType={paymentType}
              setPaymentType={setPaymentType}
              utrNumber={utrNumber}
              setUtrNumber={setUtrNumber}
              paymentDate={paymentDate}
              setPaymentDate={setPaymentDate}
            />
            <ChequeMethodBottomSheet
              ref={chequeMethodBottomSheetRef}
              chequePaymentFormData={chequePaymentFormData}
              setChequePaymentFormData={setChequePaymentFormData}
              isEditClicked={isEditClicked}
              setIsEditClicked={setIsEditClicked}
            />
          </View>
        </>
      )}
      <TaskBottomSheet
        otpInput={otpInput}
        ref={bottomSheetRef}
        data={bottomSheetData}
        resendOtp={generate_visit_otp}
        taskSubmit={onTaskSubmit}
        resendTime={resendOtpTime}
        setResendTime={setResendOtpTime}
        type={OtpVerifyTypes.visit}
        otp={verificationOTP}
        setOtp={setVerificationOTP}
      />
    </>
  );
}

const styles = StyleSheet.create({
  buttonOneContainer: {
    backgroundColor: '#fff',
    borderColor: BLUE_DARK,
    borderWidth: 0.5,
    justifyContent: 'center',
    marginRight: RFPercentage(0.5),
    minHeight: RFPercentage(4.2),
    minWidth: RFPercentage(13.5),
    borderRadius: 4
  },
  buttonOneText: {
    color: BLUE_DARK,
    fontFamily: TypographyFontFamily.normal,
    fontSize: RFPercentage(2),
    textAlign: 'center'
  },
  buttonTitle: {
    fontFamily: 'poppins',
    fontSize: 24
  },
  buttonTwoContainer: {
    backgroundColor: BLUE_DARK,
    marginLeft: RFPercentage(0.5),
    minHeight: RFPercentage(4.2),
    minWidth: RFPercentage(13.5),
    borderRadius: 4
  },
  buttonTwoText: {
    color: '#fff',
    fontFamily: TypographyFontFamily.normal,
    fontSize: RFPercentage(2)
  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: RFPercentage(2)
  },
  captionText: {
    color: Colors.light.text,
    fontSize: 13,
    marginLeft: 5
  },
  captionViewText: {
    color: BLUE_3,
    fontSize: 13,
    marginLeft: 5,
    textDecorationLine: 'underline'
  },
  captionWrapper: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    marginHorizontal: RFPercentage(2)
  },
  commentBox: {
    backgroundColor: Colors.table.grey,
    borderColor: Colors.common.blue,
    borderRadius: 8,
    borderWidth: 1,
    fontFamily: TypographyFontFamily.medium,
    margin: 0,
    marginVertical: RFPercentage(1.5),
    minWidth: RFPercentage(20),
    paddingHorizontal: RFPercentage(4)
  },
  container: {
    // flex: 1,
    paddingVertical: RFPercentage(2),
    paddingHorizontal: RFPercentage(0.5)
    // backgroundColor: '#f6f8fb'
  },
  contentStyle: {
    backgroundColor: 'white',
    flexGrow: 1
  },
  datePickerContainer: {
    marginVertical: 0,
    minHeight: 45,
    paddingHorizontal: RFPercentage(3),
    padding: 0
  },
  doneButton: {
    alignSelf: 'center',
    backgroundColor: BLUE_DARK,
    borderRadius: 4,
    marginVertical: RFPercentage(2),
    width: RFPercentage(20)
  },
  dropDownContainer: {
    borderColor: '#043E90',
    marginHorizontal: 0
  },
  dropdownStyle: {
    flexDirection: 'column',
    padding: 5
  },
  error: {
    color: 'red',
    marginTop: RFPercentage(0.2)
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
  },
  formLabel: {
    fontFamily: TypographyFontFamily.heavy,
    fontSize: RFPercentage(2)
  },
  formLabelContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-start'
  },
  formRowContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginHorizontal: RFPercentage(3)
  },
  geoFenceError: {
    color: 'red',
    fontSize: RFPercentage(1.7),
    marginBottom: RFPercentage(0.6),
    textAlign: 'center'
  },
  headerText: {
    fontFamily: TypographyFontFamily.medium,
    fontSize: RFPercentage(2.1),
    lineHeight: RFPercentage(3.5),
    textAlign: 'center'
  },
  inputBox: {
    flexDirection: 'row',
    flex: 1
  },
  inputContainer: {
    backgroundColor: Colors.table.grey,
    borderColor: Colors.common.blue,
    borderRadius: 8,
    borderWidth: 1,
    fontFamily: TypographyFontFamily.medium,
    height: 40,
    margin: 0,
    marginVertical: RFPercentage(1.5),
    minWidth: RFPercentage(19),
    paddingHorizontal: RFPercentage(1)
  },
  loader: {
    backgroundColor: '#F6F8FB',
    flex: 1,
    justifyContent: 'center'
  },
  loaderStyle: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center'
  }
});
