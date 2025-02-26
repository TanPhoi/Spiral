import { tabScreens } from '@/constants/screens.constant';
import ContentDetail from '@/screens/content/ContentDetail';
import ContentDetailRejected from '@/screens/content/ContentDetailRejected';
import EditContentReject from '@/screens/content/EditContentReject';
import GeoLocation from '@/screens/home/GeoLocation';
import Notification from '@/screens/notification/Notification';
import CampaignDetails from '@/screens/workspace/CampaignDetails';
import CreateContent from '@/screens/workspace/CreateContent';
import SuccessSubmitContent from '@/screens/workspace/SuccessSubmitContent';
import colors from '@/themes/colors';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ParamListBase, RouteProp } from '@react-navigation/native';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import React, { JSX } from 'react';
import { StyleSheet, View } from 'react-native';

type CustomRouteProp = RouteProp<ParamListBase, string> & {
  state?: {
    index: number;
    router: Array<any>;
  };
};

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabNavigator = (): JSX.Element => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        return {
          headerShown: false,
          tabBarHideOnKeyboard: true,
          tabBarActiveTintColor: colors.blue[600],
          tabBarInactiveTintColor: colors.gray[700],

          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '600',
          },
          tabBarStyle: {
            paddingBottom: 15,
            height: 60,
            borderTopWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
          },
        };
      }}>
      {tabScreens.map((screen, index) => (
        <Tab.Screen
          key={screen.label}
          name={screen.label}
          component={screen.component}
          listeners={({
            navigation,
            route,
          }: {
            navigation: any;
            route: CustomRouteProp;
          }) => ({
            tabPress: e => {
              const shouldBeUpdate = route?.state && route.state.index !== 0;

              if (route.name == 'Profile' && shouldBeUpdate) {
                navigation.reset({ index: 0, routes: [{ name: 'Profile' }] });
              }
              if (route.name == 'Workspace' && shouldBeUpdate) {
                navigation.reset({ index: 0, routes: [{ name: 'Workspace' }] });
              }
            },
          })}
          options={{
            tabBarIcon: ({ focused, color }) => {
              const IconComponent = screen.icon;
              return (
                <View style={styles.iconContainer}>
                  <View style={styles.iconWrapper}>
                    <IconComponent color={color} width={21} height={21} />
                  </View>
                  {focused && <View style={styles.activeBorder} />}
                </View>
              );
            },
          }}
        />
      ))}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    position: 'relative',
    marginBottom: 5,
    paddingTop: 5,
  },
  activeBorder: {
    position: 'absolute',
    alignSelf: 'center',
    top: -2,
    width: 70,
    height: 3,
    backgroundColor: colors.blue[600],
  },
});

export default function AppStack() {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false,
    }}>
      <Stack.Screen name="main" component={TabNavigator} />
      <Stack.Screen name="campaign-details" component={CampaignDetails} />
      <Stack.Screen name="geo-location" component={GeoLocation} />
      <Stack.Screen name="create-content" component={CreateContent} />
      <Stack.Screen name="success_submit_content" component={SuccessSubmitContent} />
      <Stack.Screen name="content-detail" component={ContentDetail} />
      <Stack.Screen name="content-detail-rejected" component={ContentDetailRejected} />
      <Stack.Screen name="edit-content-reject" component={EditContentReject} />
      <Stack.Screen name="notification" component={Notification} options={{
        animationEnabled: true
      }} />
    </Stack.Navigator>
  )
}
