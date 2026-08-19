import React, { useState } from 'react';
import { Modal, View, StyleSheet, TextInput, KeyboardAvoidingView, Platform, ScrollView, Pressable } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Feather } from '@expo/vector-icons';
import { Text } from './ui/Text';
import { PremiumPressable } from './ui/PremiumPressable';
import { Button } from './ui/Button';
import { theme } from '../theme';

interface AddVisitorModalProps {
  visible: boolean;
  onClose: () => void;
}

export function AddVisitorModal({ visible, onClose }: AddVisitorModalProps) {
  const [created, setCreated] = useState(false);
  const [name, setName] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopyOtp = async () => {
    await Clipboard.setStringAsync('8241');
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const handleClose = () => {
    onClose();
    setCopied(false);
    setTimeout(() => {
      setCreated(false);
      setName('');
    }, 300);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose} statusBarTranslucent>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={handleClose} />
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.sheet}>
            <View style={styles.grabber} />

            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>{created ? 'Visitor pass created' : 'Add Visitor'}</Text>
              <PremiumPressable style={styles.closeBtn} onPress={handleClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Feather name="x" size={22} color={theme.colors.textPrimary} />
              </PremiumPressable>
            </View>

            {created ? (
              <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                <View style={styles.successContent}>
                  <View style={styles.successIcon}>
                    <Feather name="check" size={28} color="#FFFFFF" />
                  </View>
                  <Text style={styles.passTitle}>{name || 'Guest'}</Text>
                  <Text style={styles.passDetail}>House number: 9A · Visit date: Today</Text>

                  <View style={styles.otpBox}>
                    <Text style={styles.otpLabel}>OTP</Text>
                    <Text style={styles.otpCode}>8241</Text>
                  </View>
                  <Text style={styles.otpWarning}>Share this OTP with the Watchman. The Watchman must also verify the house number.</Text>

                  <Button label={copied ? 'Copied!' : 'Copy OTP'} icon={copied ? 'check' : 'copy'} onPress={handleCopyOtp} style={styles.actionBtn} />
                  <Button label="Done" variant="secondary" onPress={handleClose} style={styles.actionBtn} />
                </View>
              </ScrollView>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                <Text style={styles.houseLabel}>House number: 9A</Text>
                <TextInput style={styles.input} placeholder="Visitor full name" value={name} onChangeText={setName} placeholderTextColor="#9CA3AF" />
                <TextInput style={styles.input} placeholder="Mobile number" keyboardType="phone-pad" placeholderTextColor="#9CA3AF" />
                <TextInput style={styles.input} placeholder="Visit type (e.g. Personal)" placeholderTextColor="#9CA3AF" />
                <TextInput style={styles.input} placeholder="Visit date" placeholderTextColor="#9CA3AF" />
                <TextInput style={styles.input} placeholder="Arrival time" placeholderTextColor="#9CA3AF" />
                <TextInput style={styles.input} placeholder="Departure time" placeholderTextColor="#9CA3AF" />

                <Button label="Generate Pass" onPress={() => setCreated(true)} style={styles.actionBtn} />
              </ScrollView>
            )}
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(17, 24, 39, 0.45)',
  },
  sheet: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 40,
    maxHeight: '90%',
  },
  grabber: {
    alignSelf: 'center',
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(0,0,0,0.12)',
    marginBottom: 16,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  sheetTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 22,
    letterSpacing: -0.4,
    color: theme.colors.textPrimary,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  houseLabel: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 15,
    color: theme.colors.textSecondary,
    marginBottom: 16,
    marginLeft: 2,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    borderRadius: 18,
    height: 58,
    paddingHorizontal: 16,
    marginBottom: 14,
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 16,
    color: theme.colors.textPrimary,
  },
  actionBtn: {
    marginTop: 10,
  },
  successContent: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  successIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  passTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 24,
    letterSpacing: -0.5,
    marginBottom: 6,
    color: theme.colors.textPrimary,
  },
  passDetail: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 15,
    color: theme.colors.textSecondary,
    marginBottom: 6,
  },
  otpBox: {
    backgroundColor: theme.colors.background,
    padding: 20,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
    marginVertical: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  otpLabel: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginBottom: 6,
  },
  otpCode: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 36,
    color: theme.colors.primary,
    letterSpacing: 8,
  },
  otpWarning: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 13,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 18,
  },
});