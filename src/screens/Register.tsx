import { registerCreator } from '@/apis/auth';
import Button from '@/common/buttons/Button';
import Input from '@/common/inputs/Input';
import InputCountry from '@/common/inputs/InputCountry';
import Overlay from '@/common/overlay/Overlay';
import ModalSelect from '@/common/selects/ModalSelect';
import { CATEGORIES_OPTION } from '@/constants/categories.constant';
import {
  CONFIRM_PASSWORD_REQUIRED,
  EMAIL_REQUIRED,
  INVALID_EMAIL,
  NAME_REQUIRED,
  PASSWORD_MISMATCH,
  PHONE_REQUIRED,
} from '@/constants/message.constant';
import { SignUpPayload } from '@/models/User.model';
import colors from '@/themes/colors';
import { typography } from '@/themes/typography';
import { createPasswordValidatorSchema } from '@/validators/account.validator';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Link,
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';
import { KeyboardAvoidingScrollView } from 'react-native-keyboard-avoiding-scroll-view';
import { useToast } from 'react-native-toast-notifications';
import * as yup from 'yup';

const fromSchema = yup.object().shape({
  name: yup.string().required(NAME_REQUIRED),
  email: yup.string().email(INVALID_EMAIL).required(EMAIL_REQUIRED),
  phone: yup.string().required(PHONE_REQUIRED),
  category: yup.array().notRequired(),
  password: createPasswordValidatorSchema(),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), PASSWORD_MISMATCH])
    .required(CONFIRM_PASSWORD_REQUIRED),
});

const Register = (): JSX.Element => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(fromSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      category: [],
      password: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  const toast = useToast();
  const navigation: NavigationProp<ParamListBase> = useNavigation();
  const [isModal, setIsModal] = useState<boolean>(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSubmit = (data: SignUpPayload): void => {
    setIsLoading(true);
    // delete data.confirmPassword;
    const payload = {
      ...data,
      email: data.email?.toLowerCase(),
      category: categories,
    };
    registerCreator(payload)
      .then(res => {
        navigation.navigate('verification-email', {
          userInfo: {
            id: res.data.id,
            email: data.email?.toLowerCase(),
          },
        });
      })
      .finally(() => {
        setIsLoading(false);
      })
      .catch(err => {
        toast.show(err.message, { type: 'danger', placement: 'top' });
        console.log(err);
      });
  };

  const handleChangeCategories = useCallback((values: string[]) => {
    setCategories(values);
  }, []);

  const handleOverlayToggle = (isVisible: boolean): void => {
    setIsModal(isVisible);
  };

  return (
    <View style={styles.container}>
      {isModal && <Overlay isVisible={isModal} />}

      <KeyboardAvoidingScrollView>
        <Text style={styles.txtHeader}>Sign up</Text>

        <View style={styles.body}>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <Input
                onChangeText={onChange}
                value={value}
                error={errors.name?.message}
                label={'Name'}
                placeholder={'e.g. John Marr'}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                onChangeText={onChange}
                value={value}
                error={errors.email?.message}
                label={'Email'}
                placeholder={'e.g. John Marr'}
              />
            )}
          />

          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, value } }) => (
              <InputCountry
                error={errors.phone?.message}
                label={'Phone number'}
                value={value || ''}
                placeholder={'000-000-000'}
                onChangeText={onChange}
              />
            )}
          />

          <ModalSelect
            label={'Category/Niche'}
            placeholder={'Maximum 3 Category/Niche'}
            labelHeader={'Category/Niche'}
            options={CATEGORIES_OPTION}
            onChange={handleChangeCategories}
            onToggleOverlayVisible={setIsModal}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <Input
                onChangeText={onChange}
                value={value}
                error={errors.password?.message}
                label={'Password'}
                placeholder={'Password'}
                isPassword
              />
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, value } }) => (
              <Input
                onChangeText={onChange}
                value={value}
                error={errors.confirmPassword?.message}
                label={'Confirm Password'}
                placeholder={'Confirm password'}
                isPassword
              />
            )}
          />

          <View>
            <Text style={styles.txtTerms}>
              By clicking on sign up you agree to{' '}
              <Text style={styles.underline}>Terms of Service</Text> and{' '}
              <Text style={styles.underline}>Privacy Policy</Text>
            </Text>
          </View>
        </View>
      </KeyboardAvoidingScrollView>

      <View style={styles.footer}>
        <View style={styles.button}>
          <Button
            label={'Sign up'}
            disabled={!isValid}
            onPress={handleSubmit(onSubmit as any)}
            loading={isLoading}
          />
        </View>

        <View style={styles.boxLogIn}>
          <Text style={styles.txtHaveAccount}>Already have an account?</Text>
          <Link to="/login">
            <Text style={styles.txtLogIn}>Log in</Text>
          </Link>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 32,
  },
  scrollView: {
    flex: 1,
    marginBottom: 120,
  },
  txtHeader: {
    marginTop: 84,
    textAlign: 'center',
    ...typography.heading2,
    color: colors.gray[900],
    fontWeight: '700',
  },

  body: {
    rowGap: 16,
  },

  footer: {
    width: '100%',
    backgroundColor: 'white',
    rowGap: 16,
  },
  button: {},
  boxLogIn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: 12,
    marginBottom: 10,
  },
  txtHaveAccount: {
    color: '#1F2937',
    ...typography.body,
  },
  txtLogIn: {
    color: '#2563EB',
    ...typography.body,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },

  txtTerms: {
    color: colors.gray[800],
    fontWeight: '500',
    ...typography.body,
  },
  underline: {
    textDecorationLine: 'underline',
  },
});

export default Register;
