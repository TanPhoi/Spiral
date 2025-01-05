import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ButtonBase from '@/common/buttons/ButtonBase'
import { typography } from '@/themes/typography'
import colors from '@/themes/colors'
import DropShadow from 'react-native-drop-shadow';
import { useAuthContext } from '@/contexts/auth.context'
import { getUserConnectionStatus } from '@/helper/sdk.helper'

const ConnectionStatus = () => {
    const { userInfo } = useAuthContext()
    const [steps, setSteps] = useState<string[]>([])
    const [currentStep, setCurrentStep] = useState<string>('');


    useEffect(() => {
        const incompleteSteps = []
        const hasEmail = userInfo?.email !== ''
        const hasConnectFb = userInfo?.creator?.connectedSocialMedias?.includes('facebook');
        const hasConnectInstagram = userInfo?.creator?.connectedSocialMedias?.includes('instagram');

        if (hasEmail) incompleteSteps.push('email')
        if (hasConnectFb) incompleteSteps.push('facebook')
        if (hasConnectInstagram) incompleteSteps.push('instagram')

        setSteps(incompleteSteps)

        if (!steps.includes('facebook')) {
            setCurrentStep('facebook');
        } else if (!steps.includes('email')) {
            setCurrentStep('email');
        } else {
            setCurrentStep('email');
        }
    }, [userInfo])

    if (steps.length === 0) return <></>

    return (
        <DropShadow style={styles.invitation}>
            <View style={styles.dividerTop} />
            <View style={styles.updateProfileGroup}>
                <View style={styles.actionBox}>
                    <Text style={styles.txtUpdateProfile}>{getUserConnectionStatus(currentStep)?.title}</Text>
                    <ButtonBase title={getUserConnectionStatus(currentStep)?.labelButton || ''} color={'white'} background={colors.blue[600]} />
                </View>

                <Text style={styles.desc}>{getUserConnectionStatus(currentStep)?.desc}</Text>

                <View style={styles.profileCompletion}>
                    <Text style={styles.txtProfileCompletion}>Profile Completion</Text>
                    <Text style={styles.txtProfileCompletion}>{`${steps.length} of 3`}</Text>
                </View>
                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${((steps.length) / 3) * 100}%` }]} />
                </View>
            </View>
        </DropShadow>
    )
}
const styles = StyleSheet.create({
    invitation: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    dividerTop: {
        position: 'absolute',
        backgroundColor: colors.blue[600],
        height: 80,
        width: '100%',
        borderRadius: 16,
        top: 0,
    },
    updateProfileGroup: {
        marginTop: 4,
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
    progressBar: {
        marginTop: 8,
        height: 6,
        backgroundColor: colors.gray[200],
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: colors.blue[600],
    },
})

export default ConnectionStatus
