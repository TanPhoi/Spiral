import colors from '@/themes/colors';
import {typography} from '@/themes/typography';
import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {CheckIcon, EyeIcon, EyeSlashIcon} from 'react-native-heroicons/outline';

type CheckboxProps = {
  label: string;
  isChecked: boolean;
  onToggle: () => void;
};
const Checkbox = ({label, isChecked, onToggle}: CheckboxProps): JSX.Element => {
  return (
    <TouchableOpacity style={styles.container} onPress={onToggle}>
      <Text style={styles.txtLabel}>{label}</Text>
      <View
        style={[styles.checkbox, isChecked ? styles.checked : styles.uncheck]}>
        <CheckIcon width={14} height={14} color={'white'} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  txtLabel: {
    color: colors.gray[800],
    ...typography.body,
  },
  checkbox: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 20,
    width: 20,
    borderWidth: 1,
    borderRadius: 4,
  },
  checked: {
    backgroundColor: colors.blue[600],
    borderColor: colors.blue[600],
  },
  uncheck: {
    borderColor: colors.gray[300],
  },
});

export default Checkbox;
