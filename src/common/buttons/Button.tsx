import colors from '@/themes/colors';
import {typography} from '@/themes/typography';
import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

type ButtonProps = {
  label: string;
  disabled: boolean;
  loading?: boolean;
  background?: string;
  color?: string;
  onPress: () => void;
};

const Button = ({
  label,
  disabled,
  loading = false,
  background,
  color,
  onPress,
}: ButtonProps): JSX.Element => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.btn,
        !disabled ? undefined : styles.overlay,
        {backgroundColor: background || colors.blue[600]},
      ]}>
      {loading && <ActivityIndicator color={'white'} size={20} />}

      <Text style={[styles.txtButton, {color: color || 'white'}]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    columnGap: 6,
  },
  txtButton: {
    fontWeight: '600',
    ...typography.body,
  },
  overlay: {
    opacity: 0.5,
  },
  loading: {
    flexDirection: 'row',
    width: 18,
  },
});

export default Button;
