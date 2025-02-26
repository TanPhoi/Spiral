import {resetPassword} from '@/apis/auth';
import Button from '@/common/buttons/Button';
import Input from '@/common/inputs/Input';
import {
  CONFIRM_PASSWORD_REQUIRED,
  PASSWORD_MISMATCH,
} from '@/constants/message.constant';
import {SignUpPayload} from '@/models/User.model';
import colors from '@/themes/colors';
import {typography} from '@/themes/typography';
import {createPasswordValidatorSchema} from '@/validators/account.validator';
import {yupResolver} from '@hookform/resolvers/yup';
import {
  Link,
  NavigationProp,
  ParamListBase,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import React, {useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {StyleSheet, Text, View} from 'react-native';
import {CheckCircleIcon} from 'react-native-heroicons/outline';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
import {useToast} from 'react-native-toast-notifications';
import * as yup from 'yup';

type RouteParams = {
  userInfo: {
    email: string;
  };
};

const fromSchema = yup.object().shape({
  password: createPasswordValidatorSchema(),
  confirmPassword: yup
    .string()
    .required(CONFIRM_PASSWORD_REQUIRED)
    .oneOf([yup.ref('password'), PASSWORD_MISMATCH]),
});

const ResetPassword = (): JSX.Element => {
  const {
    control,
    handleSubmit,
    formState: {errors, isValid},
  } = useForm({
    resolver: yupResolver(fromSchema),
    mode: 'onChange',
    defaultValues: {password: '', confirmPassword: ''},
  });

  const toast = useToast();
  const location = useRoute<RouteProp<{params: RouteParams}>>();
  const navigation: NavigationProp<ParamListBase> = useNavigation();
  const [loading, setLoading] = useState<boolean>();
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);

  const onSubmit = (data: SignUpPayload): void => {
    setLoading(true);
    const payload = {
      email: location.params.userInfo.email,
      password: data.password || '',
    };

    resetPassword(payload)
      .then(() => {
        setIsConfirmed(true);
      })
      .catch(err => {
        console.log(err);
        toast.show(err.message, {type: 'danger', placement: 'top'});
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingScrollView>
        <View style={styles.header}>
          {isConfirmed && (
            <View style={styles.icon}>
              <CheckCircleIcon color={'#22C55E'} width={88} height={88} />
            </View>
          )}

          <Text style={styles.title}>
            {!isConfirmed ? 'Reset your Password' : 'Password Updated!'}
          </Text>
          <Text style={styles.text}>
            {!isConfirmed
              ? 'To complete your password reset, please enter your new password below:'
              : 'Your password has been changed successfully. Use your new password to log in.'}
          </Text>
        </View>

        {!isConfirmed ? (
          <View style={styles.body}>
            <Controller
              control={control}
              name="password"
              render={({field: {onChange, value}}) => (
                <Input
                  placeholder={''}
                  label={'Password'}
                  value={value}
                  onChangeText={onChange}
                  error={errors.password?.message}
                  isPassword
                />
              )}
            />

            <Controller
              control={control}
              name="confirmPassword"
              render={({field: {onChange, value}}) => (
                <Input
                  placeholder={''}
                  label={'Confirm Password'}
                  value={value}
                  onChangeText={onChange}
                  error={errors.confirmPassword?.message}
                  isPassword
                />
              )}
            />
          </View>
        ) : (
          <View style={styles.btnLoginNow}>
            <Button
              label={'Login now'}
              disabled={false}
              onPress={(): void => navigation.navigate('login')}
            />
          </View>
        )}
      </KeyboardAvoidingScrollView>

      {!isConfirmed && (
        <View style={styles.footer}>
          <View style={styles.button}>
            <Button
              label={'Reset Password'}
              disabled={loading || !isValid}
              loading={loading}
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
    paddingHorizontal: 32,
    backgroundColor: 'white',
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
    fontWeight: '500',
    textAlign: 'center',
  },

  body: {
    marginTop: 40,
    rowGap: 16,
  },

  footer: {
    backgroundColor: 'white',
    rowGap: 16,
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

  icon: {
    marginTop: 20,
    marginBottom: 40,
  },
  btnLoginNow: {
    width: 102,
    alignSelf: 'center',
    marginTop: 40,
  },
});

export default ResetPassword;
