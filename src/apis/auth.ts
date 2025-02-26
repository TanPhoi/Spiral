import {Auth, SignUpPayload} from '@/models/User.model';
import {getData, postData} from './axiosClient';

export const registerCreator = (payload: SignUpPayload) => {
  return postData('/auth/register', payload);
};

export const login = (payload: Auth) => {
  return postData('/auth/login', payload);
};

export const verificationEmail = (payload: SignUpPayload) => {
  return postData('/auth/verification', payload);
};

export const login3rdParty = (payload: any) => {
  return postData('/auth/login-3rd-party', payload);
};

type ResetPassword = {
  email: string;
  password: string;
};

export const resetPassword = (payload: ResetPassword) => {
  return postData('/auth/reset-password', payload);
};

export type OTPPayload = {
  id?: string;
  email?: string;
  otp?: string;
};

export const verifyOTP = (payload: OTPPayload) => {
  return postData('/auth/validate-otp/active-user', payload);
};

export const resendOTP = (payload: OTPPayload) => {
  return postData('/auth/resend-otp/active-user', payload);
};

export const forgotPassword = (payload: OTPPayload) => {
  return postData('/auth/resend-otp/reset-password', payload);
};

export const verifyOTPResetPassword = (payload: OTPPayload) => {
  return postData('/auth/validate-otp/reset-password', payload);
};

export const getMe = () => {
  return getData('/auth/me');
};
