package com.rocketFoodDelivery.rocketFood.controller.api;
import com.rocketFoodDelivery.rocketFood.controller.api.GeocodingController.GeocodingResponse;
import com.rocketFoodDelivery.rocketFood.models.Address;
import com.rocketFoodDelivery.rocketFood.models.Restaurant;
import com.rocketFoodDelivery.rocketFood.service.GeocodingService;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.rocketFoodDelivery.rocketFood.repository.RestaurantRepository;
@RestController
@RequestMapping("/api")
public class GeocodingController {
    private final GeocodingService geocodingService;
    private final RestaurantRepository restaurantRepository;
    @Autowired
    public GeocodingController(
        GeocodingService geocodingService,
        RestaurantRepository restaurantRepository
        ) {
        this.geocodingService = geocodingService;
        this.restaurantRepository = restaurantRepository;
    }
    @PostMapping("/geocode")
    public GeocodingResponse geocode(
        @RequestParam(value = "id", required = false) Integer restaurantId
        ) {
            Optional<Restaurant> foundRestaurant = restaurantRepository.findById(restaurantId);
            Restaurant restaurant = foundRestaurant.get();
            Address newAddress = restaurant.getAddress();
            String streetAddress = newAddress.getStreetAddress();
        double[] coordinates = geocodingService.getCoordinates(streetAddress);
        return new GeocodingResponse(coordinates[0], coordinates[1]);
    }
    // Request DTO to receive the address
    public static class AddressRequest {
        private String address;
        // Getters and Setters
        public String getAddress() {
            return address;
        }
        public void setAddress(String address) {
            this.address = address;
        }
    }
    // Response DTO to return latitude and longitude
    public static class GeocodingResponse {
        private double latitude;
        private double longitude;
        public GeocodingResponse(double latitude, double longitude) {
            this.latitude = latitude;
            this.longitude = longitude;
        }
        // Getters
        public double getLatitude() {
            return latitude;
        }
        public double getLongitude() {
            return longitude;
        }
    }
}