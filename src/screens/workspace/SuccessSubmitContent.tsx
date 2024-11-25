import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { JSX } from 'react'
import LinearGradient from 'react-native-linear-gradient';
import { HomeIcon } from 'react-native-heroicons/outline';
import colors from '@/themes/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { typography } from '@/themes/typography';
import ButtonBase from '@/common/buttons/ButtonBase';
import { SuccessSubmitIcon } from '@/assets/svg';
import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';

const SuccessSubmitContent = (): JSX.Element => {
    const navigation: NavigationProp<ParamListBase> = useNavigation()

    const handleBackHome = (): void => {
        navigation.navigate('Home', { screen: 'Home' })
    }

    return (
        <LinearGradient colors={['#DBEAFE', '#ECFDF5']}
            style={styles.root}
            start={{ x: 0.0, y: 0.0 }}
            end={{ x: 1.0, y: 1.0 }}>
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <View></View>
                    <TouchableOpacity onPress={handleBackHome}>
                        <HomeIcon color={colors.gray[700]} width={24} height={24} />
                    </TouchableOpacity>
                </View>

                <View style={styles.body}>
                    <SuccessSubmitIcon />
                    <View>
                        <Text style={styles.successMessage}>
                            Your content has been successfully submitted
                        </Text>
                        <Text style={styles.thankYouMessage}>
                            Thank you for sharing your ideas with us! If you need to make any
                            changes or have questions, feel free to reach out.
                        </Text>
                    </View>

                    <ButtonBase
                        title={'Back to Home'}
                        background={''}
                        color={colors.gray[800]}
                        border={colors.gray[200]}
                        onPress={handleBackHome}
                    />
                </View>
            </SafeAreaView>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
        paddingHorizontal: 16
    },
    body: {
        marginTop: 32,
        alignItems: 'center',
        backgroundColor: 'white',
        marginHorizontal: 12,
        alignSelf: 'center',
        display: 'flex',
        justifyContent: 'center',
        paddingVertical: 30,
        paddingHorizontal: 20,
        borderRadius: 16,
        rowGap: 40,
        elevation: 2,
    },
    successMessage: {
        color: colors.gray[900],
        textAlign: 'center',
        fontWeight: '700',
        ...typography.heading4,
    },
    thankYouMessage: {
        marginTop: 8,
        color: colors.gray[700],
        textAlign: 'center',
        fontWeight: '500',
        ...typography.body,
    },
})

export default SuccessSubmitContent;
