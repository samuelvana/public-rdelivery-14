import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { OswaldText } from './OswaldText';
import { ArialText } from "./ArialText";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';


const CourierAccountCard = () => {
  const [courierEmail, setCourierEmail] = useState('');
  const [courierPhone, setCourierPhone] = useState('');
  const [accountData, setAccountData] = useState(null);
  const [accountUpdated, setAccountUpdated] = useState(false);
  const [updateError, setUpdateError] = useState(false);


  const fetchAccountData = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        const response = await fetch(`http://localhost:8080/api/account/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setAccountData(data);
          setCourierEmail(data.courierEmail || '');
          setCourierPhone(data.courierPhone || '');
        } else {
          console.error('Failed to fetch account data:', response.status);
        }
      } else {
        console.error('No user ID found in AsyncStorage');
      }
    } catch (error) {
      console.error('Error fetching account data:', error);
    }
  };
  
  // Proper useEffect to fetch data on mount
  useEffect(() => {
    fetchAccountData();
  }, []);

  const handleUpdateAccount = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Error', 'User ID not found');
        return;
      }

      const payload = {
        courierEmail,
        courierPhone,
      };

      const response = await fetch(`http://localhost:8080/api/account/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setAccountUpdated(true);
        fetchAccountData(); // Reload data without refreshing
        setTimeout(() => {
          setAccountUpdated(false);
        }, 2000);
      } else {
        const errorData = await response.json();
        console.error('Failed to update account:', errorData);
        setUpdateError(true);
        setTimeout(() => {
          setUpdateError(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Error updating account:', error);
      setUpdateError(true);
      setTimeout(() => {
        setUpdateError(false);
      }, 2000);
    }
  };
  

  return (
    <View style={styles.card}>
      <ArialText style={styles.subtitle}>Logged In As: Courier</ArialText>

      <ArialText style={styles.label}>Primary Email (Read Only)</ArialText>
      <TextInput
        style={styles.readOnly}
        placeholder={accountData?.primaryEmail}
        editable={false}
      />
            <ArialText style={styles.subtext}>Email used to login to the application.</ArialText>


      <ArialText style={styles.label}>Courier Email:</ArialText>
      <TextInput
        style={styles.input}
        placeholder={accountData?.courierEmail}
        keyboardType="email-address"
        value={courierEmail}
        onChangeText={setCourierEmail}
        autoCapitalize="none"
        textContentType="emailAddress"
      />
      <ArialText style={styles.subtext}>Email used for your Courier account.</ArialText>

      <ArialText style={styles.label}>Courier Phone:</ArialText>
      <TextInput
        style={styles.input}
        placeholder={accountData?.courierPhone}
        textContentType="telephoneNumber"
        value={courierPhone}
        onChangeText={(text) => {
            // Filter input to allow only digits, plus sign, dashes, and spaces
            const sanitizedText = text.replace(/[^+\d\s-]/g, '');
            setCourierPhone(sanitizedText);
          }}
      />
            <ArialText style={styles.subtext}>Phone number for your Courier account.</ArialText>


            {accountUpdated ? (
        <View style={styles.confirmationContainer}>
          <Icon name="check-circle" size={50} color="green" />
          <OswaldText type="subtitle">Update Successful!</OswaldText>
        </View>
      ) : updateError ? (
        <View style={styles.confirmationContainer}>
          <Icon name="times-circle" size={50} color="red" />
          <OswaldText type="subtitle" style={{ color: 'red' }}>Update Failed</OswaldText>
          <OswaldText type="main">Please try again later.</OswaldText>
        </View>
      ) : (
      <TouchableOpacity style={styles.button} onPress={handleUpdateAccount}>
        <OswaldText type='button'>UPDATE ACCOUNT</OswaldText>
      </TouchableOpacity>
           )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    padding: 20,
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
    fontSize: 14,
    marginBottom: 5,
  },
  subtext: {
    fontSize: 12,
    color: '#888',
    marginBottom: 10,
  },
  readOnly: {
    fontSize: 16,
    color: '#888',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  input: {
    height: 40,
    fontSize: 16,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "#DA583B",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  confirmationContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 20,
  },
});

export default CourierAccountCard;
