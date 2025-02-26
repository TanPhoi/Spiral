import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useRef, useState } from 'react'
import QuillEditor from 'react-native-cn-quill';
import { Influencer } from '@/models/Campaign.model';
import { typography } from '@/themes/typography';
import colors from '@/themes/colors';
import { getSocialMediaIcon } from '@/helper/campaign.helper';
import dayjs from 'dayjs';
import { TicketIcon } from 'react-native-heroicons/outline';
import { DATE_FORMAT } from '@/constants/time.constant';
import ButtonBase from '@/common/buttons/ButtonBase';
import ModalConfirm from '@/common/modals/ModalConfirm';
import { responseInvitationOfBrand } from '@/apis/campaign';
import { useToast } from 'react-native-toast-notifications';
import Overlay from '@/common/overlay/Overlay';
import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/common/headers/Header';

type OverviewProps = {
    campaign: Influencer | null,
    campaignId: string,
    onRefresh: () => Promise<void>
}

const Overview = ({ campaign, campaignId, onRefresh }: OverviewProps): JSX.Element => {
    const toast = useToast();
    const navigation: NavigationProp<ParamListBase> = useNavigation();

    const _editor = useRef<QuillEditor | null>(null);
    const [modalType, setModalType] = useState<'' | 'decline' | 'apply'>('');

    const handleApply = (): void => {
        responseInvitationOfBrand(campaignId, true)
            .then(() => {
                onRefresh()
                toast.show('Accepted the invitation!', {
                    type: 'success',
                    placement: 'top',
                });
                setModalType('');
            })
            .catch(err => {
                console.log(err);
                toast.show(err.message, { type: 'danger', placement: 'top' });
            });
    };


    const handleDecline = (): void => {
        responseInvitationOfBrand(campaignId, false)
            .then(() => {
                onRefresh()
                toast.show('Accepted the invitation!', {
                    type: 'success',
                    placement: 'top',
                });
                setModalType('');
            })
            .catch(err => {
                console.log(err);
                toast.show(err.message, { type: 'danger', placement: 'top' });
            });
    };

    return (
        <View style={styles.root}>
            <View>
                {campaign?.status === 'waiting_to_apply' && (
                    <View style={styles.invitation}>
                        <View style={styles.dividerTop} />
                        <View style={styles.buttonAction}>
                            <Text style={styles.content}>
                                We are exited to partner with you for our upcoming {'\n'}
                                campaign featuring you.
                            </Text>
                            <View style={styles.buttonActionLeft}>
                                <ButtonBase
                                    title={'Decline'}
                                    color={colors.gray[800]}
                                    background={'white'}
                                    border={colors.gray[200]}
                                    onPress={(): void => setModalType('decline')}
                                />

                                <ButtonBase
                                    title={'Apply'}
                                    color={'white'}
                                    background={colors.blue[600]}
                                    border={colors.blue[600]}
                                    onPress={(): void => setModalType('apply')}
                                />
                            </View>
                        </View>
                    </View>
                )}

                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.body}>
                        <Text style={styles.campaignTitle}>Campaign Title</Text>

                        <View>
                            <Text style={styles.txtSocialMedia}>Social Media</Text>
                            <View style={styles.socialMedia}>
                                {campaign?.campaign.socialMedia.map(social => {
                                    const IconComponent = getSocialMediaIcon[social];
                                    return <IconComponent key={social} width={24} height={24} />;
                                })}
                            </View>
                        </View>

                        <View style={styles.campaignInfo}>
                            <View>
                                <Text style={styles.label}>Campaign Deadline</Text>
                                <View style={styles.deadline}>
                                    <Text style={styles.txtDeadline}>End date</Text>
                                    <Text style={styles.txtTime}>
                                        {dayjs(campaign?.campaign.deadline).format(DATE_FORMAT)}
                                    </Text>
                                </View>
                            </View>

                            <View>
                                <Text style={styles.label}>Discount</Text>
                                <View style={styles.discountBox}>
                                    <TicketIcon color={colors.rose[500]} width={24} height={24} />
                                    <Text style={styles.txtDiscount}>
                                        {campaign?.campaign.discountType === 'fixed'
                                            ? `$${campaign?.campaign.discount.toFixed(2)}`
                                            : `${campaign?.campaign.discount}%`}{' '}
                                        Discount
                                    </Text>
                                </View>
                            </View>

                            <View>
                                <Text style={styles.label}>Campaign earnings</Text>
                                <View style={styles.backgroundBox}>
                                    <Text style={styles.txtContent}>
                                        ${campaign?.campaign.budget.toFixed(2)}
                                    </Text>
                                </View>
                                <Text style={styles.commissionFee}>commission fee</Text>
                            </View>

                            <View>
                                <Text style={styles.label}>Campaign demographic</Text>
                                <View style={styles.campaignDemographic}>
                                    <View style={styles.backgroundBox}>
                                        <Text style={styles.txtContent}>
                                            Age: {campaign?.campaign?.age?.[0]} -{' '}
                                            {campaign?.campaign?.age?.[1]}
                                        </Text>
                                    </View>
                                    <View style={styles.backgroundBox}>
                                        <Text style={styles.txtContent}>
                                            {campaign?.campaign.gender}
                                        </Text>
                                    </View>
                                    <View style={styles.backgroundBox}>
                                        <Text style={styles.txtContent}>
                                            {campaign?.campaign.location}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={styles.footer}>
                        <Text>Campaign Overview</Text>
                        <QuillEditor
                            key={campaignId || campaign?.campaign.id}
                            ref={_editor}
                            initialHtml={campaign?.campaign.campaignOverview}
                        />
                    </View>
                </ScrollView>

                <ModalConfirm
                    open={modalType === 'apply'}
                    onClose={() => setModalType('')}
                    type={'apply'}
                    label={'Apply'}
                    onConfirm={handleApply}
                    desc={'Are you sure you want to accept this campaign?'}
                    labelConfirm={'Apply'}
                    labelCancel={'Cancel'}
                    onCancel={() => setModalType('')} />

                <ModalConfirm
                    open={modalType === 'decline'}
                    onClose={() => setModalType('')}
                    type={'decline'}
                    label={'Decline'}
                    onConfirm={handleDecline}
                    desc={'Are you sure you want to decline this campaign?'}
                    labelConfirm={'Decline'}
                    labelCancel={'Cancel'}
                    onCancel={() => setModalType('')}
                />

            </View>

            {campaign?.status === 'joined_campaign' && (
                <View style={styles.buttonCreate}>
                    <ButtonBase
                        title={'Create Content'}
                        color={'white'}
                        background={colors.blue[600]}
                        size="md"
                        onPress={(): void =>
                            navigation.navigate('create-content', { id: campaignId })
                        }
                    />
                </View>
            )}
        </View>

    )
}

export default Overview

const styles = StyleSheet.create({
    root: {
        flex: 1
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
    },

    invitation: {
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
    buttonCreate: {
        position: 'absolute',
        bottom: 10,
        right: 16,
        left: 16,
    },
})