import { CompanyType } from '../../../enums';
import { ReceiptGenerationDataType } from '../../../types';
import { keyConverter } from '../../services/utils';

export const getTemplate = (data: ReceiptGenerationDataType) => {
    return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
        <link rel="stylesheet" href="style.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@500&display=swap" rel="stylesheet" />
      </head>
      <body>
        <div class="container" style="border: 1px solid black;">
          <table width="100%" style="border-bottom: 1px solid black; padding: 
    1.5rem; padding-top: 0.5rem;">
            <tr>
              <td colspan="5" width="50%">
                <p style="font-size:28px; color:#263D35">Collection <br /> Receipt </p>
              </td>
              <td>
                <p style="font-size:17px; color: #000; text-transform: 
    uppercase;">${data?.company_name ?? ''}</p>
                <p style="font-size:13px; color: #646464; 
    font-weight:normal">${data?.company_address ? data.company_address : ''}${
        ', ' + (data?.company_city ? data.company_city : '')
    } ${', ' + (data?.company_state ? data.company_state : '')} ${
        '' + data?.company_pincode ? data.company_pincode : ''
    }</p>
              </td>
            </tr>
            <tr>
              <td colspan="5">
                <p style="margin-bottom: 3px; font-size:12px;">Receipt To</p>
                <p style="font-size: 19px; text-transform: 
    uppercase">${data.applicant_name}</p>
                <p style="font-size:13px; color: #646464; 
    font-weight:normal">${data.address}</p>
              </td>
              <td>
                <p class="small_p">Receipt Date: &nbsp;&nbsp;&nbsp;&nbsp;${
                    data.visit_date
                }</p>
              </td>
            </tr>
          </table>
          <table width="100%" style="border-bottom: 1px solid black; 
    padding:1.5rem;">
            <tr>
              <td colspan="5" width="50%">
                <p class="small_p"> ${
                    data.company_type == CompanyType.credit_line
                        ? 'Customer Id'
                        : 'Loan Id'
                } </p>
                <p class="small_p">Payment Mode</p>
                <p class="small_p">Agent Name</p>
              </td>
              <td width="50%">
                <p class="small_p">${data.loan_id}</p>
                <p class="small_p">${data.payment_method}</p>
                <p class="small_p" style="text-transform: 
    capitalize;">${data.agent_name}</p>
              </td>
            </tr>
          </table>
            ${
                Object.keys(data.amount_bifurcation).length > 0
                    ? `<table width="100%" style="border-bottom: 1px solid black; 
            padding:1.5rem;">
                <tr>
                  <td>
                    <p style="font-size: 18px; font-weight: bold;">Recovery Details</p>
                  </td>
                </tr>
                    <tr>
                <td colspan="5" width="50%"> ${Object.keys(
                    data.amount_bifurcation
                )
                    .map((_item) => {
                        return (
                            ` <p class="small_p">${keyConverter(_item)}</p>` ||
                            null
                        );
                    })
                    .join('')} </td>
                <td> ${Object.values(data.amount_bifurcation)
                    .map((_item) => {
                        return (
                            ` <p class="small_p">${data.currency_code}${_item} </p>` ||
                            null
                        );
                    })
                    .join('')} </td>
              </tr>
              </table>`
                    : ''
            }
          <table width="100%" style="margin-top: 2px; border-top: 1px solid 
    black; padding:1.5rem;">
            <tr>
              <td colspan="5" width="50%">
                <p style="font-size: 18px; font-weight: bold;">Total Amount</p>
              </td>
              <td>
                <p style="font-size: 18px; font-weight: 
    bold;">${data.currency_code} ${data.amount_recovered}</p>
              </td>
            </tr>
            <tr>
              <td colspan="5" width="50%">
                <p style="font-size: 18px; font-weight: bold;">Total Amount (in Words)</p>
              </td>
              <td>
                <p style="font-size: 18px; font-weight: 
    bold;">${data.currency_code}${data.amount_recovered_in_words} Only</p>
              </td>
            </tr>
          </table>
          <table width="100%" style=" border: 0px; ">
            <tr>
              <td style="text-align: center; vertical-align: middle;">
                <span style="font-size: 12px">Powered by:</span>
                <svg width="12" height="12" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-bottom: -2px; margin-right: 3px; margin-top: 
    12px;">
                  <path d="M8.99623 4.34831C8.9849 4.34454 8.98868 4.33699 8.98868 
    4.32944C8.9849 4.26904 8.98113 4.20865 8.98113 4.14826C8.98113 4.11429 
    8.9698 4.10296 8.93583 4.10296C7.49772 4.10296 6.06338 4.10296 4.62527 
    4.10296C4.58752 4.10296 4.58375 4.11806 4.58375 4.14826C4.58375 4.37851 
    4.58375 4.60498 4.58375 4.83523C4.58375 4.85788 4.58375 4.88052 4.56865 
    4.90317C4.5913 4.90317 4.61017 4.90317 4.62904 4.90317C5.78406 4.90317 
    6.94286 4.90317 8.09788 4.90317C8.1092 4.90317 8.12052 4.90317 8.12807 
    4.90317C8.16959 4.89562 8.17714 4.9145 8.16959 4.95224C8.16204 5.00131 
    8.15827 5.04661 8.15072 5.09568C8.01861 5.87701 7.67512 6.54889 7.12026 
    7.1113C6.71261 7.52273 6.23701 7.81714 5.6897 8.00587C5.06689 8.21725 
    4.42899 8.25877 3.78354 8.13421C3.57216 8.09269 3.36456 8.02852 3.16073 
    7.95303C3.05504 7.90396 2.94558 7.86244 2.84367 7.80959C2.41714 7.59067 
    2.03968 7.30758 1.72639 6.94522C1.07339 6.2054 0.760101 5.34102 0.794072 
    4.35586C0.805396 3.98595 0.877113 3.62737 0.997899 3.28011C1.08849 3.01966 
    1.20928 2.77054 1.35648 2.53651C1.48482 2.33269 1.63203 2.14018 1.80188 
    1.96655C1.92267 1.84199 2.04723 1.72498 2.17934 1.61929C2.36052 1.47586 
    2.55302 1.34752 2.76063 1.23806C2.96445 1.1286 3.1796 1.04178 3.4023 
    0.970066C3.57971 0.917222 3.76089 0.875701 3.94207 0.849279C4.26668 
    0.80021 4.5913 0.796435 4.91591 0.830406C5.2594 0.868152 5.59156 0.958742 
    5.9124 1.09085C6.20304 1.21164 6.47103 1.37017 6.72393 1.5589C6.7579 
    1.58532 6.7579 1.60042 6.72771 1.62684C6.68996 1.66081 6.65221 1.69478 
    6.61824 1.73253C6.59937 1.75518 6.58427 1.7514 6.56162 1.7363C6.23324 
    1.49096 5.87465 1.30978 5.4821 1.19277C5.10464 1.07953 4.71586 1.03423 
    4.3233 1.05311C4.00246 1.0682 3.68917 1.1286 3.38721 1.23051C3.37588 
    1.23429 3.36833 1.23429 3.35701 1.23806C2.60587 1.50606 2.00949 1.97033 
    1.57918 2.6422C1.13001 3.3405 0.963928 4.10674 1.05452 4.92959C1.09604 
    5.31838 1.21305 5.68828 1.38668 6.03932C1.50747 6.28467 1.65845 6.51492 
    1.83586 6.72629C2.1265 7.06978 2.46621 7.3491 2.85877 7.56047C3.00597 
    7.63974 3.15318 7.71146 3.31171 7.76053C3.31926 7.7643 3.32681 7.76807 
    3.33814 7.77185C3.71937 7.90773 4.1157 7.9719 4.51958 7.9719C4.94611 
    7.96813 5.35753 7.88886 5.75764 7.7341C6.20304 7.56047 6.5956 7.3038 
    6.93153 6.96786C7.39958 6.49982 7.7091 5.94495 7.86385 5.30328C7.87518 
    5.26176 7.86008 5.25798 7.82233 5.25798C7.1882 5.25798 6.55407 5.25798 
    5.91617 5.25798C5.87843 5.25798 5.85955 5.26931 5.84445 5.2995C5.4821 
    5.92231 4.74983 6.21672 4.05531 6.02045C3.76466 5.93741 3.52309 5.77887 
    3.31926 5.55617C3.22867 5.43916 3.13431 5.32215 3.07392 5.18626C3.03995 
    5.107 3.0022 5.02396 2.97955 4.94092C2.91161 4.70312 2.90406 4.46155 
    2.94558 4.21997C2.97578 4.03879 3.04749 3.87271 3.14186 3.71418C3.19093 
    3.63492 3.23622 3.55565 3.30039 3.48771C3.36078 3.42354 3.42495 3.36692 
    3.48534 3.30653C3.73824 3.1027 4.02511 2.97814 4.3535 2.95172C4.83287 
    2.91397 5.2443 3.06495 5.59156 3.39712C5.67837 3.48016 5.75009 3.57075 
    5.81803 3.67266C6.00676 3.48393 6.19172 3.2952 6.37667 3.11025C6.39932 
    3.0876 6.38044 3.07628 6.36912 3.06118C6.01054 2.60823 5.55004 2.31381 
    4.98385 2.19303C4.68943 2.12886 4.39124 2.12131 4.09305 2.17415C3.88545 
    2.2119 3.6854 2.26852 3.49667 2.36288C3.48534 2.36666 3.47402 2.37043 
    3.4627 2.37421C3.19848 2.50254 2.96068 2.6724 2.76063 2.89132C2.22841 
    3.47638 2.02836 4.16336 2.16047 4.94092C2.24351 5.43539 2.48131 5.85436 
    2.83612 6.2054C2.96445 6.33374 3.10411 6.44697 3.26642 6.53379C3.28907 
    6.54889 3.31171 6.56399 3.33436 6.57531C4.00246 6.93012 4.69321 6.97541 
    5.39905 6.69609C5.73499 6.56398 6.02186 6.35638 6.25966 6.08461C6.27098 
    6.06952 6.28231 6.05064 6.30495 6.05064C6.41819 6.05064 6.53143 6.05064 
    6.64844 6.05064C6.64466 6.06952 6.63334 6.08084 6.62579 6.09216C6.50123 
    6.26202 6.3578 6.41678 6.19549 6.54889C5.55381 7.066 4.82532 7.25851 
    4.01379 7.12262C3.78731 7.08488 3.57216 7.00939 3.36078 6.91502C3.27019 
    6.86218 3.17206 6.81688 3.08147 6.76026C2.7946 6.57908 2.55302 6.35261 
    2.35297 6.08084C2.33787 6.05819 2.319 6.04309 2.27748 6.04687C2.319 
    6.02045 2.29635 6.00157 2.28503 5.9827C2.01703 5.58637 1.86983 5.14852 
    1.83586 4.6767C1.82453 4.52949 1.82453 4.37473 1.8434 4.22752C1.8585 
    4.10296 1.87738 3.97463 1.91512 3.85007C1.97929 3.63114 2.05101 3.41599 
    2.16802 3.21971C2.21709 3.13667 2.25861 3.05363 2.31523 2.97814C2.45489 
    2.78941 2.61342 2.61201 2.79837 2.46102C2.92293 2.35911 3.05504 2.26474 
    3.19848 2.18548C3.25887 2.15151 3.32304 2.12131 3.38721 2.08734C3.54574 
    2.0194 3.70804 1.959 3.8779 1.92126C4.45919 1.78537 5.0216 1.83067 5.56891 
    2.06847C5.96902 2.2421 6.30495 2.50254 6.5805 2.84603C6.5956 2.8649 
    6.60314 2.88755 6.63334 2.85735C7.05232 2.43838 7.4713 2.02317 7.89405 
    1.60419C7.9167 1.58155 7.91292 1.57022 7.89405 1.55135C7.81478 1.46076 
    7.73174 1.37395 7.6487 1.2909C7.04477 0.705846 6.33515 0.31329 5.51607 
    0.120786C5.29714 0.0717169 5.07822 0.0377457 4.85552 0.0188729C4.814 
    0.0150983 4.77248 0.0226475 4.73473 0.00377466C4.70076 0.00377466 4.66679 
    0.00377466 4.63659 0.00377466C4.62527 0.018873 4.61394 0.0113238 4.59884 
    0.0113238C4.5309 0.0113238 4.46296 0.0113238 4.39124 0.0113238C4.37992 
    0.0113238 4.36482 0.0150983 4.3535 0C4.3233 0 4.2931 0 4.26291 0C4.25158 
    0.0188729 4.23649 0.00754918 4.22139 0.00754918C3.95339 0.026422 3.68917 
    0.0641678 3.42873 0.13211C3.4174 0.13211 3.40608 0.135885 3.39476 
    0.135885C2.25483 0.441625 1.36026 1.0833 0.714806 2.07224C0.299603 2.70637 
    0.0731281 3.40844 0.0127348 4.16336C-0.0136872 4.50684 0.00141105 4.85033 
    0.0542551 5.19004C0.133521 5.69961 0.295828 6.1752 0.537401 
    6.62815C0.673286 6.88105 0.835592 7.11885 1.01677 7.34155C1.49237 7.91906 
    2.07365 8.35691 2.7644 8.64755C2.88519 8.69662 3.00597 8.74569 3.13053 
    8.77966C3.13431 8.78343 3.14186 8.78721 3.14563 8.78721C3.64388 8.94197 
    4.15344 9.01368 4.67811 8.99104C5.10464 8.97216 5.52362 8.90045 5.9275 
    8.76079C6.71638 8.49279 7.38448 8.04739 7.92047 7.40949C8.55837 6.65835 
    8.90941 5.7902 8.9849 4.80881C8.98868 4.75974 8.98113 4.70689 9 4.6616C9 
    4.63895 9 4.61253 9 4.58988C8.9849 4.52571 8.9849 4.46155 9 
    4.40115C8.99623 4.3936 8.99623 4.37096 8.99623 4.34831Z" fill="url(#paint0_linear)" />
                  <defs>
                    <linearGradient id="paint0_linear" x1="-2.90708" y1="2.90551" x2="2.90264" y2="11.9035" gradientUnits="userSpaceOnUse">
                      <stop stop-color="#5B8DEF" />
                      <stop offset="0.0001" stop-color="#5B8DEF" />
                      <stop offset="1" stop-color="#0063F7" />
                    </linearGradient>
                  </defs>
                </svg>
                <span style="font-size: 12px">Credgenics</span>
              </td>
            </tr>
          </table>
        </div>
        <p style="margin-top: 2%; font-size: 14px;"> *This is a system-generated receipt, and hence no signature is required. </p>
        <p style="margin-top: 2%; font-size: 14px;"> * This receipt is generated in Offline Mode. Final receipt would be sent post realisation of funds deposited. </p>
      </body>
    </html>`;
};
