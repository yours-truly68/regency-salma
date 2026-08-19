import { PremiumPressable } from '../../src/components/ui/PremiumPressable';
import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Text } from '../../src/components/ui/Text';
import { AnimatedScale } from '../../src/components/ui/AnimatedScale';
import { ScreenEntrance } from '../../src/components/ui/ScreenEntrance';
import { AddVisitorModal } from '../../src/components/add-visitor-modal';
import { useScreenInsets } from '../../src/hooks/useScreenInsets';
import { theme } from '../../src/theme';

export default function QuickActionsScreen() {
  const router = useRouter();
  const { top, bottomClearance } = useScreenInsets(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleClose = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(app)/home');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: top, paddingBottom: bottomClearance }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <PremiumPressable style={styles.closeButton} onPress={handleClose}>
            <Feather name="x" size={24} color={theme.colors.textPrimary} />
          </PremiumPressable>
        </View>

        <ScreenEntrance delay={100}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>What would you like{'\n'}to do today?</Text>
            <Text style={styles.subtitle}>Everything you need,{'\n'}one tap away.</Text>
          </View>
        </ScreenEntrance>

        {/* Circular Arrangement */}
        <View style={styles.circleContainer}>
          {/* Top: Add Visitor */}
          <AnimatedScale delay={200} style={[styles.actionItem, styles.posTop]}>
            <PremiumPressable style={styles.innerItem} onPress={() => setShowAddModal(true)}>
              <View style={[styles.actionIconArea, { backgroundColor: '#E8F5E9' }]}>
                <Feather name="user-plus" size={22} color={theme.colors.primary} />
              </View>
              <Text style={styles.actionLabel}>Add Visitor</Text>
            </PremiumPressable>
          </AnimatedScale>

          {/* Left: Raise Issue */}
          <AnimatedScale delay={250} style={[styles.actionItem, styles.posLeft]}>
            <PremiumPressable style={styles.innerItem} onPress={() => router.push('/services/maintenance')}>
              <View style={[styles.actionIconArea, { backgroundColor: '#FBE9E7' }]}>
                <Feather name="settings" size={22} color="#8B4513" />
              </View>
              <Text style={styles.actionLabel}>Raise Issue</Text>
            </PremiumPressable>
          </AnimatedScale>

          {/* Center */}
          <AnimatedScale delay={150}>
            <PremiumPressable style={styles.centerButton} onPress={handleClose}>
              <View style={styles.dotsGrid}>
                <View style={styles.dot} />
                <View style={styles.dot} />
                <View style={styles.dot} />
                <View style={styles.dot} />
              </View>
            </PremiumPressable>
          </AnimatedScale>

          {/* Right: Delivery Pass */}
          <AnimatedScale delay={300} style={[styles.actionItem, styles.posRight]}>
            <PremiumPressable style={styles.innerItem} onPress={() => router.push('/visitors')}>
              <View style={[styles.actionIconArea, { backgroundColor: '#FFF3E0' }]}>
                <Feather name="box" size={22} color={theme.colors.accent} />
              </View>
              <Text style={styles.actionLabel}>Delivery Pass</Text>
            </PremiumPressable>
          </AnimatedScale>

          {/* Bottom: Emergency */}
          <AnimatedScale delay={350} style={[styles.actionItem, styles.posBottom]}>
            <PremiumPressable style={styles.innerItem} onPress={() => Alert.alert('Emergency Alert', 'Security and emergency contacts have been notified.')}>
              <View style={[styles.actionIconArea, { backgroundColor: '#FFEBEE' }]}>
                <Feather name="alert-triangle" size={22} color={theme.colors.error} />
              </View>
              <Text style={styles.actionLabel}>Emergency</Text>
            </PremiumPressable>
          </AnimatedScale>
        </View>

        <View style={{ flex: 1, minHeight: 32 }} />

        {/* Community Event Card */}
        <ScreenEntrance delay={450}>
          <View style={styles.eventCard}>
            <View style={styles.eventContent}>
              <Text style={styles.eventTitle}>Community dinner this Sunday! 🎉</Text>
              <Text style={styles.eventDesc}>Join us for a fun evening at the Club House.</Text>
              <PremiumPressable style={styles.eventLink} onPress={() => router.push('/calendar')}>
                <Text style={styles.eventLinkText}>View details</Text>
                <Feather name="arrow-right" size={14} color={theme.colors.accent} style={{ marginLeft: 4 }} />
              </PremiumPressable>
            </View>
            <Image
              // eslint-disable-next-line @typescript-eslint/no-require-imports
              source={require('../../assets/community-event-illustration.jpg')}
              style={styles.eventImage}
              resizeMode="cover"
            />
          </View>

          <View style={styles.footerNoteContainer}>
            <Text style={styles.footerNoteText}>You can always customize your quick actions{'\n'}from your profile settings.</Text>
          </View>
        </ScreenEntrance>
      </ScrollView>

      <AddVisitorModal visible={showAddModal} onClose={() => setShowAddModal(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingVertical: 16,
    flexDirection: 'row',
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  titleContainer: {
    marginTop: 12,
    marginBottom: 36,
    alignItems: 'center',
  },
  title: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 28,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 36,
    letterSpacing: -0.6,
  },
  subtitle: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  circleContainer: {
    height: 320,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: '100%',
    maxWidth: 340,
  },
  centerButton: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
    zIndex: 10,
  },
  dotsGrid: {
    width: 24,
    height: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'space-between',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
  actionItem: {
    position: 'absolute',
    alignItems: 'center',
    width: 100,
  },
  innerItem: {
    alignItems: 'center',
  },
  actionIconArea: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  actionLabel: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 13,
    color: theme.colors.textPrimary,
    textAlign: 'center',
  },
  posTop: { top: 0 },
  posBottom: { bottom: 0 },
  posLeft: { left: 0 },
  posRight: { right: 0 },
  eventCard: {
    flexDirection: 'row',
    padding: 18,
    borderRadius: 20,
    backgroundColor: '#FBF5ED',
    borderWidth: 1,
    borderColor: 'rgba(210, 125, 103, 0.12)',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 18,
  },
  eventContent: {
    flex: 1,
    paddingRight: 16,
  },
  eventTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 16,
    letterSpacing: -0.3,
    color: '#2A1810',
    marginBottom: 4,
  },
  eventDesc: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 13,
    color: '#736154',
    marginBottom: 10,
    lineHeight: 18,
  },
  eventLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventLinkText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 13,
    color: theme.colors.accent,
  },
  eventImage: {
    width: 80,
    height: 80,
    borderRadius: 14,
  },
  footerNoteContainer: {
    backgroundColor: 'rgba(0,0,0,0.02)',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  footerNoteText: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 13,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
  },
});