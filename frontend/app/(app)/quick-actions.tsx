/* eslint-disable @typescript-eslint/no-require-imports */
import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '../../src/components/ui/Text';
import { AnimatedScale } from '../../src/components/ui/AnimatedScale';
import { AnimatedEntrance } from '../../src/components/ui/AnimatedEntrance';
import { theme } from '../../src/theme';

export default function QuickActionsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => router.back()}>
          <Feather name="x" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <AnimatedEntrance delay={100}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>What would you like to do today?</Text>
            <Text style={styles.subtitle}>Everything you need, one tap away.</Text>
          </View>
        </AnimatedEntrance>

        {/* Circular Arrangement */}
        <View style={styles.circleContainer}>
          {/* Top */}
          <AnimatedScale delay={200} style={[styles.actionItem, styles.posTop]}>
            <TouchableOpacity style={styles.innerItem}>
              <View style={[styles.actionIconArea, { backgroundColor: '#E8F5E9' }]}>
                <Feather name="user-plus" size={20} color={theme.colors.primary} />
              </View>
              <Text style={styles.actionLabel}>Add Visitor</Text>
            </TouchableOpacity>
          </AnimatedScale>

          {/* Left */}
          <AnimatedScale delay={250} style={[styles.actionItem, styles.posLeft]}>
            <TouchableOpacity style={styles.innerItem}>
              <View style={[styles.actionIconArea, { backgroundColor: '#FBE9E7' }]}>
                <Feather name="settings" size={20} color="#8B4513" />
              </View>
              <Text style={styles.actionLabel}>Raise Issue</Text>
            </TouchableOpacity>
          </AnimatedScale>

          {/* Center */}
          <AnimatedScale delay={150}>
            <TouchableOpacity style={styles.centerButton} onPress={() => router.back()}>
              <Feather name="grid" size={28} color="#FFF" />
            </TouchableOpacity>
          </AnimatedScale>

          {/* Right */}
          <AnimatedScale delay={300} style={[styles.actionItem, styles.posRight]}>
            <TouchableOpacity style={styles.innerItem}>
              <View style={[styles.actionIconArea, { backgroundColor: '#FFF3E0' }]}>
                <Feather name="box" size={20} color={theme.colors.accent} />
              </View>
              <Text style={styles.actionLabel}>Delivery Pass</Text>
            </TouchableOpacity>
          </AnimatedScale>

          {/* Bottom */}
          <AnimatedScale delay={350} style={[styles.actionItem, styles.posBottom]}>
            <TouchableOpacity style={styles.innerItem}>
              <View style={[styles.actionIconArea, { backgroundColor: '#FFEBEE' }]}>
                <Feather name="alert-triangle" size={20} color={theme.colors.error} />
              </View>
              <Text style={styles.actionLabel}>Emergency</Text>
            </TouchableOpacity>
          </AnimatedScale>
        </View>

        <View style={{ flex: 1 }} />

        {/* Community Event Card */}
        <AnimatedEntrance delay={450}>
          <View style={styles.eventCard}>
            <View style={styles.eventContent}>
              <Text style={styles.eventTitle}>Community dinner this Sunday! 🎉</Text>
              <Text style={styles.eventDesc}>Join us for a fun evening at the Club House.</Text>
              <TouchableOpacity style={styles.eventLink} onPress={() => {}}>
                <Text style={styles.eventLinkText}>View details</Text>
                <Feather name="arrow-right" size={14} color={theme.colors.accent} style={{marginLeft: 4}} />
              </TouchableOpacity>
            </View>
            <Image 
              source={require('../../assets/community-event-illustration.jpg')} 
              style={styles.eventImage}
              resizeMode="cover"
            />
          </View>
        </AnimatedEntrance>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  titleContainer: {
    marginTop: 24,
    marginBottom: 48,
    alignItems: 'center',
  },
  title: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 24,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  circleContainer: {
    height: 300,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: '100%',
    marginBottom: 40,
  },
  centerButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
    zIndex: 10,
  },
  actionItem: {
    position: 'absolute',
    alignItems: 'center',
    width: 80,
  },
  innerItem: {
    alignItems: 'center',
  },
  actionIconArea: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  actionLabel: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 12,
    color: theme.colors.textPrimary,
    textAlign: 'center',
  },
  posTop: { top: 0 },
  posBottom: { bottom: 0 },
  posLeft: { left: '10%' },
  posRight: { right: '10%' },
  eventCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#FDFBF7', 
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
  },
  eventContent: {
    flex: 1,
    paddingRight: 12,
  },
  eventTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 16,
    color: theme.colors.textPrimary,
    marginBottom: 6,
  },
  eventDesc: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  eventLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventLinkText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 14,
    color: theme.colors.accent,
  },
  eventImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
});
