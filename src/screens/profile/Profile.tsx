import { IcFacebook, IcInstagram } from '@/assets/svg';
import ButtonBase from '@/common/buttons/ButtonBase';
import { profileTabs } from '@/constants/profile.constant';
import colors from '@/themes/colors';
import { typography } from '@/themes/typography';
import { Link, NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ChevronRightIcon, PencilSquareIcon, UserIcon } from 'react-native-heroicons/outline';
import { StarIcon } from 'react-native-heroicons/solid';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

const Profile = (): JSX.Element => {
  const navigation: NavigationProp<ParamListBase> = useNavigation()
  return (
    <View style={styles.root}>
      <LinearGradient style={styles.linearGradient} colors={['#DBEAFE', '#ECFDF5']} />
      <SafeAreaView style={styles.roots}>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <View style={styles.header}>
              <Image style={styles.imgAvatar} source={{ uri: "https://meatworld.com.vn/wp-content/uploads/anh-avatar-anime-8BUm94I.jpg" }} />
              <Text style={styles.name}>Hi, Harna Alisha</Text>
              <TouchableOpacity style={styles.btnEdit} onPress={(): void => navigation.navigate('edit-profile')}>
                <PencilSquareIcon />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.socialMediaContainer}>
              <View style={styles.socialLeft}>
                <StarIcon width={24} height={24} color={colors.yellow[250]} />
                <Text style={styles.txtSocial}>Connect your account</Text>
              </View>
              <View style={styles.socialRight}>
                <IcFacebook width={20} height={20} />
                <IcInstagram width={20} height={20} />
                <ChevronRightIcon width={20} height={20} color={colors.gray[500]} />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.invitation}>
            <View style={styles.dividerTop} />
            <View style={styles.updateProfileGroup}>
              <View style={styles.actionBox}>
                <Text style={styles.txtUpdateProfile}>Update profile</Text>
                <ButtonBase title={'Update'} color={'white'} background={colors.blue[600]} />
              </View>

              <Text style={styles.desc}>Update your profile to attract more brands and collaboration opportunities!</Text>

              <View style={styles.profileCompletion}>
                <Text style={styles.txtProfileCompletion}>Profile Completion</Text>
                <Text style={styles.txtProfileCompletion}>1 of 2</Text>
              </View>
            </View>

          </View>

          <View style={styles.tabList}>
            {
              profileTabs.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.btnTab}
                  onPress={(): void => navigation.navigate(item.link)}>
                  <View style={styles.tab}>
                    <item.icon width={24} height={24} color={colors.gray[700]} />
                    <Text>{item.label}</Text>
                  </View>
                  <ChevronRightIcon width={16} height={16} color={colors.gray[500]} />
                </TouchableOpacity>
              ))
            }
          </View>

          <View style={styles.button}>
            <ButtonBase
              title={'Logout'}
              color={colors.gray[800]}
              background={''}
              border={colors.gray[200]}
              size='md' />
          </View>

        </View>
      </SafeAreaView>
    </View>

  )
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  linearGradient: {
    width: '100%',
    height: 161,
  },
  roots: {
    position: 'absolute',
    top: 0,
    width: "100%",
  },
  container: {
    paddingHorizontal: 16,
  },
  headerContainer: {
    height: 137,
    justifyContent: "center"
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imgAvatar: {
    width: 56,
    height: 56,
    borderRadius: 56 / 2,
    borderWidth: 2,
    borderColor: 'white'
  },
  name: {
    color: colors.gray[900],
    fontWeight: '600',
    ...typography.heading4,
    marginLeft: 12,
  },
  btnEdit: {
    marginLeft: 8,
  },

  socialMediaContainer: {
    position: 'absolute',
    bottom: '-20%',
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'space-between',
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    elevation: 2,
  },
  socialLeft: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
  },
  txtSocial: {
    color: colors.gray[800],
    fontWeight: "500",
    ...typography.body
  },
  socialRight: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 8,
  },

  invitation: {
    marginTop: 47,
  },
  dividerTop: {
    position: 'absolute',
    backgroundColor: colors.blue[600],
    height: 80,
    width: '100%',
    borderRadius: 16,
    top: 16,
  },
  updateProfileGroup: {
    marginTop: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    elevation: 2
  },
  txtUpdateProfile: {
    color: colors.gray[800],
    ...typography.base
  },
  actionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  desc: {
    marginTop: 6,
    color: colors.gray[800],
    ...typography.body
  },
  profileCompletion: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  txtProfileCompletion: {
    color: colors.gray[500],
    ...typography.caption
  },
  tabList: {
    marginTop: 32,
  },
  btnTab: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    paddingVertical: 12,
    borderColor: colors.gray[200]
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 12,
  },

  button: {
    marginTop: 32,
  }
})

export default Profile;
