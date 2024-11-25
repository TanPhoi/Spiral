import {NavigationContainer} from '@react-navigation/native';
import React, {createContext, useEffect, useRef, useState} from 'react';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import {useAuthContext} from '@/contexts/auth.context';
import {getMe} from '@/apis/auth';
import {Image, StyleSheet, Text, View} from 'react-native';
import Video, {VideoRef} from 'react-native-video';
import {PaperProvider} from 'react-native-paper';

const AppNavigation = (): JSX.Element => {
  const [loading, setLoading] = useState<boolean>(true);
  const {userInfo, updateUserInfo} = useAuthContext();
  const videoRef = useRef<VideoRef>(null);

  useEffect(() => {
    handleGetUserInfo();
    const timer = setTimeout(() => setLoading(false), 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleGetUserInfo = () => {
    getMe()
      .then(res => {
        updateUserInfo(res.data);
      })
      .catch(err => {
        console.log('Error fetching user info:', err);
      })
      .finally(() => {});
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Video
          ref={videoRef}
          source={require('../assets/videos/spiral.mp4')}
          style={styles.video}
          resizeMode="cover"
          repeat
          onError={e => console.error('Video Error:', e)}
        />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {userInfo ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  video: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

export default AppNavigation;
