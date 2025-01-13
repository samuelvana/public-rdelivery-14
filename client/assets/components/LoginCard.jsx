import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { OswaldText }from './OswaldText';
import { ArialText } from './ArialText';
import { useNavigation } from '@react-navigation/native';
import Restaurants from '../../screens/RestaurantsPage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginCard = () => {
  const [email, setEmail] = useState("erica.ger@gmail.com");
  const [password, setPassword] = useState("password");
  const [errorMessage, setErrorMessage] = useState(""); 
  const navigation = useNavigation()

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/login', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store user ID and type in AsyncStorage
        const { user_id, customer_id, courier_id } = data;


      if (user_id) {
        // Store user data in AsyncStorage
        await AsyncStorage.setItem('userId', user_id.toString());
        if (customer_id) {
          await AsyncStorage.setItem('customerId', customer_id.toString());
        }
        if (courier_id) {
          await AsyncStorage.setItem('courierId', courier_id.toString());
        }

        // Navigate based on roles
        if (customer_id && courier_id) {
          // Scenario 3: Both roles
          navigation.navigate("AccountSelectionPage", { userId: user_id });
        } else if (customer_id) {
          // Scenario 1: Customer role only
          navigation.navigate("Customers");
        } else if (courier_id) {
          // Scenario 2: Courier role only
          navigation.navigate("Couriers");
        } else {
          setErrorMessage("No valid roles associated with this account.");
        }
      } else {
        setErrorMessage("Invalid login credentials.");
      }
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setErrorMessage("An error occurred while trying to log in.");
      setTimeout(() => {
        setErrorMessage("");
      }, 2000);
    }
  };

  return (
    <View style={styles.card}>
      <OswaldText style={styles.title}>Welcome Back</OswaldText>
      <OswaldText style={styles.subtitle}>Login to begin</OswaldText>

      <OswaldText style={styles.label}>Email</OswaldText>
      <TextInput
        style={styles.input}
        placeholder="Enter your primary email here"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        textContentType="emailAddress"
      />

      <OswaldText style={styles.label}>Password</OswaldText>
      <TextInput
        style={styles.input}
        placeholder="************"
        keyboardType="default"
        autoCapitalize="none"
        textContentType="password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Display error message if it exists */}
      {errorMessage ? (
        <OswaldText style={styles.errorMessage}>{errorMessage}</OswaldText>
      ) : null}

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <OswaldText type='button'>LOG IN</OswaldText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // For Android
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    fontFamily: 'oswald-regular'
  },
  button: {
    backgroundColor: "#DA583B",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  errorMessage: {
    color: 'red',
    marginBottom: 10,
  },
});

export default LoginCard;
