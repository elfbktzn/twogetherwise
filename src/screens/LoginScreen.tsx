import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { loginWithEmail, loginAnonymously } from '@/services/authService';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';
import { AuthScreenProps } from '@/types/navigation';
import { COLORS, FONTS } from '../../theme';

export function LoginScreen({ navigation }: AuthScreenProps<'Login'>) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { promptAsync, isLoading: googleLoading } = useGoogleAuth();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      await loginWithEmail(email.trim(), password);
    } catch (err: any) {
      Alert.alert('Login Failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnonymous = async () => {
    setLoading(true);
    try {
      await loginAnonymously();
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.inner}>
        <Text style={styles.title}>🌍</Text>
        <Text style={styles.heading}>Global Feelings Map</Text>
        <Text style={styles.subtitle}>How is the world feeling today?</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={COLORS.placeholderText}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={COLORS.placeholderText}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.primaryBtnText}>Log In</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => navigation.navigate('SignUp')}
        >
          <Text style={styles.secondaryBtnText}>Create Account</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.linkText}>Forgot Password?</Text>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity
          style={styles.googleBtn}
          onPress={() => promptAsync()}
          disabled={googleLoading || loading}
        >
          <Text style={styles.googleBtnText}>G</Text>
          <Text style={styles.googleBtnLabel}>Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.anonymousBtn}
          onPress={handleAnonymous}
          disabled={loading}
        >
          <Text style={styles.anonymousBtnText}>Continue Anonymously</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 56,
    textAlign: 'center',
    marginBottom: 8,
  },
  heading: {
    fontSize: 28,
    fontFamily: FONTS.heading,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: FONTS.text,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 36,
  },
  input: {
    backgroundColor: COLORS.inputBg,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: COLORS.inputText,
    fontFamily: FONTS.text,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.cardBorderAuth,
  },
  primaryBtn: {
    backgroundColor: COLORS.buttonPrimary,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryBtnText: {
    color: COLORS.white,
    fontSize: 17,
    fontFamily: FONTS.heading,
  },
  secondaryBtn: {
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  secondaryBtnText: {
    color: COLORS.primary,
    fontSize: 17,
    fontFamily: FONTS.medium,
  },
  linkText: {
    color: COLORS.textTertiary,
    textAlign: 'center',
    marginTop: 16,
    fontSize: 14,
    fontFamily: FONTS.text,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.dividerLight,
  },
  dividerText: {
    color: COLORS.textTertiary,
    marginHorizontal: 12,
    fontSize: 13,
    fontFamily: FONTS.text,
  },
  googleBtn: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  googleBtnText: {
    fontSize: 20,
    fontFamily: FONTS.heading,
    color: '#4285F4',
    marginRight: 10,
  },
  googleBtnLabel: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontFamily: FONTS.medium,
  },
  anonymousBtn: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.cardBorderAuth,
  },
  anonymousBtnText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    fontFamily: FONTS.medium,
  },
});
