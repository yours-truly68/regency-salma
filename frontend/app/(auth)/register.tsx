/* eslint-disable @typescript-eslint/no-require-imports */
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { Text } from '../../src/components/ui/Text';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';
import { RoleSelector } from '../../src/components/ui/RoleSelector';
import { ProgressDots } from '../../src/components/ui/ProgressDots';
import { AnimatedEntrance } from '../../src/components/ui/AnimatedEntrance';
import { PremiumPressable } from '../../src/components/ui/PremiumPressable';
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

const FLOORS = ['G', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
const ROOMS = ['A', 'B'];

function floorLabel(floor: string) {
  return floor === 'G' ? 'Ground Floor' : `Floor ${floor}`;
}

function AnimatedCheck({ visible, color }: { visible: boolean; color: string }) {
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: visible ? 1 : 0,
      speed: 26,
      bounciness: 10,
      useNativeDriver: true,
    }).start();
  }, [visible, scale]);

  return (
    <Animated.View style={{ opacity: scale, transform: [{ scale }] }}>
      <Feather name="check" size={18} color={color} />
    </Animated.View>
  );
}

interface PickerFieldProps {
  label: string;
  value: string;
  placeholder?: boolean;
  onPress: () => void;
}

function PickerField({
  label,
  value,
  placeholder,
  onPress,
}: PickerFieldProps) {
  return (
    <View style={styles.pickerField}>
      <Text style={styles.pickerFieldLabel}>{label}</Text>

      <PremiumPressable
        onPress={onPress}
        scaleTo={0.97}
        activeOpacity={0.92}
        style={styles.pickerFieldControl}
      >
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.85}
          style={[
            styles.pickerFieldValue,
            placeholder && styles.pickerFieldValuePlaceholder,
          ]}
        >
          {value}
        </Text>

        <Feather
          name="chevron-down"
          size={18}
          color={theme.colors.textSecondary}
        />
      </PremiumPressable>
    </View>
  );
}

export default function RegisterScreen() {
  const router = useRouter();
  const { register: performRegister } = useSession();

  const [role, setRole] = useState<'owner' | 'tenant'>('owner');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [floor, setFloor] = useState('');
  const [room, setRoom] = useState('');
  const [showFloorPicker, setShowFloorPicker] = useState(false);
  const [showRoomPicker, setShowRoomPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = (v: string) => EMAIL_REGEX.test(v);

  const hasMinLength = password.length >= 8;
  const hasLettersAndDigits =
    /[A-Za-z]/.test(password) && /\d/.test(password);
  const passwordValid = hasMinLength && hasLettersAndDigits;

  const emailTouchedInvalid = email.length > 0 && !isEmailValid(email);
  const confirmMismatch =
    confirmPassword.length > 0 && password !== confirmPassword;

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    setErrorMsg('');
    setLoading(true);

    try {
      await performRegister({
        email,
        password,
        fullName,
        floor,
        room,
        role,
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

  const isFormValid = () => {
    if (
      !fullName ||
      !email ||
      !isEmailValid(email) ||
      !password ||
      !passwordValid ||
      !confirmPassword ||
      password !== confirmPassword ||
      !floor ||
      !room
    ) {
      return false;
    }
    return true;
  };

  return (
    <View style={styles.root}>
      {/* FIXED BACKGROUND — positioned independently of the scrollable
          auth content so it never contributes to scroll height. */}
      <Image
        source={require('../../assets/create-account-background.png')}
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

              <AnimatedEntrance distance={14} duration={420}>
                <View style={styles.header}>
                  <Text style={styles.title}>Create your account</Text>
                  <Text style={styles.subtitle}>Let's get you started</Text>
                </View>
              </AnimatedEntrance>

              <AnimatedEntrance delay={70} distance={14} duration={420}>
                <RoleSelector selected={role} onChange={setRole} />
              </AnimatedEntrance>

              <AnimatedEntrance delay={140} distance={14} duration={420}>
                <View style={styles.unitSection}>
                  <Text style={styles.unitHeading}>Where do you live?</Text>

                  <View style={styles.unitRow}>
                    <PickerField
                      label=""
                      value={floor ? floorLabel(floor) : 'Select'}
                      placeholder={!floor}
                      onPress={() => setShowFloorPicker(true)}
                    />

                    <PickerField
                      label=""
                      value={room ? `Flat ${room}` : 'Select'}
                      placeholder={!room}
                      onPress={() => setShowRoomPicker(true)}
                    />
                  </View>
                </View>
              </AnimatedEntrance>

              <AnimatedEntrance delay={210} distance={14} duration={420}>
                <View style={styles.form}>
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
                    label=""
                    placeholder="Enter your full name"
                    value={fullName}
                    onChangeText={setFullName}
                    autoCapitalize="words"
                    autoCorrect={false}
                    containerStyle={styles.formField}
                  />

                  <Input
                    label=""
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    error={emailTouchedInvalid ? 'Enter a valid email address' : undefined}
                    containerStyle={styles.formField}
                  />

                  <Input
                    label=""
                    placeholder="Create a password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                    containerStyle={styles.formField}
                  />

                  {password.length > 0 && (
                    <View style={styles.passwordChecks}>
                      <View style={styles.passwordCheckRow}>
                        <Feather
                          name={hasMinLength ? 'check-circle' : 'circle'}
                          size={15}
                          color={hasMinLength ? theme.colors.success : theme.colors.textSecondary}
                        />
                        <Text style={[styles.passwordCheckText, hasMinLength && styles.passwordCheckTextActive]}>
                          At least 8 characters
                        </Text>
                      </View>
                      <View style={styles.passwordCheckRow}>
                        <Feather
                          name={hasLettersAndDigits ? 'check-circle' : 'circle'}
                          size={15}
                          color={hasLettersAndDigits ? theme.colors.success : theme.colors.textSecondary}
                        />
                        <Text style={[styles.passwordCheckText, hasLettersAndDigits && styles.passwordCheckTextActive]}>
                          Contains letters and numbers
                        </Text>
                      </View>
                    </View>
                  )}

                  <Input
                    label=""
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                    error={confirmMismatch ? 'Passwords do not match' : undefined}
                    containerStyle={styles.formField}
                  />

                  <Button
                    label="Create Account"
                    onPress={handleRegister}
                    loading={loading}
                    disabled={!isFormValid() || loading}
                    style={styles.mainButton}
                  />

                  <View style={styles.footer}>
                    <Text style={styles.footerText}>
                      Already have an account?{' '}
                    </Text>

                    <TouchableOpacity
                      activeOpacity={0.7}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      onPress={() => router.push('/(auth)/login')}
                    >
                      <Text style={styles.linkText}>Login</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </AnimatedEntrance>
            </View>

            <View style={styles.progress}>
              <ProgressDots
                count={7}
                activeIndex={2}
                style={styles.progressDots}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {/* Floor picker */}
      <Modal
        visible={showFloorPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFloorPicker(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowFloorPicker(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Floor</Text>

            <ScrollView
              style={styles.modalList}
              showsVerticalScrollIndicator={false}
            >
              {FLOORS.map((f) => {
                const isSelected = floor === f;

                return (
                  <PremiumPressable
                    key={f}
                    scaleTo={0.97}
                    activeOpacity={0.94}
                    style={styles.modalOption}
                    onPress={() => {
                      setFloor(f);
                      setShowFloorPicker(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.modalOptionText,
                        isSelected && styles.modalOptionTextActive,
                      ]}
                    >
                      {floorLabel(f)}
                    </Text>

                    {isSelected && (
                      <AnimatedCheck
                        visible={isSelected}
                        color={theme.colors.primary}
                      />
                    )}
                  </PremiumPressable>
                );
              })}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>

      {/* Room picker */}
      <Modal
        visible={showRoomPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowRoomPicker(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowRoomPicker(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Room</Text>

            <ScrollView
              style={styles.modalList}
              showsVerticalScrollIndicator={false}
            >
              {ROOMS.map((r) => {
                const isSelected = room === r;

                return (
                  <PremiumPressable
                    key={r}
                    scaleTo={0.97}
                    activeOpacity={0.94}
                    style={styles.modalOption}
                    onPress={() => {
                      setRoom(r);
                      setShowRoomPicker(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.modalOptionText,
                        isSelected && styles.modalOptionTextActive,
                      ]}
                    >
                      Flat {r}
                    </Text>

                    {isSelected && (
                      <AnimatedCheck
                        visible={isSelected}
                        color={theme.colors.primary}
                      />
                    )}
                  </PremiumPressable>
                );
              })}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  /*
   * =====================================================
   * SCREEN + FIXED BACKGROUND
   * =====================================================
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
    backgroundColor: 'rgba(249, 247, 242, 0.88)',
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
    maxWidth: 460,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
  },

  /*
   * =====================================================
   * HEADER
   * =====================================================
   */

  header: {
    marginBottom: 18,
  },

  title: {
    color: theme.colors.primary,
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: -0.7,
    marginBottom: 6,
  },

  subtitle: {
    color: theme.colors.textSecondary,
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 16,
    lineHeight: 22,
  },

  /*
   * =====================================================
   * FORM
   * =====================================================
   */

  form: {
    width: '100%',
  },

  formField: {
    marginBottom: 12,
  },

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
   * UNIT PICKERS
   * =====================================================
   */

  unitSection: {
    marginBottom: 14,
  },

  unitHeading: {
    marginBottom: 10,
    color: theme.colors.textPrimary,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 16,
    lineHeight: 21,
  },

  unitRow: {
    flexDirection: 'row',
    gap: 12,
  },

  pickerField: {
    flex: 1,
  },

  pickerFieldLabel: {
    marginBottom: 8,
    color: theme.colors.textPrimary,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 16,
  },

  pickerFieldControl: {
    height: 66,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },

  pickerFieldValue: {
    flex: 1,
    color: theme.colors.textPrimary,
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 18,
  },

  pickerFieldValuePlaceholder: {
    color: theme.colors.textSecondary,
  },

  /*
   * =====================================================
   * PASSWORD CHECKS
   * =====================================================
   */

  passwordChecks: {
    marginTop: -8,
    marginBottom: 16,
    paddingHorizontal: 4,
    gap: 6,
  },

  passwordCheckRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  passwordCheckText: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 14,
    lineHeight: 18,
    color: theme.colors.textSecondary,
  },

  passwordCheckTextActive: {
    color: theme.colors.textPrimary,
  },

  /*
   * =====================================================
   * BUTTON + FOOTER
   * =====================================================
   */

  mainButton: {
    marginTop: 2,
    marginBottom: 16,
    height: 62,
    borderRadius: theme.radii.pill,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  footerText: {
    color: theme.colors.textSecondary,
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 15,
    lineHeight: 20,
  },

  linkText: {
    color: theme.colors.accent,
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 15,
    lineHeight: 20,
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

  /*
   * =====================================================
   * PICKER MODALS
   * =====================================================
   */

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(20, 61, 42, 0.45)',
    justifyContent: 'flex-end',
  },

  modalContent: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingHorizontal: 24,
    paddingBottom: 32,
    maxHeight: '70%',
  },

  modalTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 18,
    letterSpacing: -0.3,
    color: theme.colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },

  modalList: {
    marginTop: 8,
  },

  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },

  modalOptionText: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 15,
    color: theme.colors.textPrimary,
  },

  modalOptionTextActive: {
    fontFamily: 'PlusJakartaSans_700Bold',
    color: theme.colors.primary,
  },
});