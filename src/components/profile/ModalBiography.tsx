import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import colors from '@/themes/colors'
import { XMarkIcon } from 'react-native-heroicons/outline'
import { SafeAreaView } from 'react-native-safe-area-context'
import { typography } from '@/themes/typography'
import Button from '@/common/buttons/Button'
import { KeyboardAvoidingScrollView } from 'react-native-keyboard-avoiding-scroll-view'
import { editProfile } from '@/apis/creator'
import { useAuthContext } from '@/contexts/auth.context'

type ModalBiographyProps = {
    open: boolean
    onClose: () => void
}

const ModalBiography = ({ open, onClose }: ModalBiographyProps): JSX.Element => {
    const { userInfo, handleRefreshUserInfo } = useAuthContext()
    const bottomSheetModalRef = useRef<BottomSheetModal>(null)
    const [isBottomSheetVisible, setIsBottomSheetVisible] = useState<boolean>(open)
    const [bio, setBio] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [maxLength, setMaxLength] = useState<number>(150)

    useEffect(() => {
        if (open && bottomSheetModalRef.current) {
            bottomSheetModalRef.current.present()
        } else if (!open && bottomSheetModalRef.current) {
            bottomSheetModalRef.current.dismiss()
        }
    }, [open])

    const handleSheetChanges = useCallback(
        (index: number) => {
            if (index === -1) {
                setIsBottomSheetVisible(false);
                onClose();
            }
        },
        [onClose]
    );

    const handleToggleModal = (): void => {
        setIsBottomSheetVisible(!isBottomSheetVisible);
        setBio('')
        onClose();
    };

    const handleEditBio = (): void => {
        setLoading(true)
        editProfile(userInfo?.id || '', { biography: bio }).then(() => {
            handleRefreshUserInfo()
            handleToggleModal()
        }).catch((err) => {
            console.log(err);
        }).finally(() => {
            setLoading(false)
        })
    }

    return (
        <BottomSheetModal
            ref={bottomSheetModalRef}
            snapPoints={['100%', '100%']}
            enablePanDownToClose={false}
            enableOverDrag={false}
            onChange={handleSheetChanges}
            handleComponent={() => (
                <SafeAreaView style={styles.header}>
                    <TouchableOpacity onPress={handleToggleModal}>
                        <XMarkIcon color={colors.gray[700]} width={24} height={24} />
                    </TouchableOpacity>
                    <Text style={styles.txtHeader}>Bio</Text>
                    <View />
                </SafeAreaView>
            )}>

            <BottomSheetView style={styles.container}>
                <KeyboardAvoidingScrollView>
                    <View style={styles.body}>
                        <TextInput
                            style={styles.input}
                            multiline
                            value={bio}
                            onChangeText={setBio}
                            textAlignVertical="top"
                            maxLength={maxLength}
                            placeholder='Write something...' />
                        <Text style={styles.numberChar}>{maxLength - bio.length}</Text>
                        <View style={styles.divider} />
                        <Text style={styles.desc}>Brief description for your profile</Text>
                    </View>
                </KeyboardAvoidingScrollView>

                <View style={styles.button}>
                    <Button
                        label={'Done'}
                        disabled={bio.length === 0}
                        loading={loading}
                        onPress={handleEditBio} />
                </View>

            </BottomSheetView>
        </BottomSheetModal>
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 16,
        marginTop: 8,
    },
    divider: {
        width: '100%',
        height: 1,
        marginTop: 12,
        backgroundColor: colors.gray[200],
    },
    txtHeader: {
        color: colors.gray[800],
        fontWeight: '500',
        ...typography.body
    },
    buttonBack: {
        backgroundColor: colors.gray[200],
        padding: 4,
        borderRadius: 50,
    },

    container: {
        paddingBottom: 20,
        flex: 1,
    },
    body: {
        marginTop: 36,
        paddingHorizontal: 16,
    },
    input: {
        // height: 95,
        color: colors.gray[800],
        ...typography.body,
    },
    numberChar: {
        alignSelf: 'flex-end'
    },
    desc: {
        marginTop: 8,
        color: colors.gray[500],
        ...typography.caption,
    },
    button: {
        marginHorizontal: 16,
    }
})

export default ModalBiography