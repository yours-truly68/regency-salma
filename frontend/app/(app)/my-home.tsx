/* eslint-disable @typescript-eslint/no-require-imports */
import { PremiumPressable } from '../../src/components/ui/PremiumPressable';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Text } from '../../src/components/ui/Text';
import { AppHeader } from '../../src/components/ui/AppHeader';
import { useScreenInsets } from '../../src/hooks/useScreenInsets';
import { theme } from '../../src/theme';

const RESIDENTS = [
  { id: '1', name: 'Rohan Sharma', rel: 'Owner' },
  { id: '2', name: 'Priya Sharma', rel: 'Co-owner' },
  { id: '3', name: 'Aarav Sharma', rel: 'Family' },
];

export default function MyHomeScreen() {
  const router = useRouter();
  const { bottomClearance } = useScreenInsets(false);

  return (
    <View style={styles.container}>
      <AppHeader
        variant="subscreen"
        title="Residence 9A"
        rightAction={
          <PremiumPressable
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            onPress={() => router.push('/profile-settings')}
            style={styles.headerIconBtn}
          >
            <Feather name="settings" size={20} color={theme.colors.textPrimary} />
          </PremiumPressable>
        }
      />

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: bottomClearance }]}>
        <View style={styles.heroContainer}>
          <Image 
            source={require('../../assets/hero-image.png')} 
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <Text style={styles.unitNumber}>9A</Text>
            <Text style={styles.homeName}>My Home</Text>
            <Text style={styles.unitAddress}>9th & 11th (Penthouse A)</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Residents</Text>
          <View style={styles.card}>
            {RESIDENTS.map((res, index) => (
              <React.Fragment key={res.id}>
                <PremiumPressable style={styles.row} onPress={() => router.push('/family-members')}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{res.name.charAt(0)}</Text>
                  </View>
                  <View style={styles.rowInfo}>
                    <Text style={styles.name}>{res.name}</Text>
                    <Text style={styles.rel}>{res.rel}</Text>
                  </View>
                  <Feather name="chevron-right" size={20} color={theme.colors.textSecondary} />
                </PremiumPressable>
                {index < RESIDENTS.length - 1 && <View style={styles.divider} />}
              </React.Fragment>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  headerIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
  },
  content: { paddingHorizontal: 20, paddingTop: 16 },
  heroContainer: {
    width: '100%',
    height: 220,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 24,
    position: 'relative',
    backgroundColor: '#1E293B',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  heroContent: {
    position: 'absolute',
    left: 20,
    bottom: 20,
    justifyContent: 'flex-end',
  },
  unitNumber: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 38,
    lineHeight: 44,
    letterSpacing: -1,
    color: '#FFFFFF',
    marginBottom: 2,
  },
  homeName: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 16,
    lineHeight: 22,
    color: '#FFFFFF',
    marginBottom: 2,
  },
  unitAddress: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 13,
    lineHeight: 18,
    color: 'rgba(255, 255, 255, 0.85)',
  },
  section: { marginBottom: 24 },
  sectionTitle: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 18, letterSpacing: -0.3, color: theme.colors.textPrimary, marginBottom: 14 },
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    borderRadius: 20,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 18 },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  avatarText: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 18, color: '#FFFFFF' },
  rowInfo: { flex: 1 },
  name: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 16, color: theme.colors.textPrimary, marginBottom: 3 },
  rel: { fontFamily: 'PlusJakartaSans_400Regular', fontSize: 14, color: theme.colors.textSecondary },
  divider: { height: 1, backgroundColor: 'rgba(0,0,0,0.05)' }
});
