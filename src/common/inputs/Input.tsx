import colors from '@/themes/colors';
import {typography} from '@/themes/typography';
import React, {useState} from 'react';
import {Control, Controller, FieldErrors, FieldValues} from 'react-hook-form';
import {
  KeyboardType,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {EyeIcon, EyeSlashIcon} from 'react-native-heroicons/outline';

type InputProps = {
  value: string;
  onChangeText: () => void;
  error: string | undefined;
  label: string;
  placeholder: string;
  isPassword?: boolean;
  keyboardType?: KeyboardType;
};
const Input = ({
  value,
  onChangeText,
  error,
  label,
  placeholder,
  isPassword,
  keyboardType,
}: InputProps): JSX.Element => {
  const [isViewPassword, setIsViewPassword] = useState<boolean>(false);

  const handleVisiblePassword = (): void => {
    setIsViewPassword(!isViewPassword);
  };

  return (
    <View>
      <Text style={styles.txtLabel}>{label}</Text>
      <View>
        <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          style={styles.input}
          secureTextEntry={isPassword && !isViewPassword}
          keyboardType={keyboardType}
        />
        {isPassword && (
          <TouchableOpacity
            style={styles.viewPassword}
            onPress={handleVisiblePassword}>
            {!isViewPassword ? (
              <EyeIcon size={20} color={colors.gray[500]} />
            ) : (
              <EyeSlashIcon size={20} color={colors.gray[500]} />
            )}
          </TouchableOpacity>
        )}
      </View>

      {error && <Text style={styles.txtError}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  txtLabel: {
    color: '#1F2937',
    fontWeight: '500',
    ...typography.body,
  },
  input: {
    height: 44,
    marginTop: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    color: '#1F2937',
    ...typography.body,
    fontWeight: '500',
    paddingHorizontal: 16,
  },
  txtError: {
    color: 'red',
    ...typography.body,
    fontWeight: '500',
  },
  viewPassword: {
    position: 'absolute',
    right: 16,
    top: 21,
  },
});

export default Input;
