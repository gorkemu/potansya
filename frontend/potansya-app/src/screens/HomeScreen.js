import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, FlatList, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { api } from '../api/api';

const HomeScreen = () => {
  const { logout } = useAuth();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPotentialRoles = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/nexus/generate');
        setRoles(data.roles);
      } catch (error) {
        console.error('Roller getirilirken hata:', error);
        Alert.alert('Hata', 'Potansiyel rolleriniz getirilirken bir sorun oluştu.');
      } finally {
        setLoading(false);
      }
    };

    fetchPotentialRoles();
  }, []);

  const renderRole = ({ item }) => (
    <View style={styles.roleCard}>
      <Text style={styles.roleName}>{item.roleName} (%{item.suitabilityScore})</Text>
      <Text style={styles.roleDescription}>{item.description}</Text>
      <Text style={styles.roleConnections}>Anahtar Bağlantılar: {item.keyConnections.join(', ')}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>Potansiyeliniz hesaplanıyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={roles}
        renderItem={renderRole}
        keyExtractor={(item, index) => `${item.roleName}-${index}`}
        ListHeaderComponent={() => <Text style={styles.header}>Potansiyel Evreniniz</Text>}
        ListFooterComponent={() => <Button title="Çıkış Yap" onPress={logout} color="red" />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, paddingTop: 50, paddingHorizontal: 10 },
  header: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  roleCard: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  roleName: { fontSize: 18, fontWeight: 'bold' },
  roleDescription: { fontSize: 14, color: '#555', marginVertical: 5 },
  roleConnections: { fontSize: 12, fontStyle: 'italic', color: '#777' },
});

export default HomeScreen;