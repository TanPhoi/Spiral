import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { JSX, useCallback, useEffect, useRef, useState } from 'react';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import colors from '@/themes/colors';
import { XMarkIcon } from 'react-native-heroicons/outline';
import { AlertCircleIcon, RocketIcon } from '@/assets/svg';
import { typography } from '@/themes/typography';
import ButtonBase from '../buttons/ButtonBase';

type ModalConfirmProps = {
  open: boolean;
  onClose: () => void;
  type: 'decline' | 'apply';
  label: string;
  labelConfirm: string;
  labelCancel: string;
  desc: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const ModalConfirm = ({
  open,
  onClose,
  label,
  onConfirm,
  type,
  desc,
  onCancel,
  labelConfirm,
  labelCancel
}: ModalConfirmProps): JSX.Element => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [isBottomSheetVisible, setIsBottomSheetVisible] =
    useState<boolean>(open);

  const isApplyType = type === 'apply';

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
    onCancel()
    handleToggleModal();
  };

  const handleSubmit = () => {
    onConfirm();
    handleToggleModal();
  };

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      onChange={handleSheetChanges}
      snapPoints={['40%']}
      enablePanDownToClose
      enableDynamicSizing={false}
      style={styles.bottomSheetModalContainer}
      containerStyle={{
        backgroundColor: '#00000080',
      }}
      backgroundStyle={{
        backgroundColor: 'transparent',
      }}

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
          <View
            style={[
              styles.icon,
              {
                backgroundColor: isApplyType
                  ? colors.blue[50]
                  : colors.red[100],
              },
            ]}>
            {isApplyType ? (
              <>
                <RocketIcon width={24} height={24} />
              </>
            ) : (
              <>
                <AlertCircleIcon width={24} height={24} />
              </>
            )}
          </View>

          <Text style={styles.txtAlert}>{label}</Text>
          <Text style={styles.txtDesc}>{desc}</Text>

          <View style={styles.buttonAction}>
            <ButtonBase
              title={labelConfirm}
              color={'white'}
              background={isApplyType ? colors.blue[600] : colors.red[500]}
              border={isApplyType ? colors.blue[600] : colors.red[500]}
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
    marginHorizontal: 16,
  },
  body: {
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomEndRadius: 16,
    borderBottomStartRadius: 16,
  },
  txtAlert: {
    marginTop: 20,
    color: colors.gray[800],
    fontWeight: '600',
    ...typography.heading4,
  },
  txtDesc: {
    color: colors.gray[700],
    ...typography.body,
    textAlign: "center",
    marginHorizontal: 24,
  },
  buttonAction: {
    width: '100%',
    paddingHorizontal: 24,
    marginTop: 32,
    rowGap: 12,
  },
});

export default ModalConfirm;
