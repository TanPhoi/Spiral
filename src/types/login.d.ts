declare module 'react-native-instagram-login' {
    import { Component } from 'react';
  
    interface InstagramLoginProps {
      appId: string;
      appSecret: string;
      redirectUrl: string;
      scopes: string[];
    }
  
    class InstagramLogin extends Component<InstagramLoginProps> {
      show(): void;
      hide(): void;
    }
  
    export default InstagramLogin;
  }
  