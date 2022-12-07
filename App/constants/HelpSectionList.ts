export const HelpSectionList = [
    {
        heading: 'Login',
        questions: [
            {
                ques: 'How do I Log in to the application?',
                ans: "Click on the dropdown 'Email ID' option to select Email ID, Phone No., Emp ID etc. as a login option. Enter Company name in case 'Emp ID' is selected as an option. Finally, enter the password to log in.",
                url: 'https://prod-cg-fos-assets.s3.ap-south-1.amazonaws.com/faq-videos/Login.mp4'
            },
            {
                ques: 'Facing issue while Login?',
                ans: "If 'Please contact your admin' is displayed while logging in, contact your supervisor for approval.",
                url: ''
            },
            {
                ques: 'How do I reset my password?',
                ans: "Click on 'Forget Password' to change your password. Enter email ID to receive OTP.",
                url: 'https://prod-cg-fos-assets.s3.ap-south-1.amazonaws.com/faq-videos/Reset_Password.mp4'
            }
        ]
    },
    {
        heading: 'Allocation',
        questions: [
            {
                ques: 'How do i see the loans assigned in different months?',
                ans: 'See loans allocated in different months by clicking on the Month filter at the top right of the Portfolio section page.',
                url: 'https://prod-cg-fos-assets.s3.ap-south-1.amazonaws.com/faq-videos/Assigned_Loans.mp4'
            }
        ]
    },
    {
        heading: 'Performance',
        questions: [
            {
                ques: 'How do I log my daily activity?',
                ans: 'Mark your attendance by utilizing Clock-in and Clock-out features on Home Page. After logging in, make sure to hit the "Clock-in" button on the top navigation bar when you are starting your day\'s work, and move the button to "clock-out" once you end your day. This keeps the daily activity logged.',
                url: 'https://prod-cg-fos-assets.s3.ap-south-1.amazonaws.com/faq-videos/Clock-in_Clock-out.mp4'
            },
            {
                ques: 'How to visualize my collection performance?',
                ans: 'Application user can view their collection performance by accessing \'My Dashboard\' section on Home Page by clicking on "See More" option.',
                url: 'https://prod-cg-fos-assets.s3.ap-south-1.amazonaws.com/faq-videos/App_Dashboard.mp4'
            }
        ]
    },
    {
        heading: 'Visit',
        questions: [
            {
                ques: 'How to create visits for multiple loan accounts in Bulk?',
                ans:
                    "Select Multiple Applicant's ID on Portfolio Page for which visits to be scheduled. Click the " +
                    ' icon on the bottom right to schedule bulk surprise visits.',
                url: 'https://prod-cg-fos-assets.s3.ap-south-1.amazonaws.com/faq-videos/Creating_new_visits.mp4'
            },
            {
                ques: 'What\'s the difference between "Address" and "Markedlocation" for a visit?',
                ans: "Address / Lat-Long at top of the visit submission form refers to the applicant's location. Marked location is of an agent which is captured during submission of field visit.",
                url: ''
            },
            {
                ques: 'How to create a new visit for any loan account?',
                ans:
                    'There are multiple ways to create a visit for an applicant: \n1. By utilizing Bulk visit option \n2. By Clicking on Applicant on Portfolio Page, then click the ' +
                    ' icon on the bottom right of the Customer details page. \n3. Clicking on the "Quick Visit" option on the customer details page.',
                url: 'https://prod-cg-fos-assets.s3.ap-south-1.amazonaws.com/faq-videos/Creating_new_visits.mp4'
            },
            {
                ques: "What's the difference between a PTP visit and a field visit?",
                ans: 'PTP (Promise to Pay) visit is scheduled when the borrower promises to pay at a future date or time. FOS application user has to schedule a PTP for that applicant to call back or visit at provided date or time. A field Visit is a Surprise visit on a specific date/time when an applicant user visits an applicant first time.',
                url: ''
            }
        ]
    },
    {
        heading: 'Collection',
        questions: [
            {
                ques: 'What is a Collection Receipt and how to share receipts with the applicants?',
                ans: "Collection receipt provides details to borrower regarding their payment to field agents. Field Agents can share receipts to borrowers by visiting 'History' section on left side menu.",
                url: 'https://prod-cg-fos-assets.s3.ap-south-1.amazonaws.com/faq-videos/Sharing_Collection_Receipt.mp4'
            }
        ]
    },
    {
        heading: 'History',
        questions: [
            {
                ques: 'How do I see the history of deposits and closed visits?',
                ans: "Application user can view history of visits done and deposits made by accessing 'History' section on left side menu.",
                url: 'https://prod-cg-fos-assets.s3.ap-south-1.amazonaws.com/faq-videos/View_History.mp4'
            }
        ]
    },
    {
        heading: 'Deposit',
        questions: [
            {
                ques: "How to i deposit collected amount in company's account?",
                ans: "Collected amount via 'cash' or ' cheque' method can be deposited in a bank branch/company branch as per details provided by the company. To perform a deposit user needs to go to the \"Collection\" section and select applicable collections to perform the deposit.",
                url: 'https://prod-cg-fos-assets.s3.ap-south-1.amazonaws.com/faq-videos/Collection_Deposit_Process.mp4'
            }
        ]
    }
];
