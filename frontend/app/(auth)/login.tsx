/* eslint-disable @typescript-eslint/no-require-imports */
import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Text } from '../../src/components/ui/Text';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';
import { theme } from '../../src/theme';
import { MobileInput } from '../../src/components/ui/MobileInput';
import { Divider } from '../../src/components/ui/Divider';
import { ProgressDots } from '../../src/components/ui/ProgressDots';
import { authApi } from '../../src/api/auth';

interface ApiError {
  response?: { data?: { error?: { message?: string } } };
  message?: string;
}

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async () => {
    setErrorMsg('');
    setLoading(true);
    try {
      await authApi.login({ email, password });
      router.replace('/');
    } catch (err: unknown) {
      const error = err as ApiError;
      setErrorMsg(error.response?.data?.error?.message || error.message || 'Connection error. Backend may be offline.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/login-background.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingTop: Math.max(insets.top, theme.spacing.xl) }]}
          keyboardShouldPersistTaps="handled"
        >

          <TouchableOpacity onPress={() => router.back()} style={styles.backButton} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Feather name="arrow-left" size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text variant="heading" style={styles.title}>Welcome back! 🌿</Text>
            <Text variant="bodySecondary" style={styles.subtitle}>Login to continue</Text>
          </View>

          <View style={styles.form}>
            {errorMsg ? (
              <View style={styles.errorBanner}>
                <Text style={styles.errorText}>{errorMsg}</Text>
              </View>
            ) : null}

            <MobileInput disabled value="" onChangeText={() => {}} />

            <Input
              label="Email Address"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <View style={styles.passwordContainer}>
              <Input
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <TouchableOpacity style={styles.forgotPasswordButton}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            <Divider />

            <Button
              label="Login with OTP"
              variant="outline"
              disabled
              onPress={() => {}}
              style={styles.otpButton}
            />

            <Button
              label="Login"
              onPress={handleLogin}
              loading={loading}
              disabled={!email || !password || loading}
              style={styles.mainButton}
            />

            <View style={styles.footer}>
              <Text variant="bodySecondary">Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/register')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Text style={styles.linkText}>Create Account</Text>
              </TouchableOpacity>
            </View>
          </View>

          <ProgressDots count={7} activeIndex={1} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: { flex: 1, width: '100%', height: '100%' },
  overlay: { flex: 1, backgroundColor: 'rgba(249, 247, 242, 0.85)' },
  safeArea: { flex: 1 },
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, padding: theme.spacing.xl },
  backButton: { marginBottom: theme.spacing.xl, alignSelf: 'flex-start' },
  header: { marginBottom: theme.spacing.xxl },
  title: {
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 32,
  },
  subtitle: { color: theme.colors.textSecondary, fontSize: 16 },
  form: { width: '100%', flex: 1 },
  errorBanner: { backgroundColor: theme.colors.errorBackground, padding: theme.spacing.m, borderRadius: theme.radii.m, marginBottom: theme.spacing.m },
  errorText: { color: theme.colors.error, fontSize: 14, fontWeight: '600' },
  passwordContainer: { marginBottom: theme.spacing.m },
  forgotPasswordButton: { alignSelf: 'flex-end', marginTop: -theme.spacing.m + 4, paddingVertical: theme.spacing.xs },
  forgotPasswordText: { color: theme.colors.accent, fontSize: 14, fontWeight: '600' },
  otpButton: { marginBottom: theme.spacing.m },
  mainButton: { marginBottom: theme.spacing.xl },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: theme.spacing.xl },
  linkText: { color: theme.colors.accent, fontWeight: '600', fontSize: 14 },
});
