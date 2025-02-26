import Input from '@/common/inputs/Input';
import { EMAIL_REQUIRED, INVALID_EMAIL } from '@/constants/message.constant';
import colors from '@/themes/colors';
import { typography } from '@/themes/typography';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as yup from 'yup';
import { IcFacebook, IcGoogle, IcInstagram, IcTikTok } from '@/assets/svg';
import Button from '@/common/buttons/Button';
import { Auth } from '@/models/User.model';
import { createPasswordValidatorSchema } from '@/validators/account.validator';
import { Link } from '@react-navigation/native';
import { KeyboardAvoidingScrollView } from 'react-native-keyboard-avoiding-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMe, login, login3rdParty } from '@/apis/auth';
import { useToast } from 'react-native-toast-notifications';
import { useAuthContext } from '@/contexts/auth.context';
import InstagramLogin from 'react-native-instagram-login';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import {
  LoginButton,
  LoginManager,
  Profile,
  Settings,
} from 'react-native-fbsdk-next';

const fromSchema = yup.object().shape({
  email: yup.string().email(INVALID_EMAIL).required(EMAIL_REQUIRED),
  password: createPasswordValidatorSchema(),
});

GoogleSignin.configure({
  webClientId:
    '61759048109-q79iis5m4lkmhvcm4m5qk06mdft0l3f3.apps.googleusercontent.com',
});

Settings.setAppID('1089517339202142');

const Login = (): JSX.Element => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(fromSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onChange',
  });
  const toast = useToast();
  const { updateUserInfo } = useAuthContext();
  const insRef = useRef<InstagramLogin | null>(null);
  const [token, setToken] = useState(null);

  const onSubmit = (data: Auth): void => {
    const payload = {
      ...data,
      email: data.email.toLowerCase(),
    };

    login(payload)
      .then(res => {
        console.log(res);

        AsyncStorage.setItem('access_token', res.data.id);
        handleGetUserInfo();
      })
      .catch(err => {
        toast.show(err.message, {
          type: 'danger',
          placement: 'top',
        });
        console.log(err);
      });
  };

  const handleGetUserInfo = (): void => {
    getMe()
      .then(res => {
        updateUserInfo(res.data);
      })
      .catch(err => {
        toast.show(err.message, { type: 'danger', placement: 'top' });
        console.log(err);
      });
  };

  const handleLoginIG = (token: string) => { };

  const handleLoginGoogle = async () => {
    await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true,
    });

    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      login3rdParty(userInfo.data?.user)
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleLoginFacebook = async () => {
    try {
      const result = await LoginManager.logInWithPermissions([
        'public_profile',
      ]);
      if (result.isCancelled) {
        console.log('isCancelled');
      } else {
        const profile = await Profile.getCurrentProfile();
        if (profile) {
          console.log(profile);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingScrollView>
        <Text style={styles.txtHeader}>Log in to your account</Text>
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

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <Input
                error={errors.password?.message}
                placeholder={'Password'}
                label={'Password'}
                isPassword={true}
                value={value}
                onChangeText={onChange}
              />
            )}
          />

          <View style={styles.btnForgotPassword}>
            <Link to={'/forgot-password'}>
              <Text style={styles.txtForgotPassword}>Forgot password?</Text>
            </Link>
          </View>

          <View style={styles.boxOrLoginWith}>
            <View style={styles.line}></View>
            <Text>or Login with</Text>
            <View style={styles.line}></View>
          </View>

          <View style={styles.socialList}>
            <TouchableOpacity
              style={styles.btnSocialMedia}
              onPress={handleLoginFacebook}>
              <IcFacebook />
              <Text style={styles.txtSocialMedia}>Facebook</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnSocialMedia}
              onPress={handleLoginGoogle}>
              <IcGoogle />
              <Text style={styles.txtSocialMedia}>Google</Text>
            </TouchableOpacity>

          </View>

          <View style={styles.socialList}>
            <TouchableOpacity style={styles.btnSocialMedia}>
              <IcTikTok />
              <Text style={styles.txtSocialMedia}>Tiktok</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnSocialMedia}
              onPress={() => insRef.current?.show()}>
              <IcInstagram />
              <Text style={styles.txtSocialMedia}>Instagram</Text>
            </TouchableOpacity>
          </View>

        </View>
      </KeyboardAvoidingScrollView>

      <View style={styles.footer}>
        <View style={styles.button}>
          <Button
            label={'Login'}
            disabled={!isValid}
            onPress={handleSubmit(onSubmit)}
          />
        </View>

        <View style={styles.boxSignUp}>
          <Text style={styles.txtNoAccount}>Don’t have an account?</Text>
          <Link to="/register">
            <Text style={styles.txtSignUp}>Sign up</Text>
          </Link>
        </View>
      </View>

      <InstagramLogin
        ref={insRef}
        appId="517966021062255"
        appSecret="853a4ab009a699a1fc0da94728a38b99"
        redirectUrl="https://github.com/"
        scopes={['user_profile', 'user_media']}
        onLoginSuccess={handleLoginIG}
        onLoginFailure={data => console.log(data)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 32,
  },
  txtHeader: {
    marginTop: 84,
    textAlign: 'center',
    ...typography.heading2,
    color: colors.gray[900],
    fontWeight: '700',
  },

  body: {
    marginTop: 40,
    rowGap: 16,
  },
  btnForgotPassword: {
    alignSelf: 'flex-end',
  },
  txtForgotPassword: {
    color: colors.gray[800],
    fontWeight: '500',
    ...typography.body,
    textDecorationLine: 'underline',
  },
  boxOrLoginWith: {
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: 10,
  },
  line: {
    backgroundColor: colors.gray[200],
    height: 1,
    flex: 1,
  },
  txtOrLoginWith: {
    color: colors.gray[500],
    ...typography.caption,
  },
  socialList: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'space-between',
  },
  btnSocialMedia: {
    width: '47.5%',
    flexDirection: 'row',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: 4,
  },
  txtSocialMedia: {
    color: '#1F2937',
    ...typography.body,
    fontWeight: '600',
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
});

export default Login;
