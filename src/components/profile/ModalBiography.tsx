import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useRef } from 'react'
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import colors from '@/themes/colors'
import { XMarkIcon } from 'react-native-heroicons/outline'
import { SafeAreaView } from 'react-native-safe-area-context'
import { typography } from '@/themes/typography'

const ModalBiography = (): JSX.Element => {
    const bottomSheetModalRef = useRef<BottomSheetModal>(null)

    bottomSheetModalRef.current?.present()

    return (
        <BottomSheetModal
            ref={bottomSheetModalRef}
            snapPoints={['100%', '100%']}
            handleComponent={() => (
                <SafeAreaView style={styles.header}><TouchableOpacity
                    style={styles.buttonBack}>
                    <XMarkIcon color={colors.gray[700]} width={24} height={24} />
                </TouchableOpacity>
                    <Text style={styles.txtHeader}>Bio</Text>
                    <View />
                </SafeAreaView>
            )}>

            <BottomSheetView>
                <View style={{ flex: 1, }}>
                    <Text>aa</Text>
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
        width: 52,
        height: 4,
        marginTop: 8,
        borderRadius: 99,
        backgroundColor: colors.gray[200],
        alignSelf: 'center',
    },
    txtHeader: {
        color: colors.gray[800],
        fontWeight: 500,
        ...typography.body
    },
    buttonBack: {
        backgroundColor: colors.gray[200],
        padding: 4,
        borderRadius: 50,
    },
})

export default ModalBiography