import {getMe} from '@/apis/auth';
import {User} from '@/models/User.model';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {ReactNode, createContext, useContext, useState} from 'react';

type AuthContextType = {
  userInfo: User | null;
  updateUserInfo: (newValue: User | null) => void;
  handleLogout: () => void;
  handleRefreshUserInfo: () => Promise<void>;
};

export const MyContext = createContext<AuthContextType | undefined>(undefined);

type AuthContextProviderProps = {children: ReactNode};
const AuthContextProvider = ({
  children,
}: AuthContextProviderProps): React.JSX.Element => {
  const [userInfo, setUserInfo] = useState<User | null>(null);

  const updateUserInfo = (info: User | null) => {
    setUserInfo(info);
  };

  const handleLogout = (): void => {
    AsyncStorage.removeItem('access_token');
    setUserInfo(null);
  };

  const handleRefreshUserInfo = async (): Promise<void> => {
    await getMe().then(res => {
      setUserInfo(res?.data);
    });
  };

  return (
    <MyContext.Provider
      value={{userInfo, updateUserInfo, handleLogout, handleRefreshUserInfo}}>
      {children}
    </MyContext.Provider>
  );
};

const useAuthContext = () => {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error('AuthContext must be used within a AuthContextProvider');
  }
  return context;
};

export {AuthContextProvider, useAuthContext};
