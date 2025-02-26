import { Alert, Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '@/common/headers/Header'
import colors from '@/themes/colors'
import Tag from '@/common/tags/Tag'
import { typography } from '@/themes/typography'
import { KeyboardAvoidingScrollView } from 'react-native-keyboard-avoiding-scroll-view'
import ButtonBase from '@/common/buttons/ButtonBase'
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import { useSharedValue } from 'react-native-reanimated'
import { getContentDetail } from '@/apis/content'
import { NavigationProp, ParamListBase, useNavigation, useRoute } from '@react-navigation/native';
import { ContentType } from '@/models/Content.modal'
import { ContentStatus } from '@/models/Content.modal'
import { getContentStatus } from '@/constants/content.constant'
import dayjs from 'dayjs'
import { DAY_FORMAT } from '@/constants/time.constant'
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';
import ModalAction from '@/common/modals/ModalAction'
import Overlay from '@/common/overlay/Overlay'
import ModalConfirm from '@/common/modals/ModalConfirm'

const width = Dimensions.get("window").width;

const ContentDetail = (): JSX.Element => {
    const navigation: NavigationProp<ParamListBase> = useNavigation()
    const location: any = useRoute();
    const ref = React.useRef<ICarouselInstance>(null);
    const scrollOffsetValue = useSharedValue<number>(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [content, setContent] = useState<ContentType | null>(null)
    const [isModalAction, setIsModalAction] = useState<boolean>(false);
    const [isModalConfirmDelete, setIsModalConfirmDelete] = useState<boolean>(false);
    const [isModalSubmit, setIsModalSubmit] = useState<boolean>(false);

    useEffect(() => {
        getContentDetail(location?.params?.id).then((res) => {
            setContent(res?.data?.data)
        }).catch((err) => {
            console.log(err);
        })
    }, [location?.params?.id])

    return (
        <SafeAreaView style={styles.root}>
            <Overlay isVisible={isModalAction || isModalConfirmDelete || isModalSubmit} />
            <View style={styles.container}>
                <KeyboardAvoidingScrollView showsVerticalScrollIndicator={false}>

                    <View style={styles.header}>
                        <Header
                            title={'Content details'}
                            type={'back'}
                            isSetting
                            onSetting={() => {
                                setIsModalAction(true)
                            }}
                            onPress={(): void => navigation.goBack()} />
                    </View>
                    <View style={styles.divider} />

                    <View style={styles.body}>
                        <View style={styles.contentInfo}>
                            <Text style={styles.nameCampaign}>{content?.campaign?.name}</Text>
                            <Tag
                                label={content?.approved as string}
                                statusColor={''}
                                color={getContentStatus(content?.approved as ContentStatus)?.color as string}
                                background={getContentStatus(content?.approved as ContentStatus)?.background as string} />
                        </View>
                        <Text style={styles.time}>Saved as draft: {dayjs(content?.createdAt).format(DAY_FORMAT)}</Text>

                        <View style={styles.carouselWrapper}>
                            <Carousel
                                loop
                                ref={ref}
                                width={width}
                                height={width}
                                enabled={content?.urls.length as number > 1}
                                snapEnabled={true}
                                autoPlayInterval={2000}
                                scrollAnimationDuration={1000}
                                defaultScrollOffsetValue={scrollOffsetValue}
                                data={content?.urls as string[]}
                                onSnapToItem={(index: number) => setCurrentIndex(index)}
                                renderItem={({ item, index }) => {
                                    return (
                                        <Image resizeMode='cover' style={styles.contentPreview} source={{ uri: item }} />
                                    )
                                }}
                            />
                            <View style={styles.dots}>
                                {
                                    content?.urls.length as number > 1 && content?.urls.map((_, index) => (
                                        <View key={index} style={[styles.dot, index === currentIndex ? styles.active : styles.unActive]} />
                                    ))
                                }
                            </View>
                        </View>

                        <View style={styles.captionGroup}>
                            <Text>{content?.caption}</Text>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.nodeGroup}>
                            <Text style={styles.label}>Note</Text>
                            <Text style={styles.contentNode}>{content?.notes}</Text>
                            <View style={styles.divider} />
                        </View>

                        <View style={styles.brandGroup}>
                            <Text style={styles.label}>Brand</Text>

                            <View style={styles.brandInfo}>
                                <View style={styles.brandInfo}>
                                    <Image style={styles.imageBrand} source={{ uri: 'https://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://gcs.tripi.vn/public-tripi/tripi-feed/img/474073uGi/hinh-anh-cho-doi-dep-nhat_045114229.png' }} />
                                    <Text style={styles.nameBrand}>{content?.campaign?.brand?.name}</Text>
                                </View>
                            </View>
                        </View>

                    </View>
                </KeyboardAvoidingScrollView>

                {
                    content?.approved === 'draft' && (
                        <View>
                            <View style={styles.divider} />
                            <View style={styles.button}>
                                <ButtonBase
                                    title={'Submit Content'}
                                    color={'white'}
                                    background={colors.blue[600]}
                                    size='md'
                                    onPress={() => setIsModalSubmit(true)} />
                            </View>
                        </View>
                    )
                }
            </View>

            <ModalAction
                open={isModalAction}
                onClose={() => setIsModalAction(false)}
                labelConfirm={'Edit content'}
                labelCancel={'Delete'}
                onEdit={function (): void {
                    throw new Error('Function not implemented.')
                }}
                onDelete={() => setIsModalConfirmDelete(true)} />

            <ModalConfirm
                open={isModalConfirmDelete}
                onClose={() => setIsModalConfirmDelete(false)}
                type={'decline'}
                label={'Delete content'}
                labelConfirm={'Yes'}
                labelCancel={'No'}
                desc={'Are you sure you want to delete this content?'}
                onConfirm={function (): void {
                    throw new Error('Function not implemented.')
                }}
                onCancel={() => setIsModalConfirmDelete(false)} />

            <ModalConfirm
                open={isModalSubmit}
                onClose={() => setIsModalSubmit(false)}
                type={'apply'}
                label={'Submit Content'}
                labelConfirm={'Confirm'}
                labelCancel={'Cancel'}
                desc={'Are you sure you want to submit this content? Please confirm your agreement before proceeding'}
                onConfirm={function (): void {
                    throw new Error('Function not implemented.')
                }}
                onCancel={() => setIsModalSubmit(false)} />
        </SafeAreaView >
    )
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "white"
    },
    container: {
        flex: 1,
    },
    header: {
        marginTop: 10,
        marginHorizontal: 16
    },
    divider: {
        backgroundColor: colors.gray[200],
        height: 1,
    },

    body: {
        marginTop: 16,
        paddingBottom: 10,
    },
    contentInfo: {
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: 'space-between',
        marginHorizontal: 16,
    },
    nameCampaign: {
        color: colors.gray[800],
        fontWeight: "500",
        ...typography.body
    },
    time: {
        marginTop: 4,
        marginHorizontal: 16,
        color: colors.gray[500],
        fontWeight: "500",
        ...typography.caption
    },
    carouselWrapper: {
        position: 'relative',
        marginTop: 12,
    },
    contentPreview: {
        flex: 1,
        width: '100%',
        height: '100%'
    },
    dots: {
        zIndex: 1,
        position: "absolute",
        bottom: 10,
        alignSelf: "center",
        flexDirection: 'row',
        justifyContent: "center",
        columnGap: 6,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 8 / 2,
    },
    unActive: {
        borderWidth: 1,
        borderColor: 'white',
    },
    active: {
        backgroundColor: "white"
    },
    captionGroup: {
        marginTop: 16,
        marginHorizontal: 16,
        marginBottom: 12,
    },
    nodeGroup: {
        marginTop: 12,
        rowGap: 8,
        marginHorizontal: 16,
    },
    label: {
        color: colors.gray[800],
        fontWeight: "500",
        ...typography.body
    },
    contentNode: {
        marginBottom: 4,
        color: colors.gray[800],
        ...typography.body
    },
    brandGroup: {
        marginTop: 12,
        marginHorizontal: 16,
    },
    brandInfo: {
        flexDirection: "row",
        alignItems: 'center',
        marginTop: 8,
        columnGap: 10,
    },
    imageBrand: {
        width: 24,
        height: 24,
        borderRadius: 9,
    },
    nameBrand: {
        color: colors.gray[800],
        ...typography.body
    },
    button: {
        marginHorizontal: 16,
        paddingVertical: 10,
    },
})

export default ContentDetail
