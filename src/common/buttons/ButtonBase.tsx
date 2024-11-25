import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {JSX} from 'react';
import {typography} from '@/themes/typography';
import {opacity} from 'react-native-reanimated/lib/typescript/Colors';

type ButtonBaseProps = {
  title: string;
  color: string;
  background: string;
  border?: string;
  onPress?: () => void;
  size?: 'md' | 'sm';
  disabled?: boolean;
};

const ButtonBase = ({
  title,
  color,
  background,
  border,
  onPress,
  size,
  disabled,
}: ButtonBaseProps): JSX.Element => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: background,
          borderColor: border ?? background,
          height: size === 'md' ? 44 : 36,
        },
        disabled && styles.opacity,
      ]}
      onPress={onPress}
      disabled={disabled}>
      <Text style={[styles.title, {color: color}]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  title: {
    fontWeight: '600',
    ...typography.body,
  },
  opacity: {
    opacity: 0.5,
  },
});

export default ButtonBase;
