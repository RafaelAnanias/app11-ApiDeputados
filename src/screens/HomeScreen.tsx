import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TextInput, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';

interface Deputado {
  id: number;
  nome: string;
  siglaPartido: string;
  siglaUf: string;
  urlFoto: string;
}

export default function HomeScreen({ navigation }: any) {
  const [deputados, setDeputados] = useState<Deputado[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Busca inicial dos deputados
  useEffect(() => {
    fetchDeputados();
  }, []);

  const fetchDeputados = async (nomeFiltro = '') => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://dadosabertos.camara.leg.br/api/v2/deputados?nome=${nomeFiltro}&ordem=ASC&ordenarPor=nome&itens=50`
      );
      setDeputados(response.data.dados);
    } catch (error) {
      console.error("Erro ao buscar deputados:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text: string) => {
    setSearch(text);
    fetchDeputados(text);
  };

  const renderItem = ({ item }: { item: Deputado }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => navigation.navigate('Details', { id: item.id })}
    >
      <Image source={{ uri: item.urlFoto }} style={styles.avatar} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{item.nome}</Text>
        <Text style={styles.subtleText}>{item.siglaPartido} - {item.siglaUf}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Buscar parlamentar por nome..."
        value={search}
        onChangeText={handleSearch}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#000" style={{ flex: 1 }} />
      ) : (
        <FlatList
          data={deputados}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={<Text style={styles.emptyText}>Nenhum parlamentar encontrado.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  searchBar: {
    height: 45,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginVertical: 16,
    fontSize: 15,
    backgroundColor: '#f9f9f9',
  },
  card: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e0e0e0',
  },
  infoContainer: {
    marginLeft: 16,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  subtleText: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 40,
  }
});