/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { AuthContextProvider } from '@/contexts/auth.context';
import AppNavigation from '@/navigations/AppNavigation';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ToastProvider } from 'react-native-toast-notifications';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { configureReanimatedLogger } from 'react-native-reanimated';

function App(): React.JSX.Element {
  configureReanimatedLogger({
    strict: false,
  });

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={[backgroundStyle, styles.container]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={'transparent'}
        translucent={true}
      />
      <GestureHandlerRootView style={styles.container}>
        <BottomSheetModalProvider>
          <ToastProvider>
            <AuthContextProvider>
              <AppNavigation />
            </AuthContextProvider>
          </ToastProvider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
