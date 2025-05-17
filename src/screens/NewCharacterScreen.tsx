import { useNavigation } from '@react-navigation/native';
import React, { useRef, useState, useEffect } from 'react';
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

// Datos de las razas
const races = [
  {
    key: 'enano',
    name: 'Enano',
    image: require('../assets/races/enano.png'),
    stats: {
      altura: '1.4 m',
      peso: '70 kg',
      atributo1: 'Fuerza',
      atributo2: 'Constitución',
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
      atributo1: 'Destreza',
      atributo2: 'Inteligencia',
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
      atributo1: 'Voluntad',
      atributo2: 'Inteligencia',
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
      atributo1: 'Destreza',
      atributo2: 'Agilidad',
      puntosExtra: 2,
      vida: 19,
      poder: 6,
    },
  },
];

// Lista de atributos y sus iconos
const ATTRIBUTES = [
  { key: 'Fuerza', icon: require('../assets/icons/strength.png') },
  { key: 'Agilidad', icon: require('../assets/icons/agility.png') },
  { key: 'Destreza', icon: require('../assets/icons/dexterity.png') },
  { key: 'Inteligencia', icon: require('../assets/icons/intelligence.png') },
  { key: 'Voluntad', icon: require('../assets/icons/willpower.png') },
  { key: 'Constitución', icon: require('../assets/icons/constitution.png') },
];

// Construye los atributos iniciales de la raza seleccionada
type AttributeMap = { [key: string]: number };
function buildInitialAttributes(race: any): AttributeMap {
  const base: AttributeMap = {};
  ATTRIBUTES.forEach(attr => {
    let bonus = 0;
    if (race.stats.atributo1.toLowerCase() === attr.key.toLowerCase()) bonus++;
    if (race.stats.atributo2.toLowerCase() === attr.key.toLowerCase()) bonus++;
    base[attr.key] = -2 + bonus;
  });
  return base;
}

export default function NewCharacterScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [step, setStep] = useState(1); // 1 = seleccionar raza, 2 = repartir atributos

  const [selectedIndex, setSelectedIndex] = useState(0);
  const flatListRef = useRef<FlatList<any>>(null);

  // Los atributos y puntos disponibles SIEMPRE dependen de la raza seleccionada
  const [attributes, setAttributes] = useState(() => buildInitialAttributes(races[0]));
  const [points, setPoints] = useState(4);

  // Cuando cambia la raza (o vuelves al paso 1), recalcula los valores base
  useEffect(() => {
    if (step === 1) {
      setAttributes(buildInitialAttributes(races[selectedIndex]));
      setPoints(4);
    }
  }, [selectedIndex, step]);

  // Función para sumar puntos a un atributo
  const increment = (attrKey: any) => {
    if (points > 0) {
      setAttributes(prev => ({ ...prev, [attrKey]: prev[attrKey] + 1 }));
      setPoints(p => p - 1);
    }
  };

  // Función para restar puntos a un atributo (no puede bajar del mínimo)
  const decrement = (attrKey: any) => {
    const race = races[selectedIndex];
    const bonus =
      (race.stats.atributo1.toLowerCase() === attrKey.toLowerCase() ? 1 : 0) +
      (race.stats.atributo2.toLowerCase() === attrKey.toLowerCase() ? 1 : 0);
    const min = -2 + bonus;
    if (attributes[attrKey] > min) {
      setAttributes(prev => ({ ...prev, [attrKey]: prev[attrKey] - 1 }));
      setPoints(p => p + 1);
    }
  };

  const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setSelectedIndex(index);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity
          onPress={() => step === 1 ? navigation.goBack() : setStep(1)}
          style={styles.backButton}
        >
          <Image source={backIcon} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Creación de personajes</Text>
        <View style={styles.backButton} />
      </View>

      {step === 1 ? (
        // Paso 1: Selección de raza
        <>
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

          <TouchableOpacity style={styles.nextButton} onPress={() => setStep(2)}>
            <Text style={styles.nextText}>Siguiente</Text>
          </TouchableOpacity>
        </>
      ) : (
        // Paso 2: Reparto de atributos
        <>
          <Text style={styles.title}>Distribuye tus puntos de atributo</Text>
          <Text style={styles.points}>Puntos restantes: {points}</Text>
          <View style={styles.attributesList}>
            {ATTRIBUTES.map(attr => {
              const race = races[selectedIndex]; // ¡Aquí usamos la raza seleccionada!
              const bonus =
                (race.stats.atributo1.toLowerCase() === attr.key.toLowerCase() ? 1 : 0) +
                (race.stats.atributo2.toLowerCase() === attr.key.toLowerCase() ? 1 : 0);
              const min = -2 + bonus;
              return (
                <View key={attr.key} style={styles.attributeCard}>
                  <Image source={attr.icon} style={styles.icon} />
                  <Text style={styles.attrName}>{attr.key}</Text>
                  <View style={styles.valueRow}>
                    <TouchableOpacity
                      onPress={() => decrement(attr.key)}
                      style={[
                        styles.arrow,
                        attributes[attr.key] <= min && styles.arrowDisabled
                      ]}
                      disabled={attributes[attr.key] <= min}
                    >
                      <Text style={styles.arrowText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.attrValue}>{attributes[attr.key]}</Text>
                    <TouchableOpacity
                      onPress={() => increment(attr.key)}
                      style={[styles.arrow, points <= 0 && styles.arrowDisabled]}
                      disabled={points <= 0}
                    >
                      <Text style={styles.arrowText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
          <TouchableOpacity
            style={[styles.nextButton, points > 0 && { opacity: 0.5 }]}
            onPress={() => {
              // Guardar atributos, crear personaje, o navegar al siguiente paso
            }}
            disabled={points > 0}
          >
            <Text style={styles.nextText}>Finalizar</Text>
          </TouchableOpacity>
        </>
      )}
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
  // --------- NUEVOS estilos para el paso 2 ----------
  title: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16
  },
  points: {
    color: '#c20e0d',
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 8
  },
  attributesList: {
    flexDirection: 'row', 
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 16
  },
  attributeCard: {
    width: '45%',
    backgroundColor: '#22252B',
    margin: 8,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 4,
  },
  icon: {
    width: 40,
    height: 40,
    marginBottom: 8
  },
  attrName: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 6
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  attrValue: {
    color: '#FFF',
    fontSize: 20,
    marginHorizontal: 12,
    fontWeight: 'bold'
  },
  arrow: {
    backgroundColor: '#444',
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center'
  },
  arrowDisabled: {
    backgroundColor: '#222'
  },
  arrowText: {
    color: '#FFF',
    fontSize: 20
  },
});

