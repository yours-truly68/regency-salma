import { PremiumPressable } from '../../../src/components/ui/PremiumPressable';
import { Feather } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Share } from 'react-native';
import { useRouter } from 'expo-router';
import { Text } from '../../../src/components/ui/Text';
import { Button } from '../../../src/components/ui/Button';
import { AppHeader } from '../../../src/components/ui/AppHeader';
import { useScreenInsets } from '../../../src/hooks/useScreenInsets';
import { theme } from '../../../src/theme';

const OTP = '482915';

export default function VisitorDetailsScreen() {
  const router = useRouter();
  const { bottomClearance } = useScreenInsets(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(OTP);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const handleShare = () => {
    Share.share({
      message: `Your entry pass (OTP) for visiting Regency Salma is ${OTP}. Valid for 15 minutes after the expected arrival time.`,
      title: 'Regency Salma Entry Pass',
    });
  };

  return (
    <View style={styles.container}>
      <AppHeader
        variant="subscreen"
        title="Visitor Details"
        onBackPress={() => router.canGoBack() ? router.back() : router.replace('/visitors')}
      />

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: bottomClearance }]}>
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
          <Button
            label={copied ? 'Copied!' : 'Copy OTP'}
            icon={copied ? 'check' : 'copy'}
            variant="primary"
            size="md"
            onPress={handleCopy}
          />
          <Button label="Share OTP" icon="share-2" variant="secondary" size="md" onPress={handleShare} />
          <Button label="Deny Visitor" icon="x" variant="dangerOutline" size="md" onPress={() => {}} />
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  avatarText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 34,
    color: '#FFFFFF',
  },
  name: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 22,
    letterSpacing: -0.4,
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  type: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 15,
    color: theme.colors.textSecondary,
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  detailLabel: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  detailValue: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 14,
    color: theme.colors.textPrimary,
  },
  otpCard: {
    backgroundColor: theme.colors.primary,
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6,
  },
  otpLabel: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 14,
    letterSpacing: 0.5,
  },
  otpValue: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 36,
    color: '#FFF',
    letterSpacing: 6,
    marginBottom: 14,
  },
  otpNotice: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    lineHeight: 18,
  },
  actions: {
    gap: 14,
  },
  shareBtn: {
    backgroundColor: theme.colors.accent,
    height: 52,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  shareBtnText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 16,
    color: '#FFF',
  },
  denyBtn: {
    height: 52,
    borderRadius: 100,
    borderWidth: 1.5,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    backgroundColor: '#FFF5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  denyBtnText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 16,
    color: theme.colors.error,
  }
});
