import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import { PermissionsAndroid, Platform } from 'react-native';

export const requestUserPermission = async () => {
    const checkPermission = await AsyncStorage.getItem('permission-notification')
    if (checkPermission === 'true') {
        return;
    }

    if (Platform.OS === 'android' && Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            await AsyncStorage.setItem('permission-notification', 'false');
            console.log('Permission notification issued');

            await messaging().registerDeviceForRemoteMessages()
                .then(() => {
                    messaging().getToken().then((token) => {
                        console.log(token);
                    })
                })

        } else {
            await AsyncStorage.setItem('permission-notification', 'true')
            console.log('Permission notification rejected');
        }
    } else {
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
            console.log('Permission notification issued');
        } else {
            console.log('Permission notification rejected');
        }
    }
};

export const getFcmToken = async () => {
    let fcmToken = undefined;
    if (!fcmToken) {
        try {
            const token = await messaging().getToken();
            token && (await AsyncStorage.setItem('fcmToken', token));
        } catch (error) {
            console.log('Cant get the token', error);
        }
    }
};