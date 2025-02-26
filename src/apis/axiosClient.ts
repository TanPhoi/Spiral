import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { InternalAxiosRequestConfig } from 'axios';
import { API_URL } from '@env';

const axiosClient = axios.create({
  baseURL: `http://192.168.1.13:3001`,
  timeout: 10000,
  headers: {
    contentType: 'application/json',
  },
});

axiosClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await AsyncStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error),
);

axiosClient.interceptors.response.use(
  response => response.data,
  ({ message, response }) => {
    if (response?.status === 401) {
      AsyncStorage.removeItem('access_token');
      return;
    }

    const errorMessage =
      response?.data?.message || response?.data?.error || message;
    const errorCode = response?.data?.code ?? -1;

    return Promise.reject({
      message: errorMessage,
      code: errorCode,
      status: response?.status ?? -1,
    });
  },
);

const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const getData = async (url: string, params = {}) => {
  try {
    const headers = await getAuthHeaders();
    const result = await axiosClient.get(url, { params, headers });
    return result;
  } catch (e) {
    throw e;
  }
};

const postData = async (url: string, data = {}) => {
  try {
    const headers = {
      ...(await getAuthHeaders()),
      'Content-Type':
        data instanceof FormData ? 'multipart/form-data' : 'application/json',
    };
    const result = await axiosClient.post(url, data, { headers });
    return result;
  } catch (e) {
    throw e;
  }
};

const putData = async (url: string, data = {}) => {
  const result = await axiosClient.put(url, data);
  return result;
};

const deleteData = async (url: string, params = {}) => {
  const result = await axiosClient.delete(url, { params });
  return result;
};

const patchData = async (url: string, data = {}) => {
  const result = await axiosClient.patch(url, data);
  return result;
};

export { deleteData, getData, patchData, postData, putData };
export default axiosClient;
