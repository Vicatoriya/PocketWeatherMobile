import React, { useState, useRef, useEffect } from 'react';
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
import { useContext } from 'react';

type WeatherMarker = {
  id: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  weatherData?: CurrentWeatherResponse | null;
};

const DEFAULT_COORDS = {
  latitude: 55.7558,
  longitude: 37.6173,
};

const WeatherMap = () => {
  const [markers, setMarkers] = useState<WeatherMarker[]>([]);
  const { latitude, longitude, locationLoaded } = useContext(LocationContext);
  const [searchQuery, setSearchQuery] = useState('');
  const mapRef = useRef<MapView>(null);
  const [selectedMarker, setSelectedMarker] = useState<WeatherMarker | null>(
    null,
  );

  const [region, setRegion] = useState({
    latitude: DEFAULT_COORDS.latitude,
    longitude: DEFAULT_COORDS.longitude,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  });

  useEffect(() => {
    if (latitude && longitude) {
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
      });
    }
  }, [latitude, longitude]);

  const handleSearch = async () => {
    try {
      console.log(searchQuery);
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
        setRegion(newCoords);
        mapRef.current?.animateToRegion(newCoords, 1000);
      } else {
        Alert.alert('Ошибка', 'Местоположение не найдено');
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Проблема с поиском');
    }
  };

  const handleMapPress = async (e: MapPressEvent) => {
    if (selectedMarker) {
      setSelectedMarker(null);
    } else {
      const { coordinate } = e.nativeEvent;
      const newMarker: WeatherMarker = {
        id: Date.now().toString(),
        coordinates: {
          latitude: coordinate.latitude,
          longitude: coordinate.longitude,
        },
        weatherData: null,
      };
      setMarkers((prev) => [...prev, newMarker]);
    }
  };

  const coordsString = selectedMarker
    ? `${selectedMarker.coordinates.latitude},${selectedMarker.coordinates.longitude}`
    : '';
  const { weather, loading, error, refresh } = useWeather(coordsString);

  const handleMarkerPress = (marker: WeatherMarker) => {
    setSelectedMarker(marker);
    console.log('Selected marker latitude' + marker.coordinates.latitude);
  };

  const handleAddButtonPress = () => {
    if (selectedMarker) {
      console.log('Добавление маркера с координатами:', {
        lat: selectedMarker.coordinates.latitude,
        lng: selectedMarker.coordinates.longitude,
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Поиск места..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Найти</Text>
        </TouchableOpacity>
      </View>
      <MapView style={styles.map} region={region} onPress={handleMapPress}>
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
          ></Marker>
        ))}
      </MapView>
      {selectedMarker && (
        <View style={styles.panel}>
          <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.rowContainer}>
              <Text style={styles.coordsText}>
                [{selectedMarker.coordinates.latitude.toFixed(4)},{' '}
                {selectedMarker.coordinates.longitude.toFixed(4)}]
              </Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddButtonPress}
              >
                <Text style={styles.addButtonText}>Добавить</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.additionalInfo}>
              <Text style={styles.sectionTitle}>Информация:</Text>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Температура</Text>
                <Text style={styles.infoValue}>{weather?.temp_c}С</Text>
              </View>
              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Влажность</Text>
                <Text style={styles.infoValue}>{weather?.humidity}%</Text>
              </View>
              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Скорость ветра</Text>
                <Text style={styles.infoValue}>{weather?.wind_kph}км/ч</Text>
              </View>
            </View>
          </ScrollView>
        </View>
      )}
      <View style={styles.attribution}>
        <Text style={styles.attributionText}>
          © OpenStreetMap contributors
        </Text>
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
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginLeft: 10,
  },
  addButtonText: {
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
});

export default WeatherMap;
