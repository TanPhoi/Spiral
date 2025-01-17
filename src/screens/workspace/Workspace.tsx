import { getCampaigns, getExploreCampaign } from '@/apis/campaign';
import { NoCampaign } from '@/assets/svg';
import ButtonTab from '@/common/buttons/ButtonTab';
import Layout from '@/common/layouts/Layout';
import CampaignCard from '@/components/campaigns/CampaignCard';
import { useAuthContext } from '@/contexts/auth.context';
import { Influencer } from '@/models/Campaign.model';
import colors from '@/themes/colors';
import { typography } from '@/themes/typography';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import React, { JSX, useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  AdjustmentsHorizontalIcon,
  BellIcon,
  MagnifyingGlassIcon,
} from 'react-native-heroicons/outline';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useToast } from 'react-native-toast-notifications';

const Workspace = (): JSX.Element => {
  const toast = useToast();
  const { userInfo } = useAuthContext();
  const navigation: NavigationProp<ParamListBase> = useNavigation();
  const [params, setParams] = useState<{ page: number; limit: number }>({
    page: 1,
    limit: 100,
  });
  const [activeTab, setActiveTab] = useState<
    'explore_campaign' | 'joined_campaign' | 'waiting_to_apply'
  >('explore_campaign');

  const [campaigns, setCampaigns] = useState<Influencer[]>([]);

  useEffect(() => {
    handleGetCampaigns();
  }, [activeTab]);

  useEffect(() => {
    handleGetCampaigns();
    const unsubscribe = navigation.addListener('focus', async () => {
      handleRefresh();
    });

    return unsubscribe;
  }, [activeTab]);

  const handleRefresh = (): void => {
    handleGetCampaigns();
  };

  const handleGetCampaigns = (): void => {
    if (activeTab === 'explore_campaign') {
      getExploreCampaign(params.limit, params.page)
        .then(res => {
          setCampaigns(res.data.data);
        })
        .catch(err => {
          console.log(err);
          toast.show(err.message, { type: 'danger', placement: 'top' });
        });
    } else {
      getCampaigns(userInfo?.id as string, params.limit, params.page, activeTab)
        .then(res => {
          setCampaigns(res.data.data);
        })
        .catch(err => {
          console.log(err);
          toast.show(err.message, { type: 'danger', placement: 'top' });
        });
    }
  };

  return (
    <Layout title={'Workspace'}>
      <View style={styles.container}>
        {/* Tabs */}
        <View style={styles.tabs}>
          <ButtonTab
            label={'Explore Campaign'}
            active={activeTab === 'explore_campaign'}
            onPress={(): void => setActiveTab('explore_campaign')}
          />
          <ButtonTab
            label={'Joined'}
            active={activeTab === 'joined_campaign'}
            onPress={(): void => setActiveTab('joined_campaign')}
          />
          <ButtonTab
            label={'Invited'}
            active={activeTab === 'waiting_to_apply'}
            onPress={(): void => setActiveTab('waiting_to_apply')}
          />
        </View>

        <View style={styles.campaigns}>
          {campaigns.length < 1 ? (
            <View style={styles.noCampaign}>
              <NoCampaign />
            </View>
          ) : (
            <FlatList
              data={campaigns}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) => (
                <View style={styles.campaignItem}>
                  <CampaignCard
                    campaign={item}
                    tab={activeTab}
                    onRefresh={handleRefresh}
                  />
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          )}
        </View>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    backgroundColor: colors.gray[100],
  },
  headerWordSpace: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
  },
  txtWorkSpace: {
    color: colors.gray[900],
    fontWeight: '600',
    ...typography.heading2,
  },
  headerAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: 8,
  },
  alert: {
    position: 'absolute',
    right: -2,
    top: -1,
    width: 6,
    height: 6,
    backgroundColor: colors.rose[500],
    borderRadius: 6 / 2,
  },
  tabs: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 12,
  },

  campaigns: {
    marginTop: 16,
    marginRight: 16,
    marginLeft: 16,
    flex: 1,
  },

  campaignItem: {
    marginBottom: 16,
  },

  noCampaign: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Workspace;