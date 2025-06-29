import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { api } from '../api/api'; // api.js'den import ediyoruz

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Uygulama ilk açıldığında, cihazda kayıtlı token var mı diye kontrol et
    const loadUserFromStorage = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync('userToken');
        if (storedToken) {
          setToken(storedToken);
          // Token'ı axios'un default header'larına ekle
          api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          // TODO: Token ile kullanıcı bilgilerini yeniden çek
          // const { data } = await api.get('/users/profile');
          // setUser(data);
        }
      } catch (e) {
        console.error('Failed to load user from storage', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadUserFromStorage();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/users/login', { email, password });
      const { token, ...userData } = response.data;

      // Gelen token'ı axios'un default header'larına ekle
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Token'ı güvenli bir şekilde cihaza kaydet
      await SecureStore.setItemAsync('userToken', token);
      
      setToken(token);
      setUser(userData);

      return response.data; // Başarılı olursa veriyi döndür
    } catch (error) {
      // Hata durumunda hatayı fırlat ki LoginScreen'de yakalayabilelim
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Token'ı cihazdan sil
      await SecureStore.deleteItemAsync('userToken');
      
      // Axios header'larından token'ı kaldır
      delete api.defaults.headers.common['Authorization'];
      
      setToken(null);
      setUser(null);
    } catch (e) {
      console.error('Failed to logout', e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};