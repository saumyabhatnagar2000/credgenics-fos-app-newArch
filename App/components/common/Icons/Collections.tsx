import React from 'react';
import { SvgXml } from 'react-native-svg';

export const CollectionsIcon = ({ color }: { color: string }) => {
    return (
        <SvgXml
            xml={`
            <svg width="36" height="22" viewBox="0 0 36 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.11099 12.9167C8.1909 11.625 8.59046 10.4167 9.22974 9.375H1.63818C0.239734 9.375 0 10.0833 0 10.5833V11.75C0 12.9583 1.11876 12.9583 1.63818 12.9583H8.11099V12.9167ZM3.2364 14.1667C1.83796 14.1667 1.59822 14.875 1.59822 15.375V16.2917C1.59822 17.0833 2.11765 17.5 3.2364 17.5H9.14983C8.59046 16.5 8.1909 15.375 8.11099 14.1667H3.2364ZM31.0455 7.08333C29.8868 5.20833 26.8901 0 23.2542 0H15.5028C15.5028 0 14.1043 2.38419e-07 14.1043 1.5V2.41667C14.1043 2.41667 14.1043 3.625 15.5028 3.625H20.5771C21.0966 3.625 21.0966 4.83333 20.4573 4.83333H3.2364C1.83796 4.79167 1.59822 5.70833 1.59822 6V6.875C1.55827 8.16667 2.91676 8.08333 3.2364 8.08333H10.1887C11.5072 6.66667 13.3851 5.75 15.5028 5.75C19.5782 5.75 22.8946 9.16667 22.8946 13.4583C22.8946 17.7083 19.5782 21.1667 15.5028 21.1667C13.3052 21.1667 11.4273 20.2083 10.0688 18.6667H6.3929C4.99445 18.6667 4.99445 19.875 4.99445 19.875V20.7917C4.99445 22 6.3929 22 6.3929 22H23.8535C27.5694 22 29.9268 20.4583 31.0855 18.6667H34.8413C35.5605 16.5 36 14.1667 36 11.7083C36 10.0833 35.8002 8.54167 35.4806 7.04167H31.0455V7.08333ZM15.4628 15.7917C14.9834 15.7917 14.2242 15.625 14.2242 15.0417C14.2242 14.5833 13.9046 14.25 13.465 14.25C13.0655 14.25 12.7458 14.5833 12.7458 15C12.7059 16.1667 13.7048 17 14.7037 17.25V18.0833C14.7037 18.5417 15.0233 18.875 15.4628 18.875C15.8624 18.875 16.182 18.5417 16.182 18.125V17.25C17.3407 17 18.1798 16.125 18.1798 15.0417C18.1798 14.5 17.9401 13.9583 17.5805 13.5417C17.061 13 16.3019 12.7083 15.5028 12.7083C15.0233 12.7083 14.2642 12.5 14.2642 11.9167C14.2642 11.5417 14.7836 11.1667 15.5028 11.1667C15.9423 11.1667 16.7414 11.375 16.7414 11.9167C16.7414 12.3333 17.061 12.7083 17.4606 12.7083C17.9001 12.7083 18.2198 12.375 18.2198 11.9167C18.2198 10.7083 17.2209 10 16.2619 9.70833V8.83333C16.2619 8.41667 15.9423 8.04167 15.5028 8.04167C15.1032 8.04167 14.7436 8.375 14.7436 8.79167V9.66667C13.5849 9.91667 12.7458 10.8333 12.7458 11.8333C12.7458 12.4167 12.9456 12.9167 13.3851 13.3333C13.8646 13.875 14.6637 14.1667 15.4628 14.1667C15.9023 14.1667 16.6615 14.4167 16.6615 14.9583C16.7014 15.375 16.182 15.7917 15.4628 15.7917Z" fill="${color}"/>
            </svg>
            `}
            height={27}
            width={27}
        />
    );
};