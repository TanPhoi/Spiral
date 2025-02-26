import colors from '@/themes/colors';
import { typography } from '@/themes/typography';
import React, { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { MagnifyingGlassIcon } from 'react-native-heroicons/outline';

type InputSearchProps = {
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  onEnd?: () => void;
};
const InputSearch = ({
  value,
  onChangeText,
  placeholder,
  onEnd
}: InputSearchProps): JSX.Element => {
  return (
    <View style={styles.container}>
      <MagnifyingGlassIcon color={colors.gray[500]} width={20} height={20} />
      <TextInput
        value={value}
        placeholder={placeholder}
        onChangeText={onChangeText}
        style={styles.input}
        onEndEditing={onEnd}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 12,
    backgroundColor: colors.gray[100],
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    height: 36,
    color: colors.gray[800],
    ...typography.body,
    fontWeight: '500',
    paddingVertical: 4,
  },
});

export default InputSearch;
