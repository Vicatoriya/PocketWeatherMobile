import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SettingsContext } from '@/context/SettingsContext';
import { useTranslation } from 'react-i18next';

const LanguageToggle = () => {
  const { t } = useTranslation();
  const { settings, setLanguage } = useContext(SettingsContext);
  const currentLang = settings.language;

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{t('settings.language')}</Text>
      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.button, currentLang === 'ru' && styles.selected]}
          onPress={() => setLanguage('ru')}
        >
          <Text
            style={[
              styles.buttonText,
              currentLang === 'ru' && styles.selectedText,
            ]}
          >
            RU
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, currentLang === 'en' && styles.selected]}
          onPress={() => setLanguage('en')}
        >
          <Text
            style={[
              styles.buttonText,
              currentLang === 'en' && styles.selectedText,
            ]}
          >
            EN
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  label: {
    fontSize: 16,
    marginRight: 10,
    flex: 1,
  },
  buttons: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#2196F3',
    borderRadius: 8,
  },
  selected: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: '#000',
    fontSize: 14,
  },
  selectedText: {
    color: '#fff',
  },
});

export default LanguageToggle;
