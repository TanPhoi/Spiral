import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { JSX, useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeftIcon, TicketIcon } from 'react-native-heroicons/outline';
import colors from '@/themes/colors';
import { typography } from '@/themes/typography';
import ButtonBase from '@/common/buttons/ButtonBase';
import { getSocialMediaIcon } from '@/helper/campaign.helper';
import { ScrollView } from 'react-native-gesture-handler';
import QuillEditor from 'react-native-cn-quill';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { getCampaignDetails, responseInvitationOfBrand } from '@/apis/campaign';
import { Influencer } from '@/models/Campaign.model';
import dayjs from 'dayjs';
import { DATE_FORMAT } from '@/constants/time.constant';
import ModalConfirm from '@/common/modals/ModalConfirm';
import Overlay from '@/common/overlay/Overlay';
import { useToast } from 'react-native-toast-notifications';
import Header from '@/common/headers/Header';
import Overview from './Overview';
import { campaignDetailTabOptions } from '@/constants/campaign.constant';
import ButtonTab from '@/common/buttons/ButtonTab';
import Product from './Product';

const CampaignDetails = (): JSX.Element => {
  const location: any = useRoute();
  const navigation: NavigationProp<ParamListBase> = useNavigation();

  const [campaign, setCampaign] = useState<Influencer | null>(null);
  const [activeTab, setActiveTab] = useState<string>('overview');

  useEffect(() => {
    handleGetCampaignDetails();
    const unsubscribe = navigation.addListener('focus', async () => {
      handleGetCampaignDetails();
    });
    return unsubscribe;
  }, [location?.params?.id]);

  const handleGetCampaignDetails = async (): Promise<void> => {
    await getCampaignDetails(location.params.id).then(res => {
      setCampaign(res.data);
    });
  };

  return (
    <View style={styles.root}>

      <SafeAreaView style={styles.container}>
        <Header
          title={'Campaign detail'}
          type={'back'}
          onPress={() => navigation.goBack()}
        />
        {/* Tabs */}

        {campaign?.status === 'joined_campaign' && (
          <View style={styles.tabContainer}>
            <View style={styles.tabs}>
              {
                campaignDetailTabOptions.map((tab) => (
                  <ButtonTab
                    key={tab.value}
                    label={tab.label}
                    active={activeTab === tab.value}
                    onPress={(): void => setActiveTab(tab.value)} />
                ))
              }
            </View>
          </View>
        )}


        <View style={{ flex: 1, paddingHorizontal: 16 }}>
          {
            activeTab === 'overview' &&
            <Overview
              onRefresh={() => handleGetCampaignDetails()}
              campaign={campaign}
              campaignId={location.params.id} />
          }

          {
            activeTab === 'product' &&
            <Product />
          }
        </View>

      </SafeAreaView>

    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  tabContainer: {
    marginTop: 8,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: colors.gray[200],
    padding: 16
  },
  tabs: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 12,
  },

  invitation: {
    marginTop: 20,
  },
  dividerTop: {
    position: 'absolute',
    backgroundColor: colors.blue[600],
    height: 80,
    width: '100%',
    borderRadius: 16,
    top: 16,
  },
  buttonAction: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 80,
    marginTop: 20,
    backgroundColor: colors.blue[50],
    borderRadius: 16,
    padding: 16,
  },
  content: {
    color: colors.gray[800],
    ...typography.caption,
    width: '55.22%',
    textAlign: 'justify',
  },
  buttonActionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 12,
  },

  body: {
    marginTop: 20,
    rowGap: 20,
  },
  campaignTitle: {
    color: colors.gray[900],
    fontWeight: '600',
    ...typography.heading4,
  },
  txtSocialMedia: {
    color: colors.gray[900],
    fontWeight: '600',
    ...typography.base,
  },
  socialMedia: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 12,
    marginTop: 12,
  },

  campaignInfo: {
    padding: 20,
    borderWidth: 1,
    borderRadius: 16,
    borderColor: colors.gray[200],
    rowGap: 20,
  },
  label: {
    color: colors.gray[800],
    fontWeight: '600',
    ...typography.base,
  },
  deadline: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  txtDeadline: {
    color: colors.gray[500],
    fontWeight: '600',
    ...typography.base,
  },
  txtTime: {
    color: colors.gray[800],
    fontWeight: '500',
    ...typography.base,
  },
  discountBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    columnGap: 12,
    padding: 12,
    backgroundColor: colors.rose[100],
    borderRadius: 16,
  },
  txtDiscount: {
    color: colors.gray[800],
    fontWeight: '500',
    ...typography.base,
  },
  backgroundBox: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    marginTop: 12,
    backgroundColor: colors.gray[200],
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  txtContent: {
    color: colors.gray[700],
    ...typography.body,
  },
  commissionFee: {
    marginTop: 12,
    color: colors.gray[500],
    ...typography.body,
  },
  campaignDemographic: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8,
  },

  footer: {
    marginTop: 20,
    minHeight: 300,
  },
  button: {
    marginHorizontal: 16,
  },
  buttonCreate: {
    marginBottom: 10
  },
});

export default CampaignDetails;
