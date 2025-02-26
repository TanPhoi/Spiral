import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { JSX, useCallback, useEffect, useRef, useState } from 'react';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import colors from '@/themes/colors';
import { XMarkIcon } from 'react-native-heroicons/outline';
import { DatePicker, Picker } from 'react-native-wheel-pick';
import { typography } from '@/themes/typography';
import ButtonBase from '../buttons/ButtonBase';
import Overlay from '../overlay/Overlay';

type ModalCalendarProps = {
    open: boolean;
    value: string;
    onClose: () => void;
    onSave: (date: Date) => void;
};

const ModalCalendar = ({
    open,
    value,
    onClose,
    onSave
}: ModalCalendarProps): JSX.Element => {
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const [isBottomSheetVisible, setIsBottomSheetVisible] =
        useState<boolean>(open);
    const [date, setDate] = useState<Date>(new Date())

    useEffect(() => {
        if (open && bottomSheetModalRef.current) {
            bottomSheetModalRef.current.present();
        } else {
            bottomSheetModalRef.current?.dismiss();
        }
    }, [open]);

    const handleToggleModal = (): void => {
        setIsBottomSheetVisible(!isBottomSheetVisible);
        onClose();
    };

    const handleSheetChanges = useCallback(
        (index: number): void => {
            if (index === -1) {
                setIsBottomSheetVisible(false);
                onClose();
            }
        },
        [onClose],
    );

    const handleSave = (): void => {
        onSave(date)
        handleToggleModal()
    }

    return (
        <BottomSheetModal
            ref={bottomSheetModalRef}
            onChange={handleSheetChanges}
            snapPoints={['47%', '100%']}
            enablePanDownToClose
            enableDynamicSizing={false}
            style={styles.bottomSheetModalContainer}
            containerStyle={{
                backgroundColor: '#00000080',
            }}
            handleComponent={() => (
                <View style={styles.headerContainer}>
                    <View style={styles.dividerTop} />
                    <View style={styles.header}>
                        <View />
                        <Text style={styles.label}>Day of birth</Text>
                        <TouchableOpacity
                            onPress={handleToggleModal}>
                            <XMarkIcon color={colors.gray[700]} width={24} height={24} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.divider} />

                </View>
            )}>
            <BottomSheetView>
                <View>
                    <View style={styles.body}>
                        <DatePicker
                            style={{
                                height: 216,
                                width: '90%',
                                backgroundColor: 'white',
                            }}
                            maximumDate={new Date()}
                            onDateChange={(date: Date): void => setDate(date)}
                            order='D-M-Y'
                            isShowSelectLine={false}
                            selectLineColor='black'
                            selectBackgroundColor='transparent'
                            selectTextColor='black'
                            textSize={23}
                        />
                        <View style={styles.overlay} />
                    </View>

                    <View style={styles.divider} />
                    <View style={styles.button}>
                        <ButtonBase
                            title={'Done'}
                            color={'white'}
                            background={colors.blue[600]}
                            size='md'
                            onPress={handleSave} />
                    </View>
                </View>

            </BottomSheetView>
        </BottomSheetModal>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: 'white',
        borderTopEndRadius: 16,
        borderTopStartRadius: 16,
    },
    dividerTop: {
        width: 52,
        height: 4,
        marginTop: 8,
        borderRadius: 99,
        backgroundColor: colors.gray[200],
        alignSelf: 'center',
    },
    divider: {
        width: '100%',
        height: 1,
        backgroundColor: colors.gray[200],
        alignSelf: 'center',
    },
    header: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    label: {
        color: colors.gray[800],
        fontWeight: '500',
        ...typography.base
    },
    icon: {
        padding: 10,
        borderRadius: 50,
    },

    bottomSheetModalContainer: {
    },
    body: {
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomEndRadius: 16,
        borderBottomStartRadius: 16,
        marginTop: 20,
        marginBottom: 10,
    },
    overlay: {
        width: '90%',
        backgroundColor: 'rgba(118, 118, 128, 0.12)',
        height: 34,
        borderRadius: 8,
        position: 'absolute',
        bottom: 91,
    },
    button: {
        marginTop: 11,
        marginHorizontal: 16,
    },
});

export default ModalCalendar;
