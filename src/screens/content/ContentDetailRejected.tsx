import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ChevronDownIcon, ChevronLeftIcon, ExclamationCircleIcon, Squares2X2Icon } from 'react-native-heroicons/outline'
import colors from '@/themes/colors'
import { typography } from '@/themes/typography'
import Tag from '@/common/tags/Tag'
import { getContentStatus } from '@/constants/content.constant'
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel'
import { ContentType } from '@/models/Content.modal'
import { getContentDetail } from '@/apis/content'
import { NavigationProp, ParamListBase, useNavigation, useRoute } from '@react-navigation/native'
import { useSharedValue } from 'react-native-reanimated'
import ButtonBase from '@/common/buttons/ButtonBase'
import { KeyboardAvoidingScrollView } from 'react-native-keyboard-avoiding-scroll-view'

const width = Dimensions.get("window").width;

const ContentDetailRejected = (): JSX.Element => {
    const navigation: NavigationProp<ParamListBase> = useNavigation()
    const location: any = useRoute();
    const ref = React.useRef<ICarouselInstance>(null);
    const scrollOffsetValue = useSharedValue<number>(0);
    const [content, setContent] = useState<ContentType | null>(null)
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        getContentDetail(location?.params?.id).then((res) => {
            setContent(res?.data?.data)
        }).catch((err) => {
            console.log(err);
        })
    }, [location?.params?.id])
    return (
        <SafeAreaView style={styles.root}>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <ChevronLeftIcon width={24} height={24} color={colors.gray[700]} />
                    </TouchableOpacity>
                    <View style={styles.header}>
                        <Image style={styles.imgBrand} source={{ uri: 'https://i.pinimg.com/236x/11/bd/20/11bd20f533facc49503bceecf71f545e.jpg' }} />
                        <View>
                            <Text style={styles.name}>Campaign name 001</Text>
                            <View style={styles.dateContainer}>
                                <Text style={styles.date}>Submitted: Sep 9, 2024</Text>
                                <ChevronDownIcon width={12} height={12} color={colors.gray[700]} />
                            </View>
                        </View>
                    </View>
                </View>
                <KeyboardAvoidingScrollView showsVerticalScrollIndicator={false}>

                    <View>
                        {/* Reason */}
                        <View style={styles.reasonContainer}>
                            <ExclamationCircleIcon width={24} height={24} color={colors.red[500]} />
                            <View style={styles.viewReason}>
                                <Text style={styles.txtReason}>Please resubmit 1 change requested</Text>
                                <TouchableOpacity style={styles.btnReason}>
                                    <Text style={styles.txtButtonReason}>View reason</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Status */}
                        <View style={styles.statusContainer}>
                            <View style={styles.viewStatus}>
                                <Squares2X2Icon width={20} height={20} />
                                <Text style={styles.txtStatus}>Post</Text>
                            </View>

                            <Tag
                                label={'Reject'}
                                statusColor={''}
                                color={getContentStatus('rejected')?.color as string}
                                background={getContentStatus('rejected')?.background as string} />
                        </View>

                        {/* Image */}
                        <View style={styles.carouselWrapper}>
                            <Carousel
                                loop
                                ref={ref}
                                width={width}
                                enabled={content?.urls.length as number > 1}
                                snapEnabled={true}
                                autoPlayInterval={2000}
                                scrollAnimationDuration={1000}
                                defaultScrollOffsetValue={scrollOffsetValue}
                                data={content?.urls as string[]}
                                onSnapToItem={(index: number) => setCurrentIndex(index)}
                                renderItem={({ item, index }) => {
                                    return (
                                        <Image
                                            style={styles.contentPreview} source={{ uri: item }} />
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
                    </View>
                </KeyboardAvoidingScrollView>
                {
                    content?.approved === 'rejected' && (
                        <View>
                            <View style={styles.divider} />
                            <View style={styles.button}>
                                <ButtonBase
                                    title={'Resubmit'}
                                    color={'white'}
                                    background={colors.blue[600]}
                                    size='md'
                                    onPress={(): void => navigation.navigate('edit-content-reject', { id: content.id })}
                                />
                            </View>
                        </View>
                    )
                }
            </View>
        </SafeAreaView >
    )
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: 'white',
    },
    container: {
        flex: 1,
    },
    divider: {
        backgroundColor: colors.gray[200],
        height: 1,
    },
    headerContainer: {
        marginTop: 16,
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 12,
        paddingHorizontal: 16,
    },
    header: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 8,
        backgroundColor: colors.gray[100],
        paddingHorizontal: 2,
        paddingVertical: 6,
        borderRadius: 8,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 4,
    },
    imgBrand: {
        width: 32,
        height: 32,
        borderRadius: 8,
        resizeMode: 'cover'
    },
    name: {
        color: colors.gray[800],
        fontWeight: '500',
        ...typography.body
    },
    date: {
        color: colors.gray[500],
        fontWeight: '500',
        ...typography.caption,
    },

    reasonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
        columnGap: 12,
        padding: 16,
        backgroundColor: colors.red[50]
    },
    viewReason: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    txtReason: {
        color: colors.gray[800],
        ...typography.caption,
    },
    btnReason: {
        borderWidth: 1,
        borderColor: colors.gray[200],
        backgroundColor: 'white',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 12
    },
    txtButtonReason: {
        color: colors.gray[800],
        fontWeight: '600',
        ...typography.body,
    },

    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: 16,
    },
    viewStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
        paddingHorizontal: 8,
        columnGap: 4,
        backgroundColor: colors.gray[200],
        borderRadius: 8
    },
    txtStatus: {
        color: colors.gray[700],
        ...typography.body,
    },

    carouselWrapper: {
        position: 'relative',
        width: '100%',
        height: 428,
    },
    contentPreview: {
        resizeMode: 'stretch',
        width: '100%',
        height: 428,
    },
    dots: {
        position: "absolute",
        alignSelf: "center",
        flexDirection: 'row',
        justifyContent: "center",
        columnGap: 6,
        bottom: 10,
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

    button: {
        marginHorizontal: 16,
        paddingVertical: 10,
    },
})

export default ContentDetailRejected
