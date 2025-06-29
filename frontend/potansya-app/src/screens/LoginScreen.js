import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, TextInput, Alert } from 'react-native';
import { useAuth } from '../hooks/useAuth'; // Kendi hook'umuzu import ediyoruz

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // AuthContext'ten login fonksiyonunu ve diğer değerleri alıyoruz
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return;
    }

    setLoading(true);
    try {
      // Artık doğrudan context'teki login fonksiyonunu çağırıyoruz
      await login(email, password);
      // Başarılı olursa, AppNavigator bizi otomatik olarak ana ekrana yönlendirecek.
      // Bu yüzden burada bir şey yapmamıza gerek yok.
    } catch (error) {
      console.error('Giriş Hatası:', error);
      Alert.alert('Giriş Başarısız', 'E-posta veya şifre hatalı.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Potansya</Text>
      
      <TextInput
        style={styles.input}
        placeholder="E-posta"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Şifre"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button 
        title={loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'} 
        onPress={handleLogin}
        disabled={loading}
      />
    </View>
  );
};

// Styles kısmı aynı kalabilir...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
  },
});

export default LoginScreen;