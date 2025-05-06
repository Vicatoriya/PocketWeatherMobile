import React, { useState, useRef, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { UrlTile, Marker } from 'react-native-maps';
import MapView from 'react-native-maps';
import { useWeather } from '@/hooks/useWeather';
import { CurrentWeatherResponse } from '@/services/weatherApi';
import { MapPressEvent } from 'react-native-maps';
import { LocationContext } from '@/context/LocationContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAir, AirQualityData } from '@/hooks/useAir';
import { SettingsContext } from '@/context/SettingsContext';
import { useTranslation } from 'react-i18next';

const WeatherMap = () => {
  const { t } = useTranslation();
  const [markers, setMarkers] = useState([]);
  const { latitude, longitude, locationLoaded } = useContext(LocationContext);
  const [searchQuery, setSearchQuery] = useState('');
  const mapRef = useRef(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [selectedCoords, setSelectedCoords] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);


 useEffect(() => {
     const loadMarkers = async () => {
         try {
             const storedMarkers = await AsyncStorage.getItem('weatherMarkers');
             if (storedMarkers) {
                 setMarkers(JSON.parse(storedMarkers));
             }
         } catch (error) {
             console.error('Failed to load markers from AsyncStorage:', error);
         }
     };

     loadMarkers();
 }, []);

  useEffect(() => {
       const saveMarkers = async () => {
           try {
               await AsyncStorage.setItem('weatherMarkers', JSON.stringify(markers));
           } catch (error) {
               console.error('Failed to save markers to AsyncStorage:', error);
           }
       };

       saveMarkers();
   }, [markers]);

  const DEFAULT_COORDS = {
    latitude: 55.7558,
    longitude: 37.6173,
  };

  const region = {
    latitude: latitude || DEFAULT_COORDS.latitude,
    longitude: longitude || DEFAULT_COORDS.longitude,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  };

  const coordsString = selectedMarker
    ? `${selectedMarker.coordinates.latitude},${selectedMarker.coordinates.longitude}`
    : selectedCoords
      ? `${selectedCoords.latitude},${selectedCoords.longitude}`
      : '';

  const { weather } = useWeather(coordsString);
  const { data } = useAir({
    lat: selectedCoords?.latitude || latitude || DEFAULT_COORDS.latitude,
    lon: selectedCoords?.longitude || longitude || DEFAULT_COORDS.longitude,
  });


  const airQuality = data;
  const { settings } = useContext(SettingsContext);

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(searchQuery)}&key=8c19fc4500d448af89913363ee5699a2`,
      );
      const data = await response.json();

      if (data.results.length > 0) {
        const firstResult = data.results[0];
        const newCoords = {
          latitude: firstResult.geometry.lat,
          longitude: firstResult.geometry.lng,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        };
        mapRef.current?.animateToRegion(newCoords, 1000);
      } else {
        Alert.alert(t('error'), t('location_not_found'));
      }
    } catch {
      Alert.alert(t('error'), t('search_failed'));
    }
  };

  const handleMapPress = (e) => {
    const { coordinate } = e.nativeEvent;
    if (isPanelOpen) {
      setIsPanelOpen(false);
      setSelectedMarker(null);
      setSelectedCoords(null);
      return;
    }
    setSelectedCoords(coordinate);
    setSelectedMarker(null);
    setIsPanelOpen(true);
  };

  const handleMarkerPress = (marker) => {
    if (isPanelOpen) return;
    setSelectedMarker(marker);
    setSelectedCoords(null);
    setIsPanelOpen(true);
  };

  const handleAddButtonPress = () => {
    if (selectedCoords) {
      const newMarker = {
        id: Date.now().toString(),
        coordinates: selectedCoords,
        weatherData: null,
      };
      setMarkers((prev) => [...prev, newMarker]);
      setSelectedMarker(newMarker);
      setSelectedCoords(null);
    }
  };

  const handleDeleteButtonPress = () => {
    if (selectedMarker) {
      setMarkers((prev) => prev.filter((m) => m.id !== selectedMarker.id));
      setSelectedMarker(null);
      setSelectedCoords(null);
      setIsPanelOpen(false);
    }
  };

  const renderWeatherPanel = () => (
    <View style={styles.panel}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.rowContainer}>
          <Text style={styles.coordsText}>
            [
            {(
              selectedMarker?.coordinates?.latitude ?? selectedCoords?.latitude
            )?.toFixed(4) ?? ''}
            ,
            {(
              selectedMarker?.coordinates?.longitude ??
              selectedCoords?.longitude
            )?.toFixed(4) ?? ''}
            ]
          </Text>
          {selectedMarker ? (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDeleteButtonPress}
            >
              <Text style={styles.buttonText}>{t('delete')}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddButtonPress}
            >
              <Text style={styles.buttonText}>{t('add')}</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.additionalInfo}>
          <Text style={styles.sectionTitle}>{t('info_title')}</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t('temperature')}</Text>
            <Text style={styles.infoValue}>{weather?.temp_c} °C</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t('humidity')}</Text>
            <Text style={styles.infoValue}>{weather?.humidity} %</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t('wind_speed')}</Text>
            <Text style={styles.infoValue}>{weather?.wind_kph} км/ч</Text>
          </View>
          <View style={styles.divider} />

          {settings.ecoMode && (
            <View style={styles.ecoModeMessage}>
              <Text style={styles.ecoModeText}>{t('eco_mode_enabled')}</Text>
            </View>
          )}

          {settings.ecoMode && (
            <View style={styles.airQualitySection}>
              <Text style={styles.sectionTitle}>{t('air_quality')}</Text>
              {airQuality ? (
                Object.entries(airQuality.iaqi || {}).map(([key, value]) =>
                  value?.v ? (
                    <View key={key}>
                      <View style={styles.parameterItem}>
                        <Text style={styles.parameterName}>
                          {t(`air_parameters.${key}`)}
                        </Text>
                        <Text style={styles.parameterValue}>{value.v}</Text>
                      </View>
                      <View style={styles.divider} />
                    </View>
                  ) : null,
                )
              ) : (
                <Text>{t('no_air_data')}</Text>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder={t('search_placeholder')}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>{t('search_button')}</Text>
        </TouchableOpacity>
      </View>

      <MapView
        style={styles.map}
        region={region}
        onPress={handleMapPress}
        ref={mapRef}
      >
        <UrlTile
          urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
          tileSize={256}
        />
        {markers.map((marker) => (
          <Marker
            coordinate={marker.coordinates}
            pinColor="#2196F3"
            key={marker.id}
            onPress={() => handleMarkerPress(marker)}
          />
        ))}
      </MapView>

      {isPanelOpen &&
        (selectedMarker || selectedCoords) &&
        renderWeatherPanel()}

      <View style={styles.attribution}>
        <Text style={styles.attributionText}>{t('osm_attribution')}</Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  searchContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    zIndex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  searchInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  searchButton: {
    padding: 12,
    backgroundColor: '#2196F3',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  panel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 25,
    paddingBottom: 40,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  coordsText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginLeft: 10,
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginLeft: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  additionalInfo: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2196F3',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#2196F340',
    marginVertical: 4,
  },
  attribution: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 4,
    borderRadius: 4,
  },
  attributionText: {
    fontSize: 12,
    color: '#333',
  },
  ecoModeMessage: {
    backgroundColor: '#2196F31A',
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  ecoModeText: {
    fontSize: 14,
    color: '#2196F3',
  },
  airQualitySection: {
    marginTop: 20,
  },
  parameterItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  parameterName: {
    fontSize: 14,
    color: '#333',
    flex: 2,
  },
  parameterValue: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    textAlign: 'right',
  },
});

export default WeatherMap;
