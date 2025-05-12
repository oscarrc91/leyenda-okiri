import { Ionicons } from '@expo/vector-icons'; // Expo incluye este paquete por defecto
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native';
import type { RootStackParamList } from '../AppNavigator';
import {
  AuthResult,
  resetPassword,
  sendVerificationCode,
  verifyCode
} from '../services/auth';

type Props = NativeStackScreenProps<RootStackParamList, 'ResetPassword'>;

export default function ResetPasswordScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [stage, setStage] = useState<'send' | 'verify'>('send');
  const [error, setError] = useState<string | null>(null);

  // 1) Siempre activo: pedimos el envío de código silent
  const handleSendCode = () => {
    sendVerificationCode(email); // limitado internamente a 1 envío/5min
    setError(null);
  };

  // 2) Verificamos y avanzamos
  const handleVerify = async () => {
    setError(null);
    if (!code) return setError('Introduce el código recibido');
    const ok = await verifyCode(email, code);
    if (ok) {
      setStage('verify');
      setError(null);
    } else {
      setError('Código inválido o caducado');
    }
  };

  // 3) Cambiamos la contraseña y volvemos
  const handleChange = async () => {
    Keyboard.dismiss();
    setError(null);
    if (!newPass || !confirmPass) return setError('Rellena ambos campos');
    if (newPass !== confirmPass) return setError('Las contraseñas no coinciden');
    const result: AuthResult = await resetPassword(email, newPass);
    if (result.success) {
      // setError('Contraseña cambiada ✅');
      setTimeout(() => {
        navigation.navigate('Login', { openEmailModal: true });
      }, 1200);
    } else {
      setError(result.error ?? 'Error cambiando contraseña');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Flecha de volver */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-back" size={32} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.title}>Restablecer contraseña</Text>

      {/* Paso 1: email + código */}
      {stage === 'send' && (
        <>
          <Text style={styles.stepText}>
            1. Introduce tu correo electrónico. Si existe una cuenta asociada, recibirás un código por email.
          </Text>
          <TextInput
            style={styles.inputFull}
            placeholder="Correo electrónico"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TouchableOpacity
            style={styles.buttonFull}
            onPress={handleSendCode}
          >
            <Text style={styles.buttonText}>Enviar código</Text>
          </TouchableOpacity>

          <Text style={styles.stepText}>
            2. Introduce aquí el código de 6 dígitos que recibiste. El código caduca a los 5 min.
          </Text>
          <TextInput
            style={styles.inputFull}
            placeholder="Código de verificación"
            keyboardType="number-pad"
            value={code}
            onChangeText={setCode}
            editable={stage === 'send'}
          />
          <TouchableOpacity
            style={styles.buttonFull}
            onPress={handleVerify}
            disabled={!code.trim()}
          >
            <Text style={styles.buttonText}>Verificar código</Text>
          </TouchableOpacity>
        </>
      )}
      {/* Paso 2: nueva contraseña */}
      {stage === 'verify' && (
        <>
          <Text style={styles.stepText}>
            3. Elige una nueva contraseña distinta a la anterior. Debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, un número y un carácter especial.
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Nueva contraseña"
            secureTextEntry
            value={newPass}
            onChangeText={setNewPass}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirmar contraseña"
            secureTextEntry
            value={confirmPass}
            onChangeText={setConfirmPass}
          />
          <TouchableOpacity style={styles.button} onPress={handleChange}>
            <Text style={styles.buttonText}>Cambiar contraseña</Text>
          </TouchableOpacity>
        </>
      )}

      {error && <Text style={styles.error}>{error}</Text>}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#22282f',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 16,
    zIndex: 10,
  },
  title: {
    fontSize: 22,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  stepText: {
    color: '#EEE',
    marginBottom: 8,
    fontSize: 14,
    lineHeight: 20,
  },
  input: {
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  button: {
    height: 48,
    backgroundColor: '#6B46C1',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    color: '#E53E3E',
    textAlign: 'center',
    marginTop: 12,
  },
  inputFull: {
    width: '100%',
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  buttonFull: {
    width: '100%',
    height: 48,
    backgroundColor: '#6B46C1',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
});
