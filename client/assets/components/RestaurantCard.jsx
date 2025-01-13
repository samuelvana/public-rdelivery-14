import React from "react";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { OswaldText } from "./OswaldText";
import Icon from 'react-native-vector-icons/FontAwesome';

// Image mapping
const imageMap = {
  Greek: require('../images/restaurants/cuisineGreek.jpg'),
  Japanese: require('../images/restaurants/cuisineJapanese.jpg'),
  Pasta: require('../images/restaurants/cuisinePasta.jpg'),
  Pizza: require('../images/restaurants/cuisinePizza.jpg'),
  Southeast: require('../images/restaurants/cuisineSoutheast.jpg'),
  Viet: require('../images/restaurants/cuisineViet.jpg'),
};

const RestaurantCard = ({ restaurantName, priceRange, rating, onPress }) => {
  const maxRating = 5;

  // Function to convert price range to dollar signs
  const renderPriceRange = (priceRange) => {
    return "$".repeat(priceRange);
  };

  // Function to render stars based on the rating
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Icon key={`full-${i}`} name="star" size={12}/>);
    }

    if (hasHalfStar) {
      stars.push(<Icon key="half" name="star-half-o" size={12}/>);
    }

    // Fill in the remaining empty stars
    for (let i = stars.length; i < maxRating; i++) {
      stars.push(<Icon key={`empty-${i}`} name="star-o" size={12}/>);
    }

    return stars;
  };

  const restaurantImage = imageMap[restaurantName] || require('../images/restaurants/cuisinePizza.jpg'); // Fallback image

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image
        source={restaurantImage}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.detailsContainer}>
        <OswaldText style={styles.title}>{restaurantName}</OswaldText>
        <OswaldText style={styles.price}>{renderPriceRange(priceRange)}</OswaldText>
        <View style={styles.ratingContainer}>
          {renderStars(rating)}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "100%",
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // For Android
  },
  image: {
    width: "100%",
    height: 150,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  detailsContainer: {
    padding: 10,
  },
  price: {
    fontSize: 16,
    color: "#888",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default RestaurantCard;
