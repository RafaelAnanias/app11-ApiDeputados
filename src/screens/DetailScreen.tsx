import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import axios from 'axios';

interface DetalhesDeputado {
  nomeCivil: string;
  ufNascimento: string;
  dataNascimento: string;
  email: string;
  ultimoStatus: {
    gabinete: {
      nome: string;
      telefone: string;
      email: string;
    }
  }
}
export default function DetailScreen({ route }: any) {
  const { id } = route.params;
  const [detalhes, setDetalhes] = useState<DetalhesDeputado | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetalhes = async () => {
      try {
        const response = await axios.get(`https://dadosabertos.camara.leg.br/api/v2/deputados/${id}`);
        setDetalhes(response.data.dados);
      } catch (error) {
        console.error("Erro ao buscar detalhes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetalhes();
  }, [id]);

  if (loading) {
    return <ActivityIndicator size="large" color="#000" style={{ flex: 1, backgroundColor: '#fff' }} />;
  }

  if (!detalhes) {
    return (
      <View style={styles.center}>
        <Text>Não foi possível carregar os detalhes.</Text>
      </View>
    );
  }
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.nomeCivil}>{detalhes.nomeCivil}</Text>
        <Text style={styles.subtitulo}>Dados Parlamentares</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>E-mail Institucional:</Text>
        <Text style={styles.value}>{detalhes.ultimoStatus.gabinete.email || 'Não informado'}</Text>

        <Text style={styles.label}>Gabinete:</Text>
        <Text style={styles.value}>Prédio {detalhes.ultimoStatus.gabinete.nome}</Text>

        <Text style={styles.label}>Telefone:</Text>
        <Text style={styles.value}>(61) {detalhes.ultimoStatus.gabinete.telefone || 'Não informado'}</Text>

        <Text style={styles.label}>UF de Nascimento:</Text>
        <Text style={styles.value}>{detalhes.ufNascimento || 'Não informada'}</Text>

        <Text style={styles.label}>Data de Nascimento:</Text>
        <Text style={styles.value}>
          {detalhes.dataNascimento ? new Date(detalhes.dataNascimento).toLocaleDateString('pt-BR') : 'Não informada'}
        </Text>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 16,
  },
  nomeCivil: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
  },
  subtitulo: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  infoBox: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#777',
    textTransform: 'uppercase',
    marginTop: 12,
  },
  value: {
    fontSize: 16,
    color: '#333',
    marginTop: 2,
  }
});