import {
    UserIcon,
    KeyIcon,
    CreditCardIcon,
    BellIcon,
  } from 'react-native-heroicons/outline';
  
  export const profileTabs = [
    {
      icon: UserIcon,
      label: 'My Profile',
      link: 'my-profile',
    },
    {
      icon: KeyIcon,
      label: 'Change Password',
      link: 'change-password',
    },
    {
      icon: CreditCardIcon,
      label: 'Payment Methods',
      link: 'payment-methods',
    },
    {
      icon: BellIcon,
      label: 'Notification Settings',
      link: 'notification-settings',
    },
  ];
  