import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import colors from '@/themes/colors'
import { XMarkIcon } from 'react-native-heroicons/outline'
import { SafeAreaView } from 'react-native-safe-area-context'
import { typography } from '@/themes/typography'
import InputSearch from '@/common/inputs/InputSearch'
import Checkbox from '@/common/checkboxs/Checkbox'
import Button from '@/common/buttons/Button'
import { KeyboardAvoidingScrollView } from 'react-native-keyboard-avoiding-scroll-view'

const data = [
    'Food & Beverage1',
    'Food & Beverage2',
    'Food & Beverage3',
    'Food & Beverage4',
    'Food & Beverage5',
]

type ModalExpertiseProps = {
    open: boolean
    onClose: () => void
}

const ModalExpertise = ({ open, onClose }: ModalExpertiseProps): JSX.Element => {
    const bottomSheetModalRef = useRef<BottomSheetModal>(null)
    const [isBottomSheetVisible, setIsBottomSheetVisible] = useState<boolean>(open)
    const [loading, setLoading] = useState<boolean>(false)
    const [selectCategories, setSelectCategories] = useState<string[]>([])

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

    const handleToggleCategory = (category: string): void => {
        if (selectCategories.includes(category)) {
            setSelectCategories((prev) => prev.filter((item) => item !== category))
        } else if (selectCategories.length < 3) {
            setSelectCategories((prev) => [...prev, category]);
        }
    }

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
                        <Text style={styles.txtHeader}>Expertise</Text>
                        <View />
                    </View>
                </SafeAreaView>
            )}>

            <BottomSheetView style={styles.container}>
                <View style={styles.body}>
                    <KeyboardAvoidingScrollView>
                        <InputSearch
                            value={''}
                            onChangeText={function (value: string): void {
                                throw new Error('Function not implemented.')
                            }}
                            placeholder={'Search categories'} />

                        <Text style={styles.label}>Category/Niche</Text>
                        <Text style={styles.maximum}>Maximum 3 Category/Niche</Text>
                        <View style={styles.categoryList}>
                            {
                                data
                                    .map((category, index) => (
                                        <View key={index} style={styles.itemCategory}>
                                            <Checkbox
                                                label={category}
                                                isChecked={selectCategories.includes(category)}
                                                onToggle={(): void => handleToggleCategory(category)} />
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
        marginTop: 32,
        color: colors.gray[800],
        ...typography.body,
        fontWeight: '500'
    },
    maximum: {
        color: colors.gray[500],
        ...typography.body,
        fontWeight: '500'
    },
    categoryList: {
        marginTop: 22,
    },
    itemCategory: {
        marginBottom: 28,
    },
})

export default ModalExpertise