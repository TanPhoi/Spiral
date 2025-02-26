/**
 * @format
 */

import { AppRegistry, LogBox } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import { startNetworkLogging } from 'react-native-network-logger';

messaging().onMessage(async remoteMessage => {
      await notifee.requestPermission();

      const channelId = await notifee.createChannel({
            id: 'default',
            name: 'Default Channel',
      });

      await notifee.displayNotification({
            title: '<p style="color: #4caf50;"><b>Styled HTMLTitle</span></p></b></p> &#128576;',
            subtitle: '&#129395;',
            body:
                  'The <p style="text-decoration: line-through">body can</p> also be <p style="color: #ffffff; background-color: #9c27b0"><i>styled too</i></p> &#127881;!',
            android: {
                  channelId,
                  color: '#4caf50',
                  actions: [
                        {
                              title: '<b>Dance</b> &#128111;',
                              pressAction: { id: 'dance' },
                        },
                        {
                              title: '<p style="color: #f44336;"><b>Cry</b> &#128557;</p>',
                              pressAction: { id: 'cry' },
                        },
                  ],
            },

      })
});
LogBox.ignoreAllLogs();
startNetworkLogging();
AppRegistry.registerComponent(appName, () => App);
