import {
  IcHome,
  IcWork_space,
  IcContent,
  IcReports,
  IcProfile,
} from '@/assets/svg';
import Workspace from '@/screens/workspace/Workspace';
import Reports from '@/screens/Reports';
import Profile from '@/screens/profile/Profile';
import React, { ComponentType, ElementType } from 'react';
import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';
import CampaignDetails from '@/screens/workspace/CampaignDetails';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CreateContent from '@/screens/workspace/CreateContent';
import SuccessSubmitContent from '@/screens/workspace/SuccessSubmitContent';
import Content from '@/screens/content/Content';
import ContentDetail from '@/screens/content/ContentDetail';
import ChangePassword from '@/screens/profile/ChangePassword';
import NotificationSetting from '@/screens/profile/NotificationSetting';
import PaymentMethods from '@/screens/profile/PaymentMethods';
import MyProfile from '@/screens/profile/MyProfile';
import ConnectSocialsAccount from '@/screens/profile/ConnectSocialsAccount';
import EditProfile from '@/screens/profile/EditProfile';
import GeoLocation from '@/screens/home/GeoLocation';
import Home from '@/screens/home/Home';

export const LAYOUT = 32;
export const LAYOUT_APP = 18;

const Tab = createMaterialBottomTabNavigator();
const Stack = createNativeStackNavigator();

export type TabScreenConfig = {
  name: string;
  component: ComponentType<ElementType | any>;
  icon?: ComponentType<ElementType | any> | null;
};

type CreateTabNavigatorProps = {
  screens: TabScreenConfig[];
  initialRouteName: string;
};

const createTabNavigator = ({
  screens,
  initialRouteName,
}: CreateTabNavigatorProps) => {
  return (
    <Tab.Navigator
      initialRouteName={initialRouteName}
      barStyle={{ display: 'none' }}>
      {screens.map(screen => (
        <Tab.Screen
          key={screen.name}
          name={screen.name}
          component={screen.component}
          options={{
            tabBarIcon: ({ color }: { color: string }) =>
              screen.icon && <screen.icon color={color} />,
          }}
        />
      ))}
    </Tab.Navigator>
  );
};

export const homeScreens: TabScreenConfig[] = [
  { name: 'home', component: Home, icon: IcHome },
];

export const workspaceScreens: TabScreenConfig[] = [
  { name: 'workspace', component: Workspace, icon: IcWork_space },
];

export const contentScreens: TabScreenConfig[] = [
  { name: 'content', component: Content, icon: IcContent },
];

export const reportScreens: TabScreenConfig[] = [
  { name: 'report', component: Reports, icon: IcReports },
];

export const profileScreens: TabScreenConfig[] = [
  { name: 'profile', component: Profile, icon: IcProfile },
  { name: 'change-password', component: ChangePassword, icon: IcProfile },
  { name: 'notification-setting', component: NotificationSetting, icon: IcProfile },
  { name: 'payment-methods', component: PaymentMethods, icon: IcProfile },
  { name: 'my-profile', component: MyProfile, icon: IcProfile },
  { name: 'connect-socials-account', component: ConnectSocialsAccount, icon: IcProfile },
  { name: 'edit-profile', component: EditProfile, icon: IcProfile },
];

export const HomeTabs = () =>
  createTabNavigator({ screens: homeScreens, initialRouteName: 'home' });
export const WorkspaceRoutes = () =>
  createTabNavigator({
    screens: workspaceScreens,
    initialRouteName: 'workspace',
  });
export const ContentRoutes = () =>
  createTabNavigator({ screens: contentScreens, initialRouteName: 'content' });
export const ReportTabs = () =>
  createTabNavigator({ screens: reportScreens, initialRouteName: 'report' });
export const ProfileTabs = () =>
  createTabNavigator({ screens: profileScreens, initialRouteName: 'profile' });

export const tabScreens = [
  {
    component: HomeTabs,
    label: 'Home',
    icon: IcHome,
  },
  {
    component: WorkspaceRoutes,
    label: 'Workspace',
    icon: IcWork_space,
  },
  {
    component: ContentRoutes,
    label: 'Content',
    icon: IcContent,
  },
  {
    component: ReportTabs,
    label: 'Report',
    icon: IcReports,
  },
  {
    component: ProfileTabs,
    label: 'Profile',
    icon: IcProfile,
  },
];
