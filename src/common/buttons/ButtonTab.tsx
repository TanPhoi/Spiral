import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {typography} from '@/themes/typography';
import colors from '@/themes/colors';

type ButtonTabProps = {
  label: string;
  active: boolean;
  size?: 'md' | 'sm';
  onPress?: () => void;
};

const ButtonTab = ({label, active, onPress, size}: ButtonTabProps) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        active ? styles.activeButton : styles.inactiveButton,
        {height: size === 'sm' ? 28 : 36},
      ]}
      onPress={onPress}>
      <Text
        style={[
          styles.label,
          active ? styles.activeLabel : styles.inactiveLabel,
        ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignSelf: 'flex-start',
  },
  label: {
    fontWeight: '600',
    ...typography.body,
  },
  inactiveButton: {
    backgroundColor: colors.gray[100],
  },
  activeButton: {
    backgroundColor: colors.gray[900],
  },
  inactiveLabel: {
    color: colors.gray[800],
  },
  activeLabel: {
    color: 'white',
  },
});

export default ButtonTab;
