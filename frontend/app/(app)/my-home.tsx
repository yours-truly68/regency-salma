/* eslint-disable @typescript-eslint/no-require-imports */
import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '../../src/components/ui/Text';
import { theme } from '../../src/theme';

const RESIDENTS = [
  { id: '1', name: 'Rohan Sharma', rel: 'Owner' },
  { id: '2', name: 'Priya Sharma', rel: 'Co-owner' },
  { id: '3', name: 'Aarav Sharma', rel: 'Family' },
];

export default function MyHomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Home</Text>
        <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Feather name="settings" size={20} color={theme.colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Image 
          source={require('../../assets/home-residential-hero.png')} 
          style={styles.heroImage}
          resizeMode="cover"
        />

        <View style={styles.unitInfo}>
          <Text style={styles.unitNumber}>9A</Text>
          <Text style={styles.unitMeta}>Tower A · 3 BHK · 1,850 sqft</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Residents</Text>
          <View style={styles.card}>
            {RESIDENTS.map((res, index) => (
              <React.Fragment key={res.id}>
                <TouchableOpacity style={styles.row}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{res.name.charAt(0)}</Text>
                  </View>
                  <View style={styles.rowInfo}>
                    <Text style={styles.name}>{res.name}</Text>
                    <Text style={styles.rel}>{res.rel}</Text>
                  </View>
                  <Feather name="chevron-right" size={20} color={theme.colors.textSecondary} />
                </TouchableOpacity>
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
  container: { flex: 1, backgroundColor: theme.colors.surface },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  headerTitle: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 18, color: theme.colors.textPrimary },
  content: { padding: 16 },
  heroImage: { width: '100%', height: 200, borderRadius: 16, marginBottom: 20 },
  unitInfo: { alignItems: 'center', marginBottom: 32 },
  unitNumber: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 40, color: theme.colors.textPrimary, marginBottom: 4 },
  unitMeta: { fontFamily: 'PlusJakartaSans_500Medium', fontSize: 14, color: theme.colors.textSecondary },
  section: { marginBottom: 24 },
  sectionTitle: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 16, color: theme.colors.textPrimary, marginBottom: 12 },
  card: { backgroundColor: '#FFF', borderWidth: 1, borderColor: theme.colors.border, borderRadius: 16, paddingHorizontal: 16 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.05)', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 16, color: theme.colors.textPrimary },
  rowInfo: { flex: 1 },
  name: { fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 15, color: theme.colors.textPrimary, marginBottom: 2 },
  rel: { fontFamily: 'PlusJakartaSans_500Medium', fontSize: 13, color: theme.colors.textSecondary },
  divider: { height: 1, backgroundColor: theme.colors.border }
});
