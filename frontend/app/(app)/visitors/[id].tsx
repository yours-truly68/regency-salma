import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '../../../src/components/ui/Text';
import { theme } from '../../../src/theme';

export default function VisitorDetailsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>R</Text>
          </View>
          <Text style={styles.name}>Rahul Sharma</Text>
          <Text style={styles.type}>Personal Visitor</Text>
        </View>

        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Mobile Number</Text>
            <Text style={styles.detailValue}>+91 98765 43210</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Visiting Flat</Text>
            <Text style={styles.detailValue}>9A</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Purpose</Text>
            <Text style={styles.detailValue}>Guest</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Expected Time</Text>
            <Text style={styles.detailValue}>Today, 6:30 PM</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Vehicle Number</Text>
            <Text style={styles.detailValue}>KA 01 AB 1234</Text>
          </View>
        </View>

        {/* Fixture: DO NOT claim this is secure until backend exists */}
        <View style={styles.otpCard}>
          <Text style={styles.otpLabel}>Entry Pass (OTP)</Text>
          <Text style={styles.otpValue}>4 8 2 9 1 5</Text>
          <Text style={styles.otpNotice}>Valid for 15 minutes after expected arrival time</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.shareBtn}>
            <Text style={styles.shareBtnText}>Share OTP</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.denyBtn}>
            <Text style={styles.denyBtnText}>Deny Visitor</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 32,
    color: theme.colors.textPrimary,
  },
  name: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 20,
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  type: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  detailsCard: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
  },
  detailLabel: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  detailValue: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 13,
    color: theme.colors.textPrimary,
  },
  otpCard: {
    backgroundColor: theme.colors.primary,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 32,
  },
  otpLabel: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 12,
  },
  otpValue: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 32,
    color: '#FFF',
    letterSpacing: 4,
    marginBottom: 12,
  },
  otpNotice: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
  },
  actions: {
    gap: 16,
  },
  shareBtn: {
    backgroundColor: theme.colors.accent,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareBtnText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 16,
    color: '#FFF',
  },
  denyBtn: {
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  denyBtnText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 16,
    color: theme.colors.error,
  }
});
