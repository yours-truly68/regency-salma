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
import { RoleSelector } from '../../src/components/ui/RoleSelector';
import { MobileInput } from '../../src/components/ui/MobileInput';
import { ProgressDots } from '../../src/components/ui/ProgressDots';
import { authApi } from '../../src/api/auth';

interface ApiError {
  response?: { data?: { error?: { message?: string } } };
  message?: string;
}

export default function RegisterScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [role, setRole] = useState<'owner'|'tenant'>('owner');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }
    setErrorMsg('');
    setLoading(true);
    try {
      await authApi.register({ email, password });
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
      source={require('../../assets/create-account-background.png')}
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
            <Text variant="heading" style={styles.title}>Create your account 🌿</Text>
            <Text variant="bodySecondary" style={styles.subtitle}>Let's get you started</Text>
          </View>

          <RoleSelector selected={role} onChange={setRole} />

          <View style={styles.form}>
            {errorMsg ? (
              <View style={styles.errorBanner}>
                <Text style={styles.errorText}>{errorMsg}</Text>
              </View>
            ) : null}

            <Input
              label="Full Name"
              placeholder="Enter your full name"
              value={fullName}
              onChangeText={setFullName}
            />

            <MobileInput disabled value="" onChangeText={() => {}} />

            <Input
              label="Email Address"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Input
              label="Password"
              placeholder="Create a password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <Input
              label="Confirm Password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />

            <Button
              label="Create Account"
              onPress={handleRegister}
              loading={loading}
              disabled={!email || !password || !confirmPassword || loading}
              style={styles.mainButton}
            />

            <View style={styles.footer}>
              <Text variant="bodySecondary">Already have an account? </Text>
              <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Text style={styles.linkText}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>

          <ProgressDots count={7} activeIndex={2} />
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
    fontSize: 28,
  },
  subtitle: { color: theme.colors.textSecondary, fontSize: 16 },
  form: { width: '100%', flex: 1 },
  errorBanner: { backgroundColor: theme.colors.errorBackground, padding: theme.spacing.m, borderRadius: theme.radii.m, marginBottom: theme.spacing.m },
  errorText: { color: theme.colors.error, fontSize: 14, fontWeight: '600' },
  mainButton: { marginTop: theme.spacing.l, marginBottom: theme.spacing.xl },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: theme.spacing.xl },
  linkText: { color: theme.colors.accent, fontWeight: '600', fontSize: 14 },
});
