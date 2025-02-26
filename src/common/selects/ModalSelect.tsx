import colors from '@/themes/colors';
import {typography} from '@/themes/typography';
import {BottomSheetModal, BottomSheetView} from '@gorhom/bottom-sheet';
import React, {memo, useCallback, useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {ChevronDownIcon, XMarkIcon} from 'react-native-heroicons/outline';
import InputSearch from '@/common/inputs/InputSearch';
import Checkbox from '@/common/checkboxs/Checkbox';
import Button from '@/common/buttons/Button';
import {configureReanimatedLogger} from 'react-native-reanimated';

type ModalSelectProps = {
  label: string;
  labelHeader: string;
  placeholder: string;
  options: string[];
  onChange: (values: string[]) => void;
  onToggleOverlayVisible: (visible: boolean) => void;
};

const ModalSelect = ({
  label,
  labelHeader,
  placeholder,
  options,
  onChange,
  onToggleOverlayVisible,
}: ModalSelectProps): JSX.Element => {
  configureReanimatedLogger({
    // strict: false,
  });

  const [isBottomSheetVisible, setIsBottomSheetVisible] =
    useState<boolean>(false);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [search, setSearch] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    if (isBottomSheetVisible && bottomSheetModalRef.current) {
      bottomSheetModalRef.current?.present();
      onToggleOverlayVisible(true);
    } else {
      bottomSheetModalRef.current?.dismiss();
      onToggleOverlayVisible(false);
    }
  }, [isBottomSheetVisible]);

  const handleSheetChanges = useCallback((index: number): void => {
    if (index === -1) {
      setIsBottomSheetVisible(false);
    }
  }, []);

  const handleToggleModal = (): void => {
    setIsBottomSheetVisible(!isBottomSheetVisible);
  };

  const handleToggleCategory = (category: string): void => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(item => item !== category)
        : [...prev, category],
    );
  };

  const getSelectedCategoriesText = (): string => {
    if (selectedCategories.length > 3) {
      return `${selectedCategories.slice(0, 3).join(', ')}...`;
    } else {
      return selectedCategories.join(', ');
    }
  };

  const handleSaveChange = (): void => {
    onChange(selectedCategories);
    setIsSaved(true);
    handleToggleModal();
  };

  return (
    <>
      <>
        <View>
          <Text style={styles.txtLabel}>{label}</Text>
          <TouchableOpacity
            style={styles.container}
            onPress={handleToggleModal}>
            <Text style={styles.defaultContent}>
              {isSaved && selectedCategories.length
                ? getSelectedCategoriesText()
                : placeholder}
            </Text>
            <ChevronDownIcon width={12} height={12} color={colors.gray[500]} />
          </TouchableOpacity>
        </View>
      </>

      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={['70%', '90%']}
        enablePanDownToClose
        onChange={handleSheetChanges}
        handleComponent={() => (
          <View>
            <View style={styles.divider}></View>
            <View style={styles.header}>
              <View style={styles.icon}></View>
              <Text style={styles.labelHeader}>{labelHeader}</Text>
              <TouchableOpacity onPress={handleToggleModal}>
                <XMarkIcon width={24} height={24} color={colors.gray[700]} />
              </TouchableOpacity>
            </View>
          </View>
        )}>
        <BottomSheetView style={styles.bottomSheetViewContainer}>
          <View style={styles.body}>
            <InputSearch
              value={search}
              onChangeText={setSearch}
              placeholder={'Search categories'}
            />

            <Text style={styles.suggest}>Suggest</Text>

            <View style={styles.listCheckbox}>
              {options
                .filter(value =>
                  value.toLowerCase().includes(search.toLowerCase()),
                )
                .map(category => (
                  <Checkbox
                    key={category}
                    label={category}
                    isChecked={selectedCategories.includes(category)}
                    onToggle={(): void => handleToggleCategory(category)}
                  />
                ))}
            </View>
          </View>

          <View style={styles.button}>
            <Button
              label={'Done'}
              disabled={!selectedCategories.length}
              onPress={handleSaveChange}
            />
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
};

const styles = StyleSheet.create({
  txtLabel: {
    color: colors.gray[800],
    fontWeight: '500',
    ...typography.body,
  },
  container: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    borderRadius: 8,
    backgroundColor: colors.gray[100],
    paddingHorizontal: 16,
  },
  content: {
    color: colors.gray[800],
    ...typography.body,
    fontWeight: '500',
  },
  defaultContent: {
    color: colors.gray[500],
  },

  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 52,
    height: 4,
    marginTop: 8,
    borderRadius: 99,
    backgroundColor: colors.gray[200],
    alignSelf: 'center',
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  icon: {
    width: 24,
    height: 24,
  },
  labelHeader: {
    color: colors.gray[800],
    ...typography.base,
    fontWeight: '500',
  },

  bottomSheetViewContainer: {},
  body: {
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: colors.gray[200],
    paddingBottom: 14,
  },
  listCheckbox: {
    marginTop: 22,
    rowGap: 28,
  },
  suggest: {
    marginTop: 12,
    color: colors.gray[800],
    ...typography.body,
    fontWeight: '500',
  },
  button: {
    marginTop: 10,
    marginHorizontal: 16,
    marginBottom: 20,
  },
});

export default memo(ModalSelect);
