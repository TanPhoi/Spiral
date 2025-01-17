import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AdjustmentsHorizontalIcon, BellIcon, MagnifyingGlassIcon } from 'react-native-heroicons/outline'
import colors from '@/themes/colors'
import { typography } from '@/themes/typography'
import ButtonTab from '@/common/buttons/ButtonTab'
import ContentCard from '@/components/contents/ContentCard'
import { getContents } from '@/apis/content'
import { useAuthContext } from '@/contexts/auth.context'
import type { ContentType } from '@/models/Content.modal'
import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native'
import { FlatList, GestureHandlerRootView, PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler'
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated'
import Button from '@/common/buttons/Button'

const screenWidth = Dimensions.get('window').width;

const Content = (): JSX.Element => {
    const { userInfo } = useAuthContext();
    const navigation: NavigationProp<ParamListBase> = useNavigation()
    const [activeTab, setActiveTab] = useState<'draft' | 'posted' | 'submitted'>('submitted')
    const [params, setParams] = useState<{ limit: number, param: number }>({ limit: 100, param: 1 })
    const [contents, setContents] = useState<ContentType[]>([])
    const [isLocked, setIsLocked] = useState(false);

    useEffect(() => {
        handleGetContents()
        const unsubscribe = navigation.addListener('focus', async () => {
            handleGetContents()
        });

        return unsubscribe;
    }, [activeTab])

    const handleGetContents = (): void => {
        getContents(userInfo?.id || '', activeTab, params.param, params.limit,).then((res) => {
            setContents(res.data.data);
        }).catch((err) => {
            console.log(err);
        })
    }

    const swipeGesture = Gesture.Pan()
        .onUpdate((event) => {
            "worklet";

            if (!isLocked) {
                if (event.translationX <= -screenWidth / 2) {

                    switch (activeTab) {
                        case 'submitted':
                            runOnJS(setActiveTab)('draft');
                            runOnJS(setIsLocked)(true);
                            break;
                        case 'draft':
                            runOnJS(setActiveTab)('posted');
                            runOnJS(setIsLocked)(true);
                            break;
                        default:
                            break;
                    }
                } else if (event.translationX >= screenWidth / 2) {
                    // Vuốt sang phải
                    switch (activeTab) {
                        case 'posted':
                            runOnJS(setActiveTab)('draft');
                            runOnJS(setIsLocked)(true);
                            break;
                        case 'draft':
                            runOnJS(setActiveTab)('submitted');
                            runOnJS(setIsLocked)(true);
                            break;
                        default:
                            break;
                    }
                }
            }
        })
        .onEnd(() => {
            "worklet";
            runOnJS(setIsLocked)(false);
        });

    return (
        <GestureHandlerRootView style={{ zIndex: 1, backgroundColor: "red", width: '100%', height: '100%' }}>
            <GestureDetector gesture={swipeGesture}>
                <SafeAreaView style={styles.root}>
                    <View style={styles.container}>
                        <View style={styles.headerWordSpace}>
                            <Text style={styles.txtWorkSpace}>Content</Text>
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
                        </View>

                        <View style={styles.tabs}>
                            <ButtonTab label={'Submitted'} active={activeTab === 'submitted'} onPress={(): void => setActiveTab('submitted')} />
                            <ButtonTab label={'Draft'} active={activeTab === 'draft'} onPress={(): void => setActiveTab('draft')} />
                            <ButtonTab label={'Posted'} active={activeTab === 'posted'} onPress={(): void => setActiveTab('posted')} />
                        </View>

                        <View style={styles.contents}>
                            <FlatList
                                data={contents}
                                renderItem={({ item }) => (
                                    <View style={styles.contentCard}>
                                        <ContentCard content={item} />
                                    </View>
                                )}
                                showsVerticalScrollIndicator={false}
                            />
                        </View>
                    </View>
                </SafeAreaView >
            </GestureDetector>
        </GestureHandlerRootView>

    )
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: 'white'
    },
    container: {
        flex: 1,
        backgroundColor: colors.gray[100]
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
        flexDirection: 'row',
        columnGap: 12,
        padding: 16,
        backgroundColor: "white",
        borderBottomWidth: 1,
        borderColor: colors.gray[200]
    },

    contents: {
        flex: 1,
        marginHorizontal: 12,
        marginTop: 16,
    },
    flatListWrapper: {
        flex: 1,
    },
    contentCard: {
        marginBottom: 16,
    },
})

export default Content;
