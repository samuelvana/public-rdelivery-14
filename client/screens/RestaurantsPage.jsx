import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { OswaldText } from "../assets/components/OswaldText";
import RestaurantCard from "../assets/components/RestaurantCard";
import CustomDropdown from "../assets/components/ui/CustomDropdown";
import StarRatingDropdown from "../assets/components/ui/StarRatingDropdown";
import Icon from "react-native-vector-icons/FontAwesome";

export default function Restaurants({ navigation }) {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedPrice, setSelectedPrice] = useState(0);

  const fetchRestaurants = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/restaurants");
      const data = await response.json();
      setRestaurants(data.data);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    }
  };

  useEffect(() => {
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
          onPress={() => navigation.navigate("RestaurantMap")}
        >
          <Icon name="map" size={20} color="#fff" />
          <OswaldText type="button">   VIEW MAP</OswaldText>
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
      <OswaldText type="subtitle">RESTAURANTS</OswaldText>
      <ScrollView>
        {Array.isArray(filteredRestaurants) &&
        filteredRestaurants.length > 0 ? (
          <View style={styles.gridContainer}>
            {filteredRestaurants.map((restaurant) => (
              <View style={styles.cardWrapper} key={restaurant.id}>
                <RestaurantCard
                  restaurantName={restaurant.name}
                  priceRange={restaurant.price_range}
                  rating={restaurant.rating}
                  onPress={() =>
                    navigation.navigate("RestaurantMenu", {
                      restaurantId: restaurant.id,
                    })
                  }
                />
              </View>
            ))}
          </View>
        ) : (
          <OswaldText>No restaurants found</OswaldText>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 68,
    flex: 1,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  cardWrapper: {
    width: "48%",
    marginBottom: 10,
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
