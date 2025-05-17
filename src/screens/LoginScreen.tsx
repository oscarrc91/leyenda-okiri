import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Facebook from 'expo-auth-session/providers/facebook';
import * as Google from 'expo-auth-session/providers/google';
import { LinearGradient } from 'expo-linear-gradient';
import { Gyroscope } from 'expo-sensors';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  Keyboard,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../AppNavigator';
import DustOverlay from '../components/DustOverlay';
import { useBanner } from '../contexts/BannerContext';
import { loginUser, registerUser } from '../services/auth';

const appleIcon = require('../assets/images/apple_logo_icon.png');
const backgroundImage = require('../assets/images/background_art.png');
const flareImage = require('../assets/images/lens_flare.png');
const fbIcon = require('../assets/images/fb_logo_icon.png');
const googleIcon = require('../assets/images/google_logo_icon.png');
const logoImage = require('../assets/images/logo.png');

const { width, height } = Dimensions.get('window');
const AnimatedImageBackground = Animated.createAnimatedComponent(ImageBackground);
const AnimatedLensFlare = Animated.createAnimatedComponent(ImageBackground);

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;


type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Login'
>;

export default function LoginScreen({route}: Props) {
  const [message, setMessage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail]   = useState('');
  const [pass, setPass]     = useState('');
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const insets = useSafeAreaInsets();
  const showBanner = useBanner();
  const emailInputRef = useRef<TextInput>(null);
  const [shouldFocusEmail, setShouldFocusEmail] = useState(false);
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const redirectUri = 'https://auth.expo.dev/@oscar_rc91/leyenda-okiri';
  // console.log('🔗 Redirect URI (proxy):', redirectUri);

  // OAuth setup (añade tus client IDs)
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '79769124512-f3vrulos4buckvhkj8fj3ldg9fconth6.apps.googleusercontent.com',
    // iosClientId: '79769124512-hd2bunjl7411gup4mcv70tog0upkcf20.apps.googleusercontent.com',
    // androidClientId: '79769124512-t5b2qb7bjqtrhlbm3i1i8j09gl2p5qp5.apps.googleusercontent.com',
    // webClientId: '79769124512-f3vrulos4buckvhkj8fj3ldg9fconth6.apps.googleusercontent.com',
    redirectUri,
    scopes: ['profile', 'email'],
  });
  const [, fbResponse, fbPrompt] = Facebook.useAuthRequest({
    clientId: '<TU_FB_APP_ID>',
  });

  useEffect(() => {
    if (request) {
      // console.log('🔗 Google Auth URL:', request.url);
    }
  }, [request]);

  useEffect(() => {
    if (response?.type === 'success') {
      // manejar respuesta de Google...
    }
    if (fbResponse?.type === 'success') {
      // manejar respuesta de Facebook...
    }
  }, [response, fbResponse]);

  useEffect(() => {
  if (route.params?.openEmailModal) {
    if (route.params.email) {
      setEmail(route.params.email);
    }

    setShowModal(true);
    setShouldFocusEmail(true);  

    // Muestro un banner de éxito
    showBanner({
      icon: require('../assets/images/pass_icon.png'),
      children: (
        <>
          {/* Need help? <Text style={{ fontWeight:'bold' }}>Contact our support</Text> */}
          <Text style={{ fontWeight: '600' }}>
            <Text style={{ fontWeight: 'bold' }}>Contraseña</Text> cambiada correctamente
          </Text>
        </>
      ),
      onPress: () => { /* navegar a soporte */ },
      duration: 5000, // opcional
    });

    navigation.setParams({ openEmailModal: false, email: undefined });
  }
}, [route.params]);

  // Handlers del modal
  const handleRegister = async () => {
    Keyboard.dismiss();
    setMessage(null);
    if (!email.trim() || !pass) {
      return setMessage('Rellena ambos campos');
    }
    if (!isValidEmail(email.trim())) {
      return setMessage('No es un email válido');
    }
    const result = await registerUser(email.trim(), pass);
    if (result.success) {
      setMessage('Registro correcto ✅');
      setTimeout(() => setShowModal(false), 800);
      navigation.navigate('Main', { email });
    } else {
      setMessage(result.error!);
    }
  };
  const handleLogin = async () => {
    if (!email || !pass) return setMessage('Rellena ambos campos');
    const ok = await loginUser(email, pass);
    setMessage(ok ? '¡Bienvenido! 🎉' : 'Credenciales inválidas ❌');
    if (ok) {
      setShowModal(false);
      navigation.navigate('Main', { email });
    }
  };

  const FLARE_DEPTH = 2.0; 
  // Animated values para el desplazamiento X/Y
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  // Multiplica tus valores de fondo por ese factor para el flare
  const flareX = Animated.multiply(translateX, FLARE_DEPTH);
  const flareY = Animated.multiply(translateY, FLARE_DEPTH);
  const flareTranslateX = translateX.interpolate({
    inputRange: [-30, 0, 30],
    outputRange: [-100, 0, 100],   // antes era [-15,0,15], ahora más fuerte
    extrapolate: 'clamp',
  });
  const flareTranslateY = translateY.interpolate({
    inputRange: [-30, 0, 30],
    outputRange: [-70, 0, 70],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    Gyroscope.setUpdateInterval(100) // 10 lecturas por segundo
    const sub = Gyroscope.addListener(({ x, y }) => {
      // x = rotación alrededor del eje X (inclinación adelante/atrás)
      // y = rotación alrededor del eje Y (inclinación izquierda/derecha)
      const offsetX = y * -6; // multiplica por -10 para invertir el movimiento
      const offsetY = x *  6; // multiplica por  10 para proyectar en Y
      Animated.spring(translateX, {
        toValue: offsetX,
        useNativeDriver: true,
        stiffness: 100,    // default 100 igual o mayor
        damping: 10,      // default 10–20
        mass: 1,
        overshootClamping: true,
      }).start();
      Animated.spring(translateY, {
        toValue: offsetY,
        useNativeDriver: true,
        stiffness: 100,
        damping: 10,
        mass: 1,
        overshootClamping: true,
      }).start();
    });
    return () => sub.remove()
  }, [])






  return (
    <View style={styles.container}>
      
      <AnimatedImageBackground
        source={backgroundImage}
        style={[
          styles.background,
          {
            transform: [
              { translateX },
              { translateY },
            ]
          }
        ]}
        resizeMode="cover"
      />

      
      <AnimatedLensFlare
        source={flareImage}
        style={[
          styles.flare,
          {
            transform: [
              { translateX: flareTranslateX },
              { translateY: flareTranslateY },
            ],
            opacity: translateX.interpolate({
              inputRange: [-40, 0, 40],
              outputRange: [0.2, 0.6, 0.2],
              extrapolate: 'clamp',
            }),
          }
        ]}
        resizeMode="contain"
      />

      <SafeAreaView style={styles.overlay} edges={['top', 'left', 'right']}>
        <LinearGradient
          colors={['rgba(17, 20, 25, 0)', 'rgba(17, 20, 25, 0.77)']}
          locations={[0.2, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[StyleSheet.absoluteFill, styles.linearGradient]}
        />

        <DustOverlay />

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          bounces={false}
          overScrollMode="never"
          >
          <Image source={logoImage} style={styles.logo} />

          <TouchableOpacity
            style={[styles.button, styles.emailButton]}
            onPress={() => {
              setMessage(null);
              setShowModal(true);
            }}
          >
            <Text style={[styles.buttonText, styles.emailText]}>Continuar con email</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.appleButton]}
            onPress={async () => {
              navigation.navigate('NewCharacter');
              
              if (await AppleAuthentication.isAvailableAsync()) {
                const cred = await AppleAuthentication.signInAsync({
                  requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                  ],
                });
              }
            }}
          >
            <Image source={appleIcon} style={styles.icon} />
            <Text style={styles.buttonText}>Continuar con Apple</Text>
          </TouchableOpacity>

          <TouchableOpacity
            disabled={!request}
            onPress={() => promptAsync()}
            style={[styles.button, styles.googleButton]}
          >
            <Image source={googleIcon} style={styles.icon} />
            <Text style={styles.buttonTextWhite}>Continuar con Google</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.fbButton]}
            onPress={() => fbPrompt()}
          >
            <Image source={fbIcon} style={styles.icon} />
            <Text style={styles.buttonTextWhite}>Continuar con Facebook</Text>
          </TouchableOpacity>

          <View style={styles.separator} />

          <Text style={styles.termsText}>Al continuar, aceptas nuestros Términos de uso y Política de privacidad</Text>
        </ScrollView>

        <Modal
          visible={showModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowModal(false)}
          onShow={() => {
          if (shouldFocusEmail) {
            emailInputRef.current?.focus();
            setShouldFocusEmail(false);
          }
        }}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Continuar con email</Text>
              <TextInput
                ref={emailInputRef}
                style={styles.modalInput}   
                placeholder="Correo electrónico"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
              <TextInput
                style={styles.modalInput}
                placeholder="Contraseña"
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry
                value={pass}
                onChangeText={setPass}
              />
              <TouchableOpacity
                onPress={() => {
                  setShowModal(false);
                  navigation.navigate('ResetPassword');
                }}>
                <Text style={styles.forgotText}>He olvidado mi contraseña</Text>
              </TouchableOpacity>
              {message ? <Text style={styles.modalMessage}>{message}</Text> : null}
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.modalButton} onPress={handleRegister}>
                  <Text style={styles.modalButtonText}>Registrarse</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButton} onPress={handleLogin}>
                  <Text style={styles.modalButtonText}>Iniciar sesión</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => setShowModal(false)} style={styles.closeModal}>
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    width: width + 40,
    height: height + 40,
    marginLeft: -20,
    marginTop:  -20,
  },
  flare: {
    position: 'absolute',
    top: -140,
    left: -80,
    width: width * 2,
    height: width * 2,
    opacity: 1,
  },
  overlay: {
    flex: 1,
  },
  linearGradient: {
    width: width,
  },
  container: {
    flex: 1,
    overflow: 'visible',
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: '42%',
    paddingBottom: 40,
  },
  logo: {
    width: 250,
    height: 250,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 50,
    borderRadius: 8,
    marginVertical: 8,
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextWhite: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  emailButton: {
    backgroundColor: '#6B46C1',
  },
  emailText: {
    color: '#fff',
  },
  appleButton: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#CCC',
  },
  googleButton: {
    backgroundColor: '#4285F4',
  },
  fbButton: {
    backgroundColor: '#1877F2',
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 12,
    resizeMode: 'contain',
  },
  separator: {
    alignSelf: 'center',
    width: width,
    height: 1,
    backgroundColor: '#CCC',
    marginTop: 16,
  },
  message: {
    marginTop: 16,
    fontSize: 14,
    color: '#FFF',
    textAlign: 'center',
  },
  termsText: {
    fontSize: 12,
    color: '#EEE',
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 20,
    marginBottom: 0,
  },

  /* estilos del modal */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 24,
  },
  modalContainer: {
    backgroundColor: '#22282f',
    borderRadius: 8,
    padding: 24,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: '600',
    color: '#fff',
  },
  modalInput: {
    height: 44,
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 6,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
    color: 'black',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  modalButton: {
    width: '48%',
    height: 44,
    borderRadius: 6,
    backgroundColor: '#6B46C1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  forgotText: {
  color: '#4A90E2',
  textAlign: 'right',
  marginBottom: 12,
  fontSize: 14,
},
  modalMessage: {
    color: '#E53E3E',      
    textAlign: 'center',
    marginBottom: 12,
  },
  closeModal: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  closeText: {
    fontSize: 20,
    color: '#999',
  },
});