import {resendOTP, verifyOTP} from '@/apis/auth';
import {useCountDownTime} from '@/hooks/useCountdownTime';
import colors from '@/themes/colors';
import {typography} from '@/themes/typography';
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type RouteParams = {
  userInfo: {
    id: string;
    email: string;
  };
};

const VerificationEmail = (): JSX.Element => {
  const location = useRoute<RouteProp<{params: RouteParams}>>();
  const navigation: NavigationProp<ParamListBase> = useNavigation();
  const [otp, setOtp] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const {time, resetCountdown, startCountdown} = useCountDownTime(300);
  const {
    time: time2,
    isRunning: isRunning2,
    resetCountdown: resetCountdown2,
    startCountdown: startCountdown2,
  } = useCountDownTime(30);

  useEffect(() => {
    startCountdown();
    startCountdown2();
  }, []);

  useEffect(() => {
    otp.length >= 6 && handleVerifyOTP();
  }, [otp]);

  const handleResendOTP = (): void => {
    resetCountdown();
    resetCountdown2();
    setOtp('');
    const payload = {
      id: location.params.userInfo.id,
      email: location.params.userInfo.email,
      otp: otp,
    };

    resendOTP(payload)
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const handleVerifyOTP = (): void => {
    setLoading(true);
    const payload = {
      id: location.params.userInfo.id,
      email: location.params.userInfo.email,
      otp: otp,
    };
    verifyOTP(payload)
      .then(() => {
        setTimeout(() => navigation.navigate('login'), 2000);
      })
      .catch(err => {
        console.log(err);
        setOtp('');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Email Verification </Text>
        <Text style={styles.text}>A verification code has been sent to</Text>
        <Text style={[styles.text, styles.txtEmail]}>
          {location?.params?.userInfo?.email}
        </Text>
      </View>

      <Text style={[styles.text, styles.otpExpire]}>OTP Expire: {time}</Text>

      <OTPInputView
        pinCount={6}
        code={otp}
        style={styles.inputOtp}
        autoFocusOnLoad
        onCodeChanged={otp => setOtp(otp)}
        codeInputFieldStyle={styles.underlineStyleBase}
        codeInputHighlightStyle={styles.underlineStyleHighLighted}
      />

      {loading && (
        <View style={styles.boxLoading}>
          <ActivityIndicator color={'black'} size={20} />
          <Text style={styles.checkCode}>Check your code</Text>
        </View>
      )}

      <View style={styles.boxResend}>
        <Text style={styles.noReceive}>Didn’t receive the code?</Text>
        <TouchableOpacity onPress={handleResendOTP} disabled={isRunning2}>
          <Text style={styles.resendCode}>Resend code ({time2})</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  header: {
    marginTop: 84,
    alignItems: 'center',
  },
  title: {
    color: colors.gray[900],
    fontWeight: '700',
    ...typography.heading2,
    marginBottom: 8,
  },
  text: {
    color: colors.gray[700],
    ...typography.body,
  },
  txtEmail: {
    fontWeight: '700',
  },
  otpExpire: {
    marginTop: 40,
    fontWeight: '500',
  },
  boxOTP: {
    marginTop: 32,
  },
  boxLoading: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: 8,
  },
  checkCode: {
    color: colors.gray[800],
    ...typography.body,
  },
  boxResend: {
    marginTop: 32,
    flexDirection: 'row',
    columnGap: 12,
  },
  noReceive: {
    color: colors.gray[800],
    fontWeight: '700',
    ...typography.body,
  },
  resendCode: {
    color: colors.blue[600],
    fontWeight: '700',
    ...typography.body,
  },

  underlineStyleBase: {
    width: 50,
    height: 60,
    borderRadius: 8,
    backgroundColor: colors.gray[200],
    ...typography.heading4,
    fontWeight: '800',
    color: 'black',
  },
  underlineStyleHighLighted: {
    borderColor: colors.blue[600],
  },
  inputOtp: {
    height: 60,
    marginTop: 32,
    marginHorizontal: 32,
  },
});

export default VerificationEmail;
