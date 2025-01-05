import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
// @ts-ignore
import BalanceBg from '@/assets/img/bg.png';
// @ts-ignore
import CardHolder from '@/assets/img/card-holder.png';
import { ArrowDownRightIcon } from 'react-native-heroicons/outline';
import { typography } from '@/themes/typography';
import colors from '@/themes/colors';

const Balance = () => {
    return (
        <ImageBackground style={styles.balanceBg} source={BalanceBg}>
            <View style={{ width: '100%' }}>
                <ImageBackground style={styles.image} source={CardHolder}>
                    <View style={styles.imgContainer}>
                        <Text style={styles.availableBalance}>Available Balance</Text>
                        <Text style={styles.totalToken}>$100</Text>
                        <Text style={styles.tokens}>= 2000 Tokens</Text>
                        <TouchableOpacity style={styles.button}>
                            <ArrowDownRightIcon width={20} height={20} color={colors.gray[800]} />
                            <Text style={styles.request}>Request Withdraw</Text>
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
            </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    balanceBg: {
        height: 246,
        alignItems: 'center',
        justifyContent: 'center'
    },
    image: {
        height: 206,
        width: '100%'
    },
    imgContainer: {
        paddingHorizontal: 32,
        paddingTop: 33,
        paddingBottom: 20
    },
    availableBalance: {
        ...typography.body,
        color: colors.gray[800],
        fontWeight: '400'
    },
    totalToken: {
        ...typography.heading1,
        fontWeight: '700',
        marginTop: 6
    },
    tokens: {
        ...typography.body,
        fontWeight: '400',
        color: colors.gray[800]
    },
    request: {
        ...typography.body,
        fontWeight: '600',
        color: colors.gray[800],
        marginLeft: 8
    },
    button: {
        height: 44,
        backgroundColor: '#DEDFF3',
        marginTop: 20,
        width: '100%',
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
})

export default Balance