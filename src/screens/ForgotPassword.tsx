import { forgotPassword, resendOTP, verifyOTPResetPassword } from '@/apis/auth';
import Input from '@/common/inputs/Input';
import { EMAIL_REQUIRED, INVALID_EMAIL } from '@/constants/message.constant';
import { useCountDownTime } from '@/hooks/useCountdownTime';
import colors from '@/themes/colors';
import { typography } from '@/themes/typography';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Link,
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { KeyboardAvoidingScrollView } from 'react-native-keyboard-avoiding-scroll-view';
import { useToast } from 'react-native-toast-notifications';
import * as yup from 'yup';
import notifee from '@notifee/react-native';
import Button from '@/common/buttons/Button';

const fromSchema = yup.object().shape({
  email: yup.string().required(EMAIL_REQUIRED).email(INVALID_EMAIL),
});

const ForgotPassword = (): JSX.Element => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(fromSchema),
    mode: 'onChange',
    defaultValues: { email: '' },
  });

  const toast = useToast();
  const navigation: NavigationProp<ParamListBase> = useNavigation();
  const [otp, setOtp] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [loadingBtn, setLoadingBtn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const { time, resetCountdown, startCountdown } = useCountDownTime(300);
  const {
    time: time2,
    isRunning: isRunning2,
    resetCountdown: resetCountdown2,
    startCountdown: startCountdown2,
  } = useCountDownTime(30);

  useEffect(() => {
    otp.length >= 6 && handleVerifyOTP();
  }, [otp]);

  const handleVerifyOTP = (): void => {
    setLoading(true);

    const payload = {
      email: email,
      otp: otp,
    };
    verifyOTPResetPassword(payload)
      .then(res => {
        navigation.navigate('reset-password', {
          userInfo: {
            email: res.data.email,
          },
        });
      })
      .catch(err => {
        console.log(err);
        toast.show(err.message, { type: 'danger', placement: 'top' });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleResendOTP = (): void => {
    resetCountdown();
    resetCountdown2();
    const payload = {
      email: email,
    };

    resendOTP(payload)
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const onSubmit = (email: { email: string }): void => {
    setLoadingBtn(true);
    forgotPassword(email)
      .then(() => {
        setIsConfirmed(true);
        startCountdown2();
        startCountdown();
        setEmail(email.email);
      })
      .finally(() => {
        setLoadingBtn(false);
      })
      .catch(err => {
        toast.show(err.message, {
          type: 'danger',
          placement: 'top',
        });
        console.log(err);
      });
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>
            {!isConfirmed ? 'Forgot Your Password' : 'Enter OTP'}
          </Text>
          {!isConfirmed ? (
            <Text style={styles.text}>
              Enter the email address associated with your account and we’ll
              send you a link to reset your password
            </Text>
          ) : (
            <>
              <Text style={styles.text}>
                A verification code has been sent to
              </Text>
              <Text style={[styles.text, styles.txtEmail]}>{email}</Text>
            </>
          )}
        </View>

        {!isConfirmed ? (
          <View style={styles.body}>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder={'e.g. work@site.com'}
                  label={'Email'}
                  value={value}
                  onChangeText={onChange}
                  error={errors.email?.message}
                />
              )}
            />
          </View>
        ) : (
          <>
            <Text style={[styles.text, styles.otpExpire]}>
              OTP Expire: {time}
            </Text>

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
          </>
        )}
      </KeyboardAvoidingScrollView>

      {!isConfirmed && (
        <View style={styles.footer}>
          <View style={styles.button}>
            <Button
              label={'Reset Password'}
              disabled={loadingBtn || !isValid}
              loading={loadingBtn}
              onPress={handleSubmit(onSubmit)}
            />
          </View>

          <View style={styles.boxSignUp}>
            <Text style={styles.txtNoAccount}>Recovered your account?</Text>
            <Link to="/login">
              <Text style={styles.txtSignUp}>Log in</Text>
            </Link>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  header: {
    marginTop: 84,
    alignItems: 'center',
    paddingHorizontal: 32,
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
    fontWeight: '500',
    textAlign: 'center',
  },
  txtEmail: {
    fontWeight: '700',
  },

  body: {
    marginTop: 40,
    marginHorizontal: 32,
  },

  footer: {
    backgroundColor: 'white',
    rowGap: 16,
    width: '100%',
    paddingHorizontal: 32,
  },
  button: {},
  boxSignUp: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: 12,
    marginBottom: 10,
  },
  txtNoAccount: {
    color: '#1F2937',
    ...typography.body,
  },
  txtSignUp: {
    color: '#2563EB',
    ...typography.body,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },

  // OTP
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
    alignItems: 'center',
    justifyContent: 'center',
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

export default ForgotPassword;
