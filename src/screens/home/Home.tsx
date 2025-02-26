import colors from '@/themes/colors';
import { typography } from '@/themes/typography';
import React, { useEffect, useState } from 'react';
import { FlatList, NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, Text, TouchableOpacity, View, VirtualizedList } from 'react-native';
import { AdjustmentsHorizontalIcon, ArrowRightCircleIcon, BellIcon, MagnifyingGlassIcon } from 'react-native-heroicons/outline';
import { SafeAreaView } from 'react-native-safe-area-context';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import Balance from '@/components/profile/Balance';
import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import CampaignCard from '@/components/campaigns/CampaignCard';
import { getCampaigns } from '@/apis/campaign';
import { useAuthContext } from '@/contexts/auth.context';
import { Influencer } from '@/models/Campaign.model';
import ConnectionStatus from '@/components/profile/ConnectionStatus';
import NetworkLogger from 'react-native-network-logger';
import Layout from '@/common/layouts/Layout';

const Home = (): JSX.Element => {
  const { userInfo } = useAuthContext()
  const navigation: NavigationProp<ParamListBase> = useNavigation()
  const [location, setLocation] = useState()
  const [params, setParams] = useState<{ limit: number, page: number }>({ limit: 10, page: 1 })
  const [campaigns, setCampaign] = useState<Influencer[]>([])
  const [theme, setTheme] = useState<string>(colors.teal[950])

  useEffect(() => {
    Geolocation.getCurrentPosition(info => {
      if (info) {
        reverseGeoCode({ lat: info.coords.latitude, long: info.coords.longitude })
      }
    });
  }, [])

  useEffect(() => {
    getJoinedCampaign()
    const unsubscribe = navigation.addListener('focus', async () => {
      getJoinedCampaign()
    })
    return unsubscribe
  }, [])

  const getJoinedCampaign = (): void => {
    getCampaigns(userInfo?.creator?.id || '', params.limit, params.page, 'joined_campaign').then((res) => {
      setCampaign(res.data.data);
    }).catch((err) => console.log(err))
  }

  const reverseGeoCode = async ({ lat, long }: { lat: number, long: number }) => {
    const api = `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${lat},${long}&lang=vi-VI&apiKey=5fmlm7ZN9emHVpXbXE1RhkyeDncI9yAEjnuoU2JuVAA`
    try {
      const res = await axios(api)
      if (res && res.status === 200 && res.data)
        setLocation(res.data.items[0]);
    } catch (error) {
      console.log(error);
    }
  }

  const handleOnScroll = (event: NativeSyntheticEvent<NativeScrollEvent>): void => {
    const offSetY = event.nativeEvent.contentOffset.y
    const newTheme = offSetY >= 236 ? 'white' : colors.teal[950]
    if (newTheme !== theme) setTheme(newTheme)
  }

  return (
    <View style={styles.container}>
      <View style={{ backgroundColor: theme }}>
        <SafeAreaView style={[styles.headerWordSpace]}>
          <Text style={styles.txtHome}>Home</Text>
          <TouchableOpacity onPress={() => navigation.navigate('geo-location')}>
            <Text style={styles.txtLocation}>Current Location</Text>
            <Text style={styles.txtLocationTwo}>{location?.address?.city}, {location?.address?.countryName}</Text>
          </TouchableOpacity>
          <View style={styles.headerAction}>
            <TouchableOpacity>
              <MagnifyingGlassIcon
                color={colors.gray[700]}
                width={24}
                height={24}
              />
            </TouchableOpacity>

            <TouchableOpacity>
              <AdjustmentsHorizontalIcon
                color={colors.gray[700]}
                width={24}
                height={24}
              />
            </TouchableOpacity>

            <View>
              <TouchableOpacity>
                <View style={styles.alert}></View>
                <BellIcon color={colors.gray[700]} width={24} height={24} />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        onScroll={handleOnScroll}>

        <Balance />

        <View style={styles.connectStatus}>
          <ConnectionStatus />
        </View>

        <LinearGradient colors={[colors.blue[100], colors.emerald[50]]}>
          <View style={styles.joinedCampaign}>
            <TouchableOpacity
              onPress={(): void => navigation.navigate('Workspace', { screen: 'Workspace' })}
              style={styles.labelCampaign}>
              <Text style={styles.txtCampaignJoined}>Campaign Joined</Text>
              <ArrowRightCircleIcon width={24} height={24} color={colors.gray[700]} />
            </TouchableOpacity>

            <View>
              <FlatList
                showsHorizontalScrollIndicator={false}
                horizontal
                data={campaigns}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                keyExtractor={(item, index) => item?.id ? item.id.toString() : index.toString()}
                renderItem={({ item }) => (
                  <View style={styles.campaignCard}>
                    <CampaignCard
                      campaign={item}
                      tab='joined_campaign'
                      onRefresh={function (): void {
                        throw new Error('Function not implemented.');
                      }} />
                  </View>
                )}
              />
            </View>
          </View>
        </LinearGradient>

        <View style={styles.joinedCampaignV}>
          <TouchableOpacity
            onPress={(): void => navigation.navigate('Workspace', { screen: 'Workspace' })}
            style={styles.labelCampaign}>
            <Text style={styles.txtCampaignJoined}>Campaign for you</Text>
            <ArrowRightCircleIcon width={24} height={24} color={colors.gray[700]} />
          </TouchableOpacity>

          <FlatList
            scrollEnabled={false}
            data={campaigns}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            keyExtractor={(item, index) => item?.id ? item.id.toString() : index.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.campaignCardV}>
                <CampaignCard
                  campaign={item}
                  tab='joined_campaign'
                  onRefresh={function (): void {
                    throw new Error('Function not implemented.');
                  }} />
              </View>
            )}
          />
        </View>
      </ScrollView>

    </View>
  )
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    backgroundColor: colors.teal[950],
  },
  headerWordSpace: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  txtHome: {
    color: colors.gray[900],
    fontWeight: '600',
    ...typography.heading4,
  },
  txtLocation: {
    color: colors.gray[900],
    fontWeight: '600',
    ...typography.body,
    textAlign: 'center'
  },
  txtLocationTwo: {
    color: colors.gray[900],
    fontWeight: '800',
    ...typography.caption,
    textAlign: 'center'
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

  connectStatus: {
    backgroundColor: colors.gray[100],
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
    marginTop: -20,
  },

  joinedCampaign: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  labelCampaign: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 12
  },
  txtCampaignJoined: {
    color: colors.gray[800],
    fontWeight: '500',
    ...typography.base
  },
  campaignCard: {
    width: 266,
    marginRight: 16,
    paddingVertical: 20,
  },
  joinedCampaignV: {
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
    marginTop: -20,
  },
  campaignCardV: {
    paddingTop: 12,
    paddingBottom: 16,
  },
});

export default Home;
