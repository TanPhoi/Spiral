import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { JSX } from 'react';
import { ChevronLeftIcon, EllipsisHorizontalIcon, XMarkIcon } from 'react-native-heroicons/outline';
import colors from '@/themes/colors';
import { typography } from '@/themes/typography';

type HeaderProps = {
  title: string;
  type: 'back' | 'close';
  isSetting?: boolean;
  onSetting?: () => void;
  onPress: () => void;
};

const Header = ({ title, type, isSetting, onSetting, onPress }: HeaderProps): JSX.Element => {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={onPress}>
        {type === 'close' ? (
          <XMarkIcon color={colors.gray[700]} width={24} height={24} />
        ) : (
          <ChevronLeftIcon color={colors.gray[700]} width={24} height={24} />
        )}
      </TouchableOpacity>
      <Text style={styles.txtHeader}>{title}</Text>
      {
        isSetting ? (
          <TouchableOpacity onPress={onSetting}>
            <EllipsisHorizontalIcon width={24} height={24} color={colors.gray[700]} />
          </TouchableOpacity>
        ) : (
          <View style={styles.virtual} />
        )
      }
    </View >
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  txtHeader: {
    color: colors.gray[800],
    fontWeight: '500',
    ...typography.heading5,
  },
  virtual: {
    width: 24,
    height: 24,
  },
});

export default Header;
