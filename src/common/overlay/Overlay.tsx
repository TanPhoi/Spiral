import React from 'react';
import {StyleSheet, View} from 'react-native';

type OverlayProps = {
  isVisible: boolean;
};

const Overlay = ({isVisible}: OverlayProps): JSX.Element => {
  if (!isVisible) return <></>;
  return <View style={styles.container} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    height: '100%',
    zIndex: 1,
    right: 0,
    left: 0,
    backgroundColor: '#00000080',
  },
});

export default Overlay;
