package com.rocketFoodDelivery.rocketFood.service;
import com.rocketFoodDelivery.rocketFood.models.Address;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
@Service
public class RestaurantGeocodingService {
    private final GeocodingService geocodingService;
    @Autowired
    public RestaurantGeocodingService(GeocodingService geocodingService) {
        this.geocodingService = geocodingService;
    }
    /**
     * Converts the restaurant's address into latitude and longitude.
     */
    public double[] getCoordinatesForAddress(Address address) {
        String fullAddress = address.getStreetAddress() + ", " + address.getCity() + ", " + address.getPostalCode();
        return geocodingService.getCoordinates(fullAddress);
    }
}