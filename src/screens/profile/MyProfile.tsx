import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import Header from '@/common/headers/Header'
import { SafeAreaView } from 'react-native-safe-area-context'
import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native'
import { PencilSquareIcon, PlusIcon } from 'react-native-heroicons/outline'
import colors from '@/themes/colors'
import { typography } from '@/themes/typography'
import { IcFacebook, IcInstagram, IcTikTok } from '@/assets/svg'
import { Social } from '@/models/Social.model'
import { useAuthContext } from '@/contexts/auth.context'
import ModalBiography from '@/components/profile/ModalBiography'
import ModalExpertise from '@/components/profile/ModalExpertise'
import ModalPortfolio from '@/components/profile/ModalPortfolio'

const socialMediaData = [
    {
        icon: <IcInstagram width={24} height={24} />,
        type: 'instagram',
    },
    {
        icon: <IcFacebook width={24} height={24} />,
        type: 'facebook',
    },
    {
        icon: <IcTikTok width={24} height={24} />,
        type: 'tiktok',
    },
];

const MyProfile = (): JSX.Element => {
    const { userInfo } = useAuthContext()
    const navigation: NavigationProp<ParamListBase> = useNavigation()
    const [selectedSocial, setSelectedSocial] = useState<Social>('');
    const [isModalBio, setIsModalBio] = useState<boolean>(false);
    const [isModalExpertise, setIsModalExpertise] = useState<boolean>(false);
    const [isModalPortfolio, setIsModalPortfolio] = useState<boolean>(false);

    const getBackgroundColor = (type: Social) => {
        if (selectedSocial) {
            switch (type) {
                case 'facebook':
                    return colors.blue[100];
                case 'instagram':
                    return colors.rose[100];
                case 'tiktok':
                    return colors.teal[100];
                default:
                    return colors.gray[100];
            }
        }
        return colors.gray[100];
    };

    return (
        <SafeAreaView style={styles.root}>
            <View style={styles.container}>
                <Header
                    title={'My Profile'}
                    type={'back'}
                    onPress={(): void => navigation.goBack()} />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.profileInfo}>
                        <View style={styles.profileContainer}>
                            <TouchableOpacity>
                                <Image
                                    style={styles.imgAvatar}
                                    source={userInfo?.creator?.avatarUrl
                                        ? { uri: userInfo.creator.avatarUrl }
                                        : require('@/assets/img/avatar.png')} />
                                <View style={styles.iconPlus}>
                                    <PlusIcon width={16} height={16} color={'white'} />
                                </View>
                            </TouchableOpacity>

                            <View>
                                <Text style={styles.name}>{userInfo?.name}</Text>
                                <Text style={styles.email}>{userInfo?.email}</Text>
                            </View>
                        </View>

                        <TouchableOpacity>
                            <PencilSquareIcon />
                        </TouchableOpacity>
                    </View>

                    {/* SOCIAL MEDIA */}
                    <View style={styles.socialContainer}>
                        {
                            socialMediaData.map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[styles.socialMedia, { backgroundColor: selectedSocial === item.type ? getBackgroundColor(selectedSocial) : getBackgroundColor('') }]}
                                    onPress={(): void => setSelectedSocial(selectedSocial === item.type ? '' : item.type as Social)}>
                                    {
                                        item.icon
                                    }
                                </TouchableOpacity>
                            ))
                        }

                        <TouchableOpacity style={styles.addSocialMedia}>
                            <PlusIcon width={24} height={24} color={colors.gray[700]} />
                        </TouchableOpacity>
                    </View>

                    {
                        selectedSocial && (
                            <View style={styles.followContainer}>
                                <View style={[styles.follows, { backgroundColor: getBackgroundColor(selectedSocial) }]}>
                                    <Text style={styles.followNumber}>345k</Text>
                                    <Text style={styles.followLabel}>Followers</Text>
                                </View>
                                <View style={[styles.follows, { backgroundColor: getBackgroundColor(selectedSocial) }]}>
                                    <Text style={styles.followNumber}>125</Text>
                                    <Text style={styles.followLabel}>Post</Text>
                                </View>
                                <View style={[styles.follows, { backgroundColor: getBackgroundColor(selectedSocial) }]}>
                                    <Text style={styles.followNumber}>12k</Text>
                                    <Text style={styles.followLabel}>Likes</Text>
                                </View>
                                <View style={[styles.er, { backgroundColor: getBackgroundColor(selectedSocial) }]}>
                                    <Text style={styles.followNumber}>22,8%</Text>
                                    <Text style={styles.followLabel}>Engagement Rate (ER)</Text>
                                </View>
                            </View>
                        )
                    }

                    {/* ABOUT */}
                    <View style={styles.abouts}>
                        <Text style={styles.txtLabel}>About</Text>

                        <View style={styles.aboutBox}>
                            <View style={styles.aboutContainer}>
                                <View style={styles.aboutInfo}>
                                    <Text style={styles.label}>Biography</Text>
                                    <TouchableOpacity onPress={(): void => setIsModalBio(true)}>
                                        <Text style={styles.addAbout}>{userInfo?.creator?.biography ? 'Edit Biography' : 'Add Biography'}</Text>
                                    </TouchableOpacity>
                                </View>
                                {
                                    userInfo?.creator?.biography && (
                                        <Text style={styles.aboutContent}>{userInfo?.creator?.biography}</Text>
                                    )
                                }
                            </View>

                            <View style={styles.aboutContainer}>
                                <View style={styles.aboutInfo}>
                                    <Text style={styles.label}>Expertise</Text>
                                    <TouchableOpacity onPress={(): void => setIsModalExpertise(true)}>
                                        <Text style={styles.addAbout}>Add Expertise</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.aboutGroup}>
                                    {
                                        userInfo?.creator?.expertises?.map((item, index) => (
                                            <View key={index} style={styles.exContainer}>
                                                <Text style={styles.exLabel}>{item}</Text>
                                            </View>
                                        ))
                                    }

                                </View>
                            </View>

                            <View style={styles.aboutContainer}>
                                <View style={styles.aboutInfo}>
                                    <Text style={styles.label}>Demographics</Text>
                                    <TouchableOpacity>
                                        <Text style={styles.addAbout}>Add Demographics</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.aboutGroup}>
                                    <View style={styles.exContainer}>
                                        <Text style={styles.exLabel}>Age: 20 - 32</Text>
                                    </View>
                                    <View style={styles.exContainer}>
                                        <Text style={styles.exLabel}>Male</Text>
                                    </View>
                                    <View style={styles.exContainer}>
                                        <Text style={styles.exLabel}>France</Text>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.aboutContainer}>
                                <View style={styles.aboutInfo}>
                                    <Text style={styles.label}>Portfolio</Text>
                                    <TouchableOpacity onPress={(): void => setIsModalPortfolio(true)}>
                                        <Text style={styles.addAbout}>Add Portfolio</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>

                {/* Modal Bio */}
                <ModalBiography
                    open={isModalBio}
                    onClose={(): void => setIsModalBio(false)} />

                <ModalExpertise
                    open={isModalExpertise}
                    onClose={(): void => setIsModalExpertise(false)} />

                <ModalPortfolio
                    open={isModalPortfolio}
                    onClose={(): void => setIsModalPortfolio(false)} />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    container: {
        flex: 1,
        marginHorizontal: 16,
    },
    profileInfo: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'space-between',
        marginTop: 20,
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 12
    },
    imgAvatar: {
        width: 80,
        height: 80,
        resizeMode: 'cover',
        borderRadius: 80 / 2,
    },
    iconPlus: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        padding: 4,
        backgroundColor: colors.blue[600],
        borderRadius: 999,
        borderWidth: 2,
        borderColor: 'white'
    },
    name: {
        color: colors.gray[800],
        fontWeight: '600',
        ...typography.base
    },
    email: {
        color: colors.gray[500],
        ...typography.body
    },

    socialContainer: {
        flexDirection: "row",
        alignItems: 'flex-start',
        marginTop: 20,
        columnGap: 12,
    },
    socialMedia: {
        padding: 12,
        backgroundColor: '#FFE4E6',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center'
    },
    addSocialMedia: {
        padding: 12,
        backgroundColor: 'white',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.gray[200]
    },
    followContainer: {
        marginTop: 12,
        flexDirection: 'row',
        width: '100%',
        flexWrap: 'wrap',
        gap: 12,
    },
    follows: {
        width: '31.11%',
        paddingVertical: 16,
        paddingHorizontal: 12,
        backgroundColor: "#FFE4E6",
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: "center",
        rowGap: 4,
    },
    er: {
        width: '100%',
        paddingVertical: 16,
        paddingHorizontal: 12,
        backgroundColor: "#FFE4E6",
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: "center",
        rowGap: 4,
    },
    followNumber: {
        color: colors.gray[800],
        fontWeight: '600',
        ...typography.base
    },
    followLabel: {
        color: colors.gray[500],
        ...typography.caption
    },

    abouts: {
        marginTop: 16,
    },
    txtLabel: {
        color: colors.gray[800],
        fontWeight: '600',
        ...typography.base
    },
    aboutBox: {
        marginTop: 20,
        rowGap: 12,
    },
    aboutContainer: {
        rowGap: 8,
        borderBottomWidth: 1,
        paddingBottom: 12,
        borderColor: colors.gray[200],
    },
    aboutInfo: {
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: 'space-between',
    },
    addAbout: {
        color: colors.blue[600],
        fontWeight: '500',
        ...typography.caption
    },
    label: {
        color: colors.gray[800],
        fontWeight: '500',
        ...typography.body,
    },
    aboutContent: {
        color: colors.gray[800],
        ...typography.body,
    },
    aboutGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flexWrap: 'wrap'
    },
    exContainer: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        backgroundColor: colors.gray[200],
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: "center"
    },
    exLabel: {
        color: colors.gray[700],
        ...typography.body
    },
})

export default MyProfile
