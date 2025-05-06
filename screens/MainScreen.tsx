import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGradient } from '../context/GradientContext';
import WeatherHeader from '../components/WeatherHeader';
import WeatherDetails from '../components/WeatherDetails';
import { useFocusEffect } from '@react-navigation/native';
import {
  getHumidityStatus,
  getPressureStatus,
  getUVStatus,
  getWindDirection,
} from '../utils/weatherUtils';
import { useTranslation } from 'react-i18next';
import { useWeather } from '../hooks/useWeather';
import LoadingIndicator from '../components/LoadingIndicator';
import { LocationContext } from '../context/LocationContext';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getGradient } from '../utils/weatherUtils';

const { height } = Dimensions.get('window');

function MainScreen() {
  const { city, locationLoaded, updateLocation } = useContext(LocationContext);
  const { weather, loading, refresh } = useWeather(city || 'Москва');
  const [customCity, setCustomCity] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const { t, i18n } = useTranslation();
  const gradient = useGradient();
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = useState(new Animated.Value(-250))[0];
  const [savedCities, setSavedCities] = useState([]);

  useEffect(() => {
    if (customCity || city) {
      refresh();
    }
    loadSavedCities();
  }, [customCity, city]);

  const closeMenu = () => {
    // Плавно анимируем скрытие меню
    Animated.timing(slideAnim, {
      toValue: -250,
      duration: 300,
      useNativeDriver: false,
    }).start();
    // Обновляем состояние после анимации
    setMenuVisible(false);
  };

  // Открытие меню с анимацией
  const openMenu = () => {
    setMenuVisible(true); // Обновляем состояние на открытое меню
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  // Загрузка сохранённых городов
  const loadSavedCities = async () => {
    try {
      const json = await AsyncStorage.getItem('weatherMarkers');
      const markers = json ? JSON.parse(json) : [];

      const cityObjects = await Promise.all(
        markers.map(async (marker) => {
          try {
            const res = await fetch(
              `https://api.opencagedata.com/geocode/v1/json?q=${marker.coordinates.latitude}+${marker.coordinates.longitude}&language=${i18n.language}&key=8c19fc4500d448af89913363ee5699a2`,
            );
            const data = await res.json();
            const comp = data.results[0]?.components || {};
            const name = comp.city || comp.town || comp.village || 'Неизвестно';
            return { name, coordinates: marker.coordinates };
          } catch (e) {
            return {
              name: 'Ошибка геокодинга',
              coordinates: marker.coordinates,
            };
          }
        }),
      );

      setSavedCities(cityObjects);
    } catch (e) {
      console.error('Ошибка при загрузке городов из AsyncStorage:', e);
    }
  };

  // Обновление погоды
  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      loadSavedCities();
    }, [i18n.language]),
  );

  // Переключение меню
  const toggleMenu = () => {
    if (menuVisible) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  // Обработка выбора локации
  const handleLocationSelect = (item) => {
    if (item) {
      setCustomCity({ ...item, name: item.name });
      updateLocation(item.name);
    }
    else{
        setCustomCity(null);
     updateLocation();
     }
    closeMenu(); // Закрываем меню сразу после выбора города
  };

  if (loading || !locationLoaded || !weather) return <LoadingIndicator />;

  const currentCityName = customCity?.name || city;

  return (
    <LinearGradient
      colors={gradient}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {menuVisible && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={toggleMenu}
        />
      )}

      {!menuVisible && (
        <TouchableOpacity onPress={toggleMenu} style={styles.menuIcon}>
          <Ionicons name="menu" size={28} color="#fff" />
        </TouchableOpacity>
      )}

      <Animated.View style={[styles.drawer, { left: slideAnim }]}>
        <Text style={styles.drawerTitle}>📍 {currentCityName}</Text>
        <View style={styles.menuDivider} />
        <Text style={styles.sectionTitle}>🏙 {t("interface.savedLocations")}</Text>
        <Pressable
          onPress={() => handleLocationSelect()}
          style={({ pressed }) => [
            styles.cityItem,
            pressed && styles.cityItemPressed,
            !customCity && styles.cityItemActive, // активна, если нет кастомного города
          ]}
        >
          <Text style={styles.cityText}>{t("interface.currentLocation")}</Text>
        </Pressable>
        {savedCities.length > 0 ? (
          savedCities.map((item, index) => (
            <Pressable
              key={index}
              onPress={() => handleLocationSelect(item)} // Вызываем функцию выбора локации
              style={({ pressed }) => [
                styles.cityItem,
                pressed && styles.cityItemPressed,
                customCity?.name === item.name && styles.cityItemActive,
              ]}
            >
              <Text style={styles.cityText}>📍 {item.name}</Text>
            </Pressable>
          ))
        ) : (
          <Text style={styles.menuItem}>Нет сохранённых локаций</Text>
        )}
      </Animated.View>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#fff"
            colors={['#fff']}
          />
        }
      >
        <WeatherHeader
          city={currentCityName}
          temp={weather.temp_c}
          icon={weather.condition.icon}
          condition={weather.condition.text}
        />

        <WeatherDetails
          cards={[
            {
              icon: 'weather-windy',
              title: t('interface.wind'),
              value: `${weather.wind_kph} км/ч`,
              description: getWindDirection(weather.wind_dir, t),
            },
            {
              icon: 'water-percent',
              title: t('interface.humidity'),
              value: `${weather.humidity}%`,
              description: getHumidityStatus(weather.humidity, t),
            },
            {
              icon: 'gauge',
              title: t('interface.pressure'),
              value: `${weather.pressure_mb} гПа`,
              description: getPressureStatus(weather.pressure_mb, t),
            },
          ]}
        />

        <WeatherDetails
          cards={[
            {
              icon: 'weather-sunny-alert',
              title: t('interface.uv'),
              value: String(weather.uv),
              description: getUVStatus(weather.uv, t),
            },
            {
              icon: 'weather-cloudy',
              title: t('interface.cloud'),
              value: `${weather.cloud}%`,
            },
            {
              icon: 'weather-pouring',
              title: t('interface.precip'),
              value: `${weather.precip_mm} мм`,
            },
          ]}
        />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: height,
  },
  content: {
    padding: 20,
    paddingTop: 80,
  },
  menuIcon: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 250,
    height: '100%',
    backgroundColor: 'white',
    paddingTop: 20,
    paddingHorizontal: 20,
    zIndex: 6,
  },
  drawerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34495e',
    marginTop: 10,
    marginBottom: 15,
  },
  menuItem: {
    color: 'black',
    fontSize: 16,
    marginBottom: 10,
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 5,
  },
  cityItem: {
    backgroundColor: '#f4f4f4',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cityItemPressed: {
    backgroundColor: '#ddd',
  },
  cityItemActive: {
    backgroundColor: '#a0d2eb',
  },
  cityText: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
  },
});

export default MainScreen;
