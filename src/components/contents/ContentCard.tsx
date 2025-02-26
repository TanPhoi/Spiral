import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { JSX } from 'react'
import colors from '@/themes/colors'
import { typography } from '@/themes/typography'
import Tag from '@/common/tags/Tag'
import { ContentType } from '@/models/Content.modal'
import dayjs from 'dayjs'
import { DAY_FORMAT } from '@/constants/time.constant'
import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native'
import { getContentStatus } from '@/constants/content.constant'

type ContentCardProps = {
    content: ContentType;
}

const ContentCard = ({ content }: ContentCardProps): JSX.Element => {
    const navigation: NavigationProp<ParamListBase> = useNavigation()

    const handleViewContentDetail = (): void => {
        navigation.navigate(
            content.approved === 'rejected'
                ? 'content-detail-rejected'
                : 'content-detail', { id: content?.id })
    }

    return (
        <TouchableOpacity style={styles.container} onPress={handleViewContentDetail}>
            <View>
                <Image style={styles.image} source={{ uri: content.urls[0] }} />
            </View>

            <View style={styles.contentInfo}>
                <View>
                    <Text style={styles.nameContent}>{content.campaign.name}</Text>
                    <Text style={styles.time}>Submitted: {dayjs(content?.createdAt).format(DAY_FORMAT)}</Text>
                </View>

                <View style={styles.contentStatus}>
                    <View style={styles.contentBrand}>
                        <Image style={styles.imageBrand} source={{ uri: 'https://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://gcs.tripi.vn/public-tripi/tripi-feed/img/474073uGi/hinh-anh-cho-doi-dep-nhat_045114229.png' }} />
                        <Text style={styles.nameBrand}>{content.campaign.brand.name}</Text>
                    </View>

                    <Tag label={content.approved}
                        statusColor={getContentStatus(content.approved)?.statusColor as string}
                        color={getContentStatus(content.approved)?.color as string}
                        background={getContentStatus(content.approved)?.background as string} />
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: "center",
        padding: 8,
        columnGap: 12,
        backgroundColor: 'white',
        borderWidth: 1,
        borderRadius: 16,
        borderColor: colors.gray[200],
        elevation: 2,
    },
    image: {
        width: 90,
        height: 90,
        borderRadius: 12,
    },

    contentInfo: {
        flex: 1,
    },
    nameContent: {
        color: colors.gray[800],
        fontWeight: '600',
        ...typography.base
    },
    time: {
        marginTop: 4,
        color: colors.gray[500],
        fontWeight: '500',
        ...typography.body
    },
    nameBrand: {
        color: colors.gray[800],
        ...typography.caption
    },
    status: {
        fontWeight: '500',
        ...typography.caption
    },

    contentStatus: {
        flex: 1,
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: "center",
        marginTop: 12,
    },
    contentBrand: {
        flexDirection: "row",
        alignItems: 'center',
        columnGap: 10,
    },
    imageBrand: {
        width: 24,
        height: 24,
        borderRadius: 9,
    },
    statusBox: {
        flex: 1,
        flexDirection: 'row',
    },
});

export default ContentCard