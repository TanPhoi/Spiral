import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React, { JSX, memo } from 'react';
import colors from '@/themes/colors';
import { typography } from '@/themes/typography';
import ButtonTab from '@/common/buttons/ButtonTab';
import ButtonBase from '@/common/buttons/ButtonBase';
import { Influencer } from '@/models/Campaign.model';
import dayjs from 'dayjs';
import { DATE_FORMAT, DATE_TIME_FORMAT } from '@/constants/time.constant';
import { getSocialMediaIcon } from '@/helper/campaign.helper';
import { responseInvitationOfBrand } from '@/apis/campaign';
import { useToast } from 'react-native-toast-notifications';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';

type CampaignCardProps = {
  campaign: Influencer;
  tab?: string;
  onRefresh: () => void;
};

const CampaignCard = ({
  campaign,
  tab,
  onRefresh,
}: CampaignCardProps): JSX.Element => {
  const toast = useToast();
  const navigation: NavigationProp<ParamListBase> = useNavigation();

  const isJoined = tab === 'joined_campaign';

  const handleAccept = (): void => {
    responseInvitationOfBrand(campaign?.campaign?.id || '', true)
      .then(() => {
        onRefresh();
        toast.show('Accepted the invitation!', {
          type: 'success',
          placement: 'top',
        });
      })
      .catch(err => {
        console.log(err);
        toast.show(err.message, {
          type: 'danger',
          placement: 'top',
        });
      });
  };

  const handleDecline = (): void => {
    responseInvitationOfBrand(campaign?.campaign?.id || '', false)
      .then(() => {
        onRefresh();
        toast.show('Declined the invitation!', {
          type: 'success',
          placement: 'top',
        });
      })
      .catch(err => {
        console.log(err);
        toast.show(err.message, {
          type: 'danger',
          placement: 'top',
        });
      });
  };

  const handleReview = (): void => {
    navigation.navigate('campaign-details', { id: campaign?.campaign?.id });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={() => {
      handleReview()
    }}>
      <View style={styles.brandBox}>
        <Image
          style={styles.avatar}
          source={{
            uri: 'https://i.pinimg.com/236x/7d/12/be/7d12bed1ada28593e5d76eece02692cb.jpg',
          }}
        />
        <View>
          <Text style={styles.brandName}>{campaign.campaign.brand.name}</Text>
          <Text style={styles.txtTime}>
            {dayjs(campaign.campaign.activatedAt).format(DATE_TIME_FORMAT)}
          </Text>
        </View>
      </View>

      <View style={styles.divider}></View>

      <View style={styles.cardDetail}>
        <View style={styles.blogHeader}>
          <Text style={styles.blogTitle}>{campaign.campaign.name}</Text>

          <View style={styles.priceTag}>
            <Text style={styles.price}>
              {campaign.campaign.discountType === 'percentage'
                ? '$' + campaign.campaign.discount.toFixed(2)
                : campaign.campaign.discount + '%'}
            </Text>
          </View>
        </View>

        {!isJoined && (
          <Text style={styles.desc} numberOfLines={2}>
            {campaign.campaign.campaignOverview}
          </Text>
        )}

        <View style={styles.blogBody}>
          <View style={styles.deadlineBox}>
            <Text style={styles.subTitle}>Deadline</Text>
            <Text style={styles.endDate}>
              {dayjs(campaign.campaign.deadline).format(DATE_FORMAT)}
            </Text>
          </View>

          <View style={styles.socialBox}>
            <Text style={styles.subTitle}>Social Media</Text>
            <View style={styles.social}>
              {campaign?.campaign.socialMedia?.map(social => {
                const IconComponent = getSocialMediaIcon[social];
                return <IconComponent key={social} width={24} height={24} />;
              })}
            </View>
          </View>
        </View>

        {!isJoined && (
          <>
            <View style={styles.blogFooter}>
              <ButtonTab
                label={`Age: ${campaign.campaign?.age?.[0]} - ${campaign.campaign?.age?.[1]} age`}
                active={false}
              />
              <ButtonTab label={campaign.campaign.gender} active={false} />
              <ButtonTab label={campaign.campaign.location} active={false} />
            </View>

            {campaign.status === 'waiting_to_apply' && (
              <View style={styles.actionButton}>
                <View style={styles.divider} />
                <View style={styles.buttons}>
                  <ButtonBase
                    title={'Review'}
                    color={colors.gray[800]}
                    background={'white'}
                    border={colors.gray[200]}
                    onPress={handleReview}
                  />
                  <View style={styles.approve}>
                    <ButtonBase
                      title={'Decline'}
                      color={colors.gray[800]}
                      background={colors.gray[100]}
                      onPress={handleDecline}
                    />
                    <ButtonBase
                      title={'Accept'}
                      color={'white'}
                      background={colors.blue[600]}
                      onPress={handleAccept}
                    />
                  </View>
                </View>
              </View>
            )}
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 16,
    borderColor: colors.gray[200],
  },

  brandBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    columnGap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  brandName: {
    color: colors.gray[800],
    fontWeight: '500',
    ...typography.base,
  },
  txtTime: {
    color: colors.gray[500],
    ...typography.caption,
  },
  divider: {
    backgroundColor: colors.gray[200],
    height: 1,
  },
  cardDetail: {
    padding: 16,
  },
  blogHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  blogTitle: {
    color: colors.gray[800],
    fontWeight: '500',
    ...typography.base,
    maxWidth: 283,
  },
  price: {
    color: colors.blue[700],
    ...typography.body,
  },
  priceTag: {
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: colors.blue[100],
  },

  desc: {
    marginTop: 16,
    color: colors.gray[700],
    ...typography.body,
  },

  blogBody: {
    width: '100%',
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  deadlineBox: {
    width: '50%',
  },
  socialBox: {
    width: '50%',
  },
  subTitle: {
    color: colors.gray[500],
    ...typography.caption,
  },
  endDate: {
    color: colors.gray[800],
    fontWeight: '500',
    ...typography.body,
  },
  social: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 6,
  },

  blogFooter: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8,
  },

  actionButton: {
    marginTop: 16,
  },
  buttons: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  approve: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: 12,
  },
});

export default memo(CampaignCard);
