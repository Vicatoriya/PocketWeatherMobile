import React, { useContext } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { SettingsContext } from '@/context/SettingsContext';
import LanguageToggle from '../components/LanguageToggle';
import { useTranslation } from 'react-i18next';

const SettingsScreen = () => {
  const { t } = useTranslation();
  const { settings, toggleEcoMode, toggleDachaMode, loaded } =
    useContext(SettingsContext);

  if (!loaded) {
    return <LoadingIndicator />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.settingItem}>
        <Text style={styles.settingText}>{t('settings.ecoMode')}</Text>
        <Switch
          value={settings.ecoMode}
          onValueChange={toggleEcoMode}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={settings.ecoMode ? '#2196F3' : '#f4f3f4'}
        />
      </View>
      <View style={styles.divider} />

      <View style={styles.settingItem}>
        <Text style={styles.settingText}>{t('settings.dachaMode')}</Text>
        <Switch
          value={settings.dachaMode}
          onValueChange={toggleDachaMode}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={settings.dachaMode ? '#2196F3' : '#f4f3f4'}
        />
      </View>
      <View style={styles.divider} />

      <LanguageToggle />
      <View style={styles.divider} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  settingText: {
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#2196F340',
    marginVertical: 4,
  },
});

export default SettingsScreen;
