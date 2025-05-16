import { useNavigation } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height, width } = Dimensions.get('window');
const IMAGE_HEIGHT = height * 0.6;
const backIcon = require('../assets/icons/arrow-back.png');

// Datos de las razas (ajusta rutas de imagen y estadísticas)
const races = [
  {
    key: 'enano',
    name: 'Enano',
    image: require('../assets/races/enano.png'),
    stats: {
      altura: '1.4 m',
      peso: '70 kg',
      atributo1: 'Fuerza: 12',
      atributo2: 'Constitución: 14',
      puntosExtra: 2,
      vida: 20,
      poder: 5,
    },
  },
  {
    key: 'elfo',
    name: 'Elfo',
    image: require('../assets/races/elfo.png'),
    stats: {
      altura: '1.8 m',
      peso: '60 kg',
      atributo1: 'Destreza: 12',
      atributo2: 'Sabiduría: 14',
      puntosExtra: 2,
      vida: 18,
      poder: 7,
    },
  },
  {
    key: 'mediano',
    name: 'Mediano',
    image: require('../assets/races/mediano.png'),
    stats: {
      altura: '1.2 m',
      peso: '50 kg',
      atributo1: 'Suerte: 12',
      atributo2: 'Sigilo: 14',
      puntosExtra: 2,
      vida: 16,
      poder: 6,
    },
  },
  {
    key: 'humano',
    name: 'Humano',
    image: require('../assets/races/humano.png'),
    stats: {
      altura: '1.7 m',
      peso: '65 kg',
      atributo1: 'Carisma: 12',
      atributo2: 'Inteligencia: 14',
      puntosExtra: 2,
      vida: 19,
      poder: 6,
    },
  },
];

export default function NewCharacterScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const flatListRef = useRef<FlatList<any>>(null);

  const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setSelectedIndex(index);
  };

  const goNext = () => {
    /* navigation.navigate('NewCharacterStep2', {
      raceKey: races[selectedIndex].key
    }); */
  };

  return (
    <View style={styles.container}>
      {/* ——— HEADER ——— */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Image source={backIcon} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Creación de personajes</Text>
        <View style={styles.backButton} />
      </View>

      {/* ——— SLIDER DE RAZAS ——— */}
      <FlatList
        ref={flatListRef}
        data={races}
        keyExtractor={(item) => item.key}
        horizontal
        pagingEnabled
        decelerationRate="fast"
        snapToAlignment="center"
        snapToInterval={width}
        showsHorizontalScrollIndicator={false}
        style={{ height: IMAGE_HEIGHT }}
        contentContainerStyle={{ alignItems: 'center' }}
        renderItem={({ item }) => (
          <View style={[styles.page, { width }]}>
            <Image
              source={item.image}
              style={styles.raceImage}
              resizeMode="contain"
            />
            <Text style={styles.raceName}>{item.name}</Text>
          </View>
        )}
        onMomentumScrollEnd={onMomentumScrollEnd}
      />

      {/* ——— ESTADÍSTICAS ——— */}
      <View style={styles.statsContainer}>
        <Text style={styles.statLabel}>
          Altura: {races[selectedIndex].stats.altura}
        </Text>
        <Text style={styles.statLabel}>
          Peso: {races[selectedIndex].stats.peso}
        </Text>
        <Text style={styles.statLabel}>
          {races[selectedIndex].stats.atributo1}
        </Text>
        <Text style={styles.statLabel}>
          {races[selectedIndex].stats.atributo2}
        </Text>
        <Text style={styles.statLabel}>
          Puntos extra: {races[selectedIndex].stats.puntosExtra}
        </Text>
        <Text style={styles.statLabel}>
          Puntos de vida: {races[selectedIndex].stats.vida}
        </Text>
        <Text style={styles.statLabel}>
          Puntos de poder: {races[selectedIndex].stats.poder}
        </Text>
      </View>

      {/* ——— BOTÓN SIGUIENTE ——— */}
      <TouchableOpacity style={styles.nextButton} onPress={goNext}>
        <Text style={styles.nextText}>Siguiente</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121619',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#121619',
    paddingHorizontal: 12,
  },
  backButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: '#FFF',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    color: '#FFF',
  },
  page: {
    alignItems: 'center',
    justifyContent: 'center',
    height: IMAGE_HEIGHT,
  },
  raceImage: {
    width,
    height: IMAGE_HEIGHT,
  },
  raceName: {
    marginTop: 12,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  statsContainer: {
    padding: 16,
    backgroundColor: '#1E2126',
  },
  statLabel: {
    fontSize: 16,
    color: '#EEE',
    marginBottom: 4,
  },
  nextButton: {
    margin: 16,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#c20e0d',
    alignItems: 'center',
  },
  nextText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
