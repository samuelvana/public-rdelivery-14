import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import App from './App';

const APP_WIDTH = 390; // Fixed width for the app
const APP_HEIGHT = 844; // Fixed height for the app

export default function Root() {
  const { width, height } = Dimensions.get('window'); // Get screen dimensions
  const isSmallScreen = width < APP_WIDTH || height < APP_HEIGHT; // Check for small screen

  return (
    <View style={styles.container}>
      <View style={[styles.appContainer, isSmallScreen && styles.noBorder]}>
        <App appWidth={APP_WIDTH} appHeight={APP_HEIGHT} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  appContainer: {
    width: APP_WIDTH,
    height: APP_HEIGHT,
    backgroundColor: '#fff',
    borderWidth: 15,
    borderTopWidth: 50,
    borderBottomWidth: 50,
    borderColor: 'black',
    borderRadius: 20,
  },
  noBorder: {
    width: '100%', // Use full width
    height: '100%', // Use full height
    borderWidth: 0,
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
});
