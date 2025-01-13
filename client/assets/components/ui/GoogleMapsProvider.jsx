import React from 'react';
import { LoadScript } from '@react-google-maps/api';

const GoogleMapsContext = React.createContext();

export const GoogleMapsProvider = ({ children, apiKey }) => {
    return (
        <GoogleMapsContext.Provider value={{}}>
            <LoadScript googleMapsApiKey={apiKey}>
                {children}
            </LoadScript>
        </GoogleMapsContext.Provider>
    );
};
