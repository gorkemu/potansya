import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../hooks/useAuth'; // useAuth hook'unu import et
import { View, ActivityIndicator, StyleSheet } from 'react-native';

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  // AuthContext'ten token ve isLoading durumlarını al
  const { token, isLoading } = useAuth();

  // Eğer uygulama ilk açıldığında token'ı kontrol ediyorsak, bir yükleme ekranı göster
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {token ? (
          // Eğer token varsa (kullanıcı giriş yapmışsa), ana ekranları göster
          <Stack.Screen name="Home" component={HomeScreen} />
          // TODO: Buraya Profil, Ayarlar gibi diğer ekranlar eklenecek
        ) : (
          // Eğer token yoksa (kullanıcı giriş yapmamışsa), giriş ekranını göster
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ headerShown: false }} 
          />
          // TODO: Buraya Kayıt Ol ekranı eklenecek
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default AppNavigator;