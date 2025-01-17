import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { ReactElement } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AdjustmentsHorizontalIcon, BellIcon, MagnifyingGlassIcon } from 'react-native-heroicons/outline'
import { typography } from '@/themes/typography'
import colors from '@/themes/colors'
import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native'

type LayoutProps = {
    title: string,
    children: ReactElement
}

const Layout = ({ title, children }: LayoutProps): JSX.Element => {
    const navigation: NavigationProp<ParamListBase> = useNavigation();

    return (
        <SafeAreaView style={styles.container} >
            <View style={styles.headerWordSpace}>
                <Text style={styles.txtWorkSpace}>Workspace</Text>
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
                        <TouchableOpacity onPress={() => navigation.navigate('notification')} style={styles.headingAction}>
                            <View style={styles.alert}></View>
                            <BellIcon color={colors.gray[700]} width={24} height={24} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Screen Content */}
            <View style={styles.content}>
                {children}
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
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
    headingAction: {
        flexDirection: 'row',
        gap: 12,
        paddingRight: 3,
    },
    alert: {
        position: 'absolute',
        right: -2,
        top: 0,
        width: 6,
        height: 6,
        backgroundColor: colors.rose[500],
        borderRadius: 3,
    },
    heading: {
        ...typography.heading2,
        color: colors.gray[800],
        fontWeight: '600',
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    bell: {
        position: 'relative',
    },
    content: {
        width: '100%',
        flex: 1,
    },
})

export default Layout
