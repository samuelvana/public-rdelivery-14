import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as Font from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Authentication from "./screens/AuthenticationPage";
import OrderHistory from "./screens/OrderHistoryPage";
import Restaurants from "./screens/RestaurantsPage";
import RestaurantMenu from "./screens/RestaurantMenuPage";
import RestaurantCard from "./assets/components/RestaurantCard";
import ProductCard from "./assets/components/ProductCard";
import Header from "./assets/components/ui/Header";
import MyDeliveries from "./screens/CourierDeliveriesPage";
import AccountSelectionPage from "./screens/AccountSelectionPage";
import CustomerAccount from "./screens/CustomerAccountPage";
import CourierDeliveries from "./screens/CourierDeliveriesPage";
import CourierAccount from "./screens/CourierAccountPage";
import RestaurantMap from "./screens/RestaurantMapPage";
import { GoogleMapsProvider } from "./assets/components/ui/GoogleMapsProvider";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const loadFonts = async () => {
  await Font.loadAsync({
    "oswald-regular": require("./assets/fonts/Oswald-VariableFont_wght.ttf"),
  });
};

export default function App({ appWidth = APP_WIDTH, appHeight = APP_HEIGHT }) {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    loadFonts().then(() => setFontsLoaded(true));
  }, []);

  if (!fontsLoaded) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  const handleLogout = async (navigation) => {
    try {
      await AsyncStorage.clear();
      console.log("User logged out and AsyncStorage cleared");
      navigation.navigate("Login");
    } catch (error) {
      console.error("Error clearing AsyncStorage:", error);
    }
  };

  const RestaurantStack = () => {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Restaurants" component={Restaurants} />
        <Stack.Screen
        name="RestaurantMenu"
        children={(props) => (
          <RestaurantMenu {...props} appWidth={appWidth} appHeight={appHeight} />
        )}
      />
        <Stack.Screen name="RestaurantMap" component={RestaurantMap} />
      </Stack.Navigator>
    );
  };

  function RestaurantTabNavigator() {
    return (
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: "#DA583B",
          tabBarInactiveTintColor: "222126",
          tabBarStyle: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'white' },
        }}
      >
        <Tab.Screen
          name="RestaurantStack"
          component={RestaurantStack}
          options={{
            header: () => <Header 
            onLogout={() => handleLogout(navigation)} 
            appWidth={appWidth}
                appHeight={appHeight}
            />,
            tabBarLabel: "Restaurants",
            tabBarIcon: ({ color }) => (
              <FontAwesome5 name="hamburger" color={color} size={18} />
            ),
          }}
        />

        <Tab.Screen
          name="OrderHistory"
          component={OrderHistory}
          options={{
            header: () => <Header 
            onLogout={() => handleLogout(navigation)} 
            appWidth={appWidth}
                appHeight={appHeight}
            />,
            tabBarLabel: "Order History",
            tabBarIcon: ({ color }) => (
              <FontAwesome5 name="history" color={color} size={18} />
            ),
          }}
          initialParams={{ appWidth, appHeight }}
        />

        <Tab.Screen
          name="CustomerAccount"
          component={CustomerAccount}
options={{
              header: () => <Header 
              onLogout={() => handleLogout(navigation)} 
              appWidth={appWidth}
                  appHeight={appHeight}
              />,
              tabBarLabel: "Account",
            tabBarIcon: ({ color }) => (
              <FontAwesome5 name="user" color={color} size={18} />
            ),
          }}
        />
      </Tab.Navigator>
    );
  }

  function CourierTabNavigator() {
    return (
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: "#DA583B",
          tabBarInactiveTintColor: "222126",
          tabBarStyle: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'white' },
        }}
      >
        <Tab.Screen
          name="DeliveryHistory"
          component={CourierDeliveries}
          options={{
            header: () => <Header 
            onLogout={() => handleLogout(navigation)} 
            appWidth={appWidth}
                appHeight={appHeight}
            />,
            tabBarLabel: "Deliveries",
            tabBarIcon: ({ color }) => (
              <FontAwesome5 name="history" color={color} size={18} />
            ),
          }}
          initialParams={{ appWidth, appHeight }}
        />
        <Tab.Screen
          name="CourierAccount"
          component={CourierAccount}
          options={{
            header: () => <Header 
            onLogout={() => handleLogout(navigation)} 
            appWidth={appWidth}
                appHeight={appHeight}
            />,
            tabBarLabel: "Account",
            tabBarIcon: ({ color }) => (
              <FontAwesome5 name="user" color={color} size={18} />
            ),
          }}
        />

      </Tab.Navigator>
    )
  }

  const API_Key = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

  return (
    <GoogleMapsProvider apiKey= {API_Key} >
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={Authentication}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AccountSelectionPage"
          component={AccountSelectionPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Customers"
          component={RestaurantTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="MyDeliveries" component={MyDeliveries} />
        <Stack.Screen
          name="Couriers"
          component={CourierTabNavigator}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
    </GoogleMapsProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  globalMargin: {
    backgroundColor: "red",
    padding: 5,
  },
  text: {
    fontFamily: "oswald-regular",
    fontSize: 24,
  },
});
