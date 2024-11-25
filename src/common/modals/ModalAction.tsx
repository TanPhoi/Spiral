import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { JSX, useCallback, useEffect, useRef, useState } from 'react';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import colors from '@/themes/colors';
import { XMarkIcon } from 'react-native-heroicons/outline';
import { typography } from '@/themes/typography';
import ButtonBase from '../buttons/ButtonBase';

type ModalActionProps = {
    open: boolean;
    onClose: () => void;
    labelConfirm: string;
    labelCancel: string;
    onEdit: () => void;
    onDelete: () => void;
};

const ModalAction = ({
    open,
    onClose,
    labelCancel,
    labelConfirm,
    onDelete,
    onEdit
}: ModalActionProps): JSX.Element => {
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const [isBottomSheetVisible, setIsBottomSheetVisible] =
        useState<boolean>(open);
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

    const handleCancel = (): void => {
        onDelete()
        handleToggleModal();
    };

    const handleSubmit = () => {
        onEdit();
        handleToggleModal();
    };

    return (
        <BottomSheetModal
            ref={bottomSheetModalRef}
            onChange={handleSheetChanges}
            snapPoints={['22%', '100%']}
            enablePanDownToClose
            enableDynamicSizing={false}
            style={styles.bottomSheetModalContainer}
            handleComponent={() => (
                <View style={styles.header}>
                    <View style={styles.divider} />
                    <TouchableOpacity
                        style={styles.buttonBack}
                        onPress={handleToggleModal}>
                        <XMarkIcon color={colors.gray[700]} width={24} height={24} />
                    </TouchableOpacity>
                </View>
            )}>
            <BottomSheetView>
                <View style={styles.body}>
                    <View style={styles.buttonAction}>
                        <ButtonBase
                            title={labelConfirm}
                            color={'white'}
                            background={colors.blue[600]}
                            border={colors.blue[600]}
                            size="md"
                            onPress={handleSubmit}
                        />

                        <ButtonBase
                            title={labelCancel}
                            color={colors.gray[800]}
                            background={'white'}
                            border={colors.gray[200]}
                            size="md"
                            onPress={handleCancel}
                        />
                    </View>
                </View>
            </BottomSheetView>
        </BottomSheetModal>
    );
};

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: 24,
        backgroundColor: 'white',
        borderTopEndRadius: 16,
        borderTopStartRadius: 16,
    },
    divider: {
        width: 52,
        height: 4,
        marginTop: 8,
        borderRadius: 99,
        backgroundColor: colors.gray[200],
        alignSelf: 'center',
    },
    buttonBack: {
        marginTop: 2,
        backgroundColor: colors.gray[200],
        padding: 4,
        alignSelf: 'flex-end',
        borderRadius: 50,
    },
    icon: {
        padding: 10,
        borderRadius: 50,
    },

    bottomSheetModalContainer: {
    },
    body: {
        alignItems: 'center',
        backgroundColor: 'white',
        borderBottomEndRadius: 16,
        borderBottomStartRadius: 16,
    },
    buttonAction: {
        width: '100%',
        paddingHorizontal: 24,
        marginTop: 16,
        rowGap: 12,
    },
});

export default ModalAction;
