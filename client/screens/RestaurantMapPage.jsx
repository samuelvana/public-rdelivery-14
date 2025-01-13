import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { OswaldText } from "../assets/components/OswaldText";
import CustomDropdown from "../assets/components/ui/CustomDropdown";
import StarRatingDropdown from "../assets/components/ui/StarRatingDropdown";
import { GoogleMap, Marker } from "@react-google-maps/api";
import Icon from "react-native-vector-icons/FontAwesome";


const containerStyle = {
  width: "100%",
  height: "60%",
};

const mapCenter = {
  lat: 38.9372,
  lng: -77.0365,
};

const RestaurantMap = ({ navigation }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedPrice, setSelectedPrice] = useState(0);

  useEffect(() => {
    const getCoordinates = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/geocode?id=${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (data && data.latitude && data.longitude) {
        return { id, latitude: data.latitude, longitude: data.longitude };
      } else {
        console.error("Geocoding failed for address:", address);
        return { latitude: 0, longitude: 0 }; // Fallback
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      return { latitude: 0, longitude: 0 }; // Fallback
    }
  };

  const fetchRestaurants = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/restaurants");
      const data = await response.json();
  const restaurantIds = data.data.map((restaurant) => restaurant.id);
  // Fetch coordinates for each restaurant ID
  const restaurantCoordinates = await Promise.all(
    restaurantIds.map((id) => getCoordinates(id))
  );

  setRestaurants(restaurantCoordinates);
} catch (error) {
  console.error("Error fetching restaurants:", error);
}
};
fetchRestaurants();
}, []);

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const ratingMatch =
      selectedRating === 0 || restaurant.rating === selectedRating;
    const priceMatch =
      selectedPrice === 0 || restaurant.price_range === selectedPrice;
    return ratingMatch && priceMatch;
  });

  const priceOptions = [
    { label: "--Select--", value: 0 },
    { label: "$", value: 1 },
    { label: "$$", value: 2 },
    { label: "$$$", value: 3 },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <OswaldText type="subtitle">NEARBY RESTAURANTS</OswaldText>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Restaurants")}
        >
          <Icon name="bars" size={20} color="#fff" />
          <OswaldText type="button">   VIEW LIST</OswaldText>
        </TouchableOpacity>
      </View>
      <View style={styles.rowContainer}>
        {/* Star Rating Dropdown */}
        <StarRatingDropdown
          label="Rating"
          selectedValue={selectedRating}
          onValueChange={setSelectedRating}
        />
        {/* Price Range Dropdown */}
        <CustomDropdown
          label="Price"
          options={priceOptions}
          selectedValue={selectedPrice}
          onValueChange={setSelectedPrice}
        />
      </View>
      <OswaldText type="subtitle">RESTAURANT MAP</OswaldText>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={mapCenter}
          zoom={11}
        >
          {filteredRestaurants.map((restaurant) => (
            <Marker
              key={restaurant.id}
              position={{
                lat: restaurant.latitude,
                lng: restaurant.longitude,
              }}
              title={restaurant.name}
              description={`Rating: ${restaurant.rating} | Price: ${"$".repeat(
                restaurant.price_range
              )}`}
              onClick={() =>
                navigation.navigate("RestaurantMenu", {
                  restaurantId: restaurant.id,
                })
              }
            />
          ))}
        </GoogleMap>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 10,
},
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DA583B",
    fontSize: 16,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
});

export default RestaurantMap;
