import colors from '@/themes/colors';
import {typography} from '@/themes/typography';
import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {CountryPicker} from 'react-native-country-codes-picker';
import {TextInput} from 'react-native-gesture-handler';
import {ChevronDownIcon} from 'react-native-heroicons/outline';

type InputCountryProps = {
  label: string;
  value: string;
  placeholder: string;
  error: string | undefined;
  onChangeText: () => void;
};

const InputCountry = ({
  label,
  value,
  placeholder,
  error,
  onChangeText,
}: InputCountryProps) => {
  const [show, setShow] = useState(false);
  const [countryCode, setCountryCode] = useState<string>('+1');
  const [countryFlag, setCountryFlag] = useState<string>('🇺🇸');

  return (
    <View>
      <Text style={styles.txtLabel}>{label}</Text>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={(): void => setShow(true)}
          style={styles.btnCountry}>
          <Text style={styles.iconFlag}>{countryFlag}</Text>
          <Text style={styles.txtCountryCode}>{countryCode}</Text>
          <ChevronDownIcon color={colors.gray[500]} width={12} height={12} />
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          placeholder={placeholder}
          value={value}
          keyboardType="numeric"
        />
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
      <CountryPicker
        show={show}
        onBackdropPress={(): void => setShow(false)}
        lang={'en'}
        style={{
          modal: {
            height: '60%',
            width: '98%',
            alignSelf: 'center',
          },
        }}
        pickerButtonOnPress={item => {
          setCountryCode(item.dial_code);
          setCountryFlag(item.flag);
          setShow(false);
        }}
      />
    </View>
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
    marginTop: 8,
    borderRadius: 8,
    backgroundColor: colors.gray[100],
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnCountry: {
    flexDirection: 'row',
    columnGap: 8,
    alignItems: 'center',
    borderRightWidth: 1,
    paddingRight: 16,
    borderColor: colors.gray[200],
  },
  iconFlag: {
    fontSize: 22,
  },
  txtCountryCode: {
    color: colors.gray[800],
    ...typography.body,
    fontWeight: '500',
  },
  input: {
    flex: 1,
    height: 44,
    paddingHorizontal: 16,
    color: colors.gray[800],
    ...typography.body,
    fontWeight: '500',
  },
  error: {
    color: 'red',
    marginTop: 4,
  },
});

export default InputCountry;
