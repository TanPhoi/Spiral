import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import colors from '@/themes/colors'
import { LinkIcon, XMarkIcon } from 'react-native-heroicons/outline'
import { SafeAreaView } from 'react-native-safe-area-context'
import { typography } from '@/themes/typography'
import InputSearch from '@/common/inputs/InputSearch'
import Checkbox from '@/common/checkboxs/Checkbox'
import Button from '@/common/buttons/Button'
import { KeyboardAvoidingScrollView } from 'react-native-keyboard-avoiding-scroll-view'

type ModalPortfolioProps = {
    open: boolean
    onClose: () => void
}

const ModalPortfolio = ({ open, onClose }: ModalPortfolioProps): JSX.Element => {
    const bottomSheetModalRef = useRef<BottomSheetModal>(null)
    const [isBottomSheetVisible, setIsBottomSheetVisible] = useState<boolean>(open)
    const [loading, setLoading] = useState<boolean>(false)

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
        onClose();
    };

    return (
        <BottomSheetModal
            ref={bottomSheetModalRef}
            snapPoints={['100%', '100%']}
            enablePanDownToClose={false}
            enableOverDrag={false}
            onChange={handleSheetChanges}
            handleComponent={() => (
                <SafeAreaView>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={handleToggleModal}>
                            <XMarkIcon color={colors.gray[700]} width={24} height={24} />
                        </TouchableOpacity>
                        <Text style={styles.txtHeader}>Portfolio</Text>
                        <View />
                    </View>
                </SafeAreaView>
            )}>

            <BottomSheetView style={styles.container}>
                <View style={styles.body}>
                    <KeyboardAvoidingScrollView>

                        <Text style={styles.label}>Link social post</Text>

                        <View style={styles.linkList}>
                            {
                                Array.from({ length: 3 }).map((item, index) => (
                                    <View key={index} style={styles.input}>
                                        <LinkIcon color={colors.gray[500]} width={20} height={20} />
                                        <TextInput placeholder='Paste Link' style={styles.txtPasteLink} />
                                    </View>
                                ))
                            }
                        </View>

                    </KeyboardAvoidingScrollView>

                    <Button
                        label={'Done'}
                        disabled={false}
                        onPress={function (): void {
                            throw new Error('Function not implemented.')
                        }} />
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
        marginTop: 32,
        paddingHorizontal: 16,
        flex: 1,
    },
    label: {
        color: colors.gray[800],
        fontWeight: '500',
        ...typography.body,
    },
    linkList: {
        marginTop: 8,
        rowGap: 16,
    },
    txtPasteLink: {
        fontWeight: '500',
        ...typography.body,
        flex: 1,
    },
    input: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.gray[100],
        borderRadius: 8,
        paddingHorizontal: 16,
        columnGap: 16,
    },
})

export default ModalPortfolio