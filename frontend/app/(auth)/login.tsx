/* eslint-disable @typescript-eslint/no-require-imports */
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  AppState,
  Easing,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { Text } from '../../src/components/ui/Text';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';
import { ProgressDots } from '../../src/components/ui/ProgressDots';
import { theme } from '../../src/theme';
import { useSession } from '../../src/store/auth';

interface ApiError {
  response?: {
    data?: {
      error?: {
        message?: string;
      };
    };
  };
  message?: string;
}

const LOGO_WIDTH = 140;
const LOGO_HEIGHT = LOGO_WIDTH * (941 / 1672);
const TOP_PADDING = 40;

// The intro only plays on the first open and on resume from background,
// never on plain screen remounts (e.g. navigating back to login).
let introHasPlayed = false;

export default function LoginScreen() {
  const router = useRouter();
  const { login: performLogin } = useSession();
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emailValid = email.length === 0 || EMAIL_REGEX.test(email);
  const emailTouchedInvalid = email.length > 0 && !emailValid;
  const canLogin = emailValid && email.length > 0 && password.length > 0;

  const logoProgress = useRef(new Animated.Value(0)).current;
  const logoPulse = useRef(new Animated.Value(1)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const formOpacity = useRef(new Animated.Value(0)).current;
  const formTravel = useRef(new Animated.Value(20)).current;
  const dotsOpacity = useRef(new Animated.Value(0)).current;

  const finalLogoTop = insets.top + TOP_PADDING;
  const centeredLogoTop = (height - LOGO_HEIGHT) / 2;
  const logoStartOffset = centeredLogoTop - finalLogoTop;

  const logoTravel = logoProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [logoStartOffset, 0],
  });

  const pulseRef = useRef<Animated.CompositeAnimation | null>(null);
  const introTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const appStateRef = useRef(AppState.currentState);

  useEffect(() => {
    const playIntro = () => {
      if (introTimerRef.current) {
        clearTimeout(introTimerRef.current);
      }
      pulseRef.current?.stop();

      logoOpacity.setValue(0);
      logoProgress.setValue(0);
      logoPulse.setValue(1);
      titleOpacity.setValue(0);
      subtitleOpacity.setValue(0);
      formOpacity.setValue(0);
      formTravel.setValue(20);
      dotsOpacity.setValue(0);

      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(logoPulse, {
            toValue: 1.16,
            duration: 650,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(logoPulse, {
            toValue: 1,
            duration: 650,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
      );

      pulseRef.current = pulse;
      pulse.start();

      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();

      introTimerRef.current = setTimeout(() => {
        pulse.stop();

        Animated.parallel([
          Animated.spring(logoProgress, {
            toValue: 1,
            damping: 18,
            stiffness: 110,
            mass: 0.9,
            useNativeDriver: true,
          }),
          Animated.spring(logoPulse, {
            toValue: 1,
            damping: 18,
            stiffness: 110,
            useNativeDriver: true,
          }),
        ]).start(() => {
          Animated.sequence([
            Animated.timing(titleOpacity, {
              toValue: 1,
              duration: 350,
              useNativeDriver: true,
            }),
            Animated.timing(subtitleOpacity, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.parallel([
              Animated.timing(formOpacity, {
                toValue: 1,
                duration: 350,
                useNativeDriver: true,
              }),
              Animated.spring(formTravel, {
                toValue: 0,
                damping: 18,
                stiffness: 120,
                useNativeDriver: true,
              }),
              Animated.timing(dotsOpacity, {
                toValue: 1,
                duration: 350,
                useNativeDriver: true,
              }),
            ]),
          ]).start();
        });
      }, 1300);
    };

    const setFinalState = () => {
      if (introTimerRef.current) {
        clearTimeout(introTimerRef.current);
      }
      pulseRef.current?.stop();

      logoOpacity.setValue(1);
      logoProgress.setValue(1);
      logoPulse.setValue(1);
      titleOpacity.setValue(1);
      subtitleOpacity.setValue(1);
      formOpacity.setValue(1);
      formTravel.setValue(0);
      dotsOpacity.setValue(1);
    };

    const subscription = AppState.addEventListener('change', (next) => {
      const prev = appStateRef.current;
      appStateRef.current = next;
      if (prev !== 'active' && next === 'active') {
        introHasPlayed = true;
        playIntro();
      }
    });

    if (!introHasPlayed) {
      introHasPlayed = true;
      playIntro();
    } else {
      setFinalState();
    }

    return () => {
      subscription.remove();
      if (introTimerRef.current) {
        clearTimeout(introTimerRef.current);
      }
      pulseRef.current?.stop();
    };
  }, []);

  const handleLogin = async () => {
    setErrorMsg('');
    setLoading(true);

    try {
      await performLogin({
        email,
        password,
      });
    } catch (err: unknown) {
      const error = err as ApiError;

      setErrorMsg(
        error.response?.data?.error?.message ||
          error.message ||
          'Connection error. Backend may be offline.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      {/* FIXED BACKGROUND — positioned independently of the scrollable
          auth content so it never contributes to scroll height. */}
      <Image
        source={require('../../assets/login-background.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      <View style={styles.backgroundOverlay} />

      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardContainer}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.screenContent}>
              {/* AUTH ROOT: no back button. */}

              <View style={styles.header}>
                {/* Logo intro: pulses in the center, then slides up with a
                    soft bounce and settles at the top of the screen. */}
                <Animated.Image
                  source={require('../../assets/auth-logo.png')}
                  style={[
                    styles.logo,
                    {
                      opacity: logoOpacity,
                      transform: [
                        { translateY: logoTravel },
                        { scale: logoPulse },
                      ],
                    },
                  ]}
                  resizeMode="contain"
                />

                <Animated.View style={{ opacity: titleOpacity }}>
                  <Text style={styles.title}>Welcome back!</Text>
                </Animated.View>

                <Animated.View style={{ opacity: subtitleOpacity }}>
                  <Text style={styles.subtitle}>Login to continue</Text>
                </Animated.View>
              </View>

              <Animated.View
                style={[
                  styles.form,
                  {
                    opacity: formOpacity,
                    transform: [{ translateY: formTravel }],
                  },
                ]}
              >
                {errorMsg ? (
                  <View style={styles.errorBanner}>
                    <Feather
                      name="alert-circle"
                      size={17}
                      color={theme.colors.error}
                    />

                    <Text style={styles.errorText}>{errorMsg}</Text>
                  </View>
                ) : null}

                <Input
                  label="Email Address"
                  placeholder="johndoe@provider.domain"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  error={emailTouchedInvalid ? 'Enter a valid email address' : undefined}
                />

                <View style={styles.passwordField}>
                  <Input
                    label="Password"
                    placeholder="Enter your password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                  />

                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.forgotButton}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Text style={styles.forgotText}>Forgot Password?</Text>
                  </TouchableOpacity>
                </View>

                <Button
                  label="Login"
                  onPress={handleLogin}
                  loading={loading}
                  disabled={!canLogin || loading}
                  style={styles.loginButton}
                />

                <View style={styles.footer}>
                  <Text style={styles.footerText}>
                    Don't have an account?{' '}
                  </Text>

                  <TouchableOpacity
                    activeOpacity={0.7}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    onPress={() => router.push('/(auth)/register')}
                  >
                    <Text style={styles.createAccountText}>
                      Create Account
                    </Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </View>

            <Animated.View style={[styles.progress, { opacity: dotsOpacity }]}>
              <ProgressDots
                count={7}
                activeIndex={1}
                style={styles.progressDots}
              />
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  /*
   * =====================================================
   * SCREEN + FIXED BACKGROUND
   * =====================================================
   *
   * The background image and overlay are absolutely positioned
   * over the root and clipped to the viewport. The scrollable
   * auth content lives above them and never carries the image.
   */

  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },

  backgroundOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(249, 247, 242, 0.86)',
  },

  safeArea: {
    flex: 1,
  },

  keyboardContainer: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },

  screenContent: {
    width: '100%',
    paddingHorizontal: 24,
    paddingTop: TOP_PADDING,
  },

  /*
   * =====================================================
   * HEADER + LOGO
   * =====================================================
   */

  header: {
    alignItems: 'center',
    marginBottom: 28,
  },

  logo: {
    width: LOGO_WIDTH,
    height: LOGO_HEIGHT,
    marginBottom: 26,
  },

  title: {
    color: theme.colors.primary,
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 30,
    lineHeight: 38,
    letterSpacing: -0.8,
    marginBottom: 6,
    textAlign: 'center',
  },

  subtitle: {
    color: theme.colors.textSecondary,
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
  },

  /*
   * =====================================================
   * FORM
   * =====================================================
   */

  form: {
    width: '100%',
  },

  passwordField: {
    marginBottom: 4,
  },

  forgotButton: {
    alignSelf: 'flex-end',
    paddingTop: 8,
    paddingBottom: 2,
  },

  forgotText: {
    color: theme.colors.accent,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 13,
    lineHeight: 18,
  },

  /*
   * =====================================================
   * ERROR
   * =====================================================
   */

  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.errorBackground,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },

  errorText: {
    flex: 1,
    color: theme.colors.error,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 12,
    lineHeight: 17,
  },

  /*
   * =====================================================
   * DIVIDER + BUTTONS
   * =====================================================
   */

  divider: {
    marginVertical: 16,
  },

  otpButton: {
    height: 54,
    borderRadius: theme.radii.pill,
    marginBottom: 12,
    backgroundColor: 'rgba(255,255,255,0.72)',
  },

  loginButton: {
    height: 54,
    borderRadius: theme.radii.pill,
    marginBottom: 20,
  },

  /*
   * =====================================================
   * FOOTER
   * =====================================================
   */

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  footerText: {
    color: theme.colors.textSecondary,
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 13,
    lineHeight: 18,
  },

  createAccountText: {
    color: theme.colors.accent,
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 13,
    lineHeight: 18,
  },

  /*
   * =====================================================
   * PROGRESS
   * =====================================================
   */

  progress: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 4,
  },

  progressDots: {
    paddingVertical: 2,
  },
});