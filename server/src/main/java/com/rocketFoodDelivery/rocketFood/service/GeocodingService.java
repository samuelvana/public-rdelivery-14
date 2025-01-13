package com.rocketFoodDelivery.rocketFood.service;
import org.springframework.web.client.RestTemplate;
import org.springframework.stereotype.Service;
import org.json.JSONObject;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
@Service
public class GeocodingService {
    private static final String GOOGLE_MAPS_API_URL = "https://maps.googleapis.com/maps/api/geocode/json";
    private static final String API_KEY = "AIzaSyCDlcGCD10Fb7jFAUOrJLKtBdGmNPRMzxQ";
    public double[] getCoordinates(String address) {
        RestTemplate restTemplate = new RestTemplate();
        String encodedAddress = encodeAddress(address);
        String requestUrl = GOOGLE_MAPS_API_URL + "?address=" + encodedAddress + "&key=" + API_KEY;
        try {
            String response = restTemplate.getForObject(requestUrl, String.class);
            JSONObject json = new JSONObject(response);
            if (json.getJSONArray("results").length() > 0) {
                JSONObject location = json.getJSONArray("results")
                        .getJSONObject(0)
                        .getJSONObject("geometry")
                        .getJSONObject("location");
                double lat = location.getDouble("lat");
                double lng = location.getDouble("lng");
                return new double[]{lat, lng};
            } else {
                throw new RuntimeException("No results found for address: " + address);
            }
        } catch (Exception e) {
            throw new RuntimeException("Error fetching coordinates: " + e.getMessage());
        }
    }
    private String encodeAddress(String address) {
        try {
            return URLEncoder.encode(address, "UTF-8");
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException("Error encoding address: " + address, e);
        }
    }
}