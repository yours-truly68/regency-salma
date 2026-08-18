/* eslint-disable @typescript-eslint/no-require-imports */
import React, { useRef } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '../../src/components/ui/Text';
import { Card } from '../../src/components/ui/Card';
import { AnimatedEntrance } from '../../src/components/ui/AnimatedEntrance';
import { theme } from '../../src/theme';

// Fixture Data
const RESIDENT_FIXTURE = { name: 'Rohan', unit: '9A', role: 'Resident' };
const VISITOR_FIXTURE = { name: 'Rahul Sharma', time: 'Today · 6:30 PM', type: 'Personal Visitor' };

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const imageOpacity = useRef(new Animated.Value(0)).current;

  const handleImageLoad = () => {
    Animated.timing(imageOpacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 80 }} showsVerticalScrollIndicator={false}>
        
        {/* Integrated Hero Section */}
        <View style={styles.heroContainer}>
          <Animated.Image 
            source={require('../../assets/home-residential-hero.png')} 
            style={[styles.heroImageAbsolute, { opacity: imageOpacity }]}
            resizeMode="cover"
            onLoad={handleImageLoad}
          />
          {/* Light overlay to ensure text/header readability over complex image */}
          <View style={styles.heroOverlay}>
            
            <View style={[styles.header, { paddingTop: Math.max(insets.top, 12) }]}>
              {/* Empty view to perfectly center the logo against the right-side controls */}
              <View style={{ width: 72 }} />
              
              <Image 
                source={require('../../assets/regency-salma-typographic-logo.png')} 
                style={styles.logoImage} 
                resizeMode="contain" 
              />

              <View style={styles.headerRight}>
                <TouchableOpacity style={styles.bellIcon} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Feather name="bell" size={24} color={theme.colors.textPrimary} />
                  <View style={styles.unreadDot} />
                </TouchableOpacity>
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarText}>{RESIDENT_FIXTURE.name.charAt(0)}</Text>
                </View>
              </View>
            </View>

            <View style={styles.greetingContainer}>
              <Text style={styles.greetingText}>Good evening,</Text>
              <View style={styles.nameRow}>
                <Text style={styles.nameText}>{RESIDENT_FIXTURE.name}</Text>
                <Text style={styles.waveEmoji}>👋</Text>
              </View>
              <View style={styles.unitChip}>
                <Text style={styles.unitChipText}>{RESIDENT_FIXTURE.unit} · My Home</Text>
              </View>
            </View>

          </View>
        </View>

        <View style={styles.contentWrapper}>
          
          {/* Compact Visitor Card */}
          <AnimatedEntrance delay={200}>
            <View style={styles.visitorCard}>
              <View style={styles.visitorHeader}>
                <View style={styles.visitorInfo}>
                  <Text style={styles.visitorName}>{VISITOR_FIXTURE.name} is arriving</Text>
                  <Text style={styles.visitorDetails}>{VISITOR_FIXTURE.time} · {VISITOR_FIXTURE.type}</Text>
                </View>
                <View style={styles.visitorAvatarPlaceholder}>
                  <Text style={styles.visitorAvatarText}>{VISITOR_FIXTURE.name.charAt(0)}</Text>
                </View>
              </View>
              <View style={styles.visitorActions}>
                <TouchableOpacity style={styles.visitorBtnOutline} onPress={() => {}}>
                  <Text style={styles.visitorBtnOutlineText}>View details</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.visitorBtnSolid} onPress={() => {}}>
                  <Text style={styles.visitorBtnSolidText}>Approve</Text>
                </TouchableOpacity>
              </View>
            </View>
          </AnimatedEntrance>

          {/* Today at a glance */}
          <AnimatedEntrance delay={300}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Today at a glance</Text>
              <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Text style={styles.sectionLink}>View all</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.statsRow}>
              <Card style={styles.statCard}>
                <View style={styles.statIconWrapper}>
                  <Feather name="user" size={14} color={theme.colors.primary} />
                  <Text style={styles.statNumber}>03</Text>
                </View>
                <Text style={styles.statLabel}>Visitors</Text>
              </Card>
              <Card style={styles.statCard}>
                <View style={styles.statIconWrapper}>
                  <Feather name="package" size={14} color={theme.colors.accent} />
                  <Text style={styles.statNumber}>01</Text>
                </View>
                <Text style={styles.statLabel}>Deliveries</Text>
              </Card>
              <Card style={styles.statCard}>
                <View style={styles.statIconWrapper}>
                  <Feather name="tool" size={14} color="#8B4513" />
                  <Text style={styles.statNumber}>02</Text>
                </View>
                <Text style={styles.statLabel}>Issues</Text>
              </Card>
              <Card style={styles.statCard}>
                <View style={styles.statIconWrapper}>
                  <Feather name="users" size={14} color={theme.colors.primary} />
                  <Text style={styles.statNumber}>07</Text>
                </View>
                <Text style={styles.statLabel}>Staff</Text>
              </Card>
            </View>
          </AnimatedEntrance>

          {/* Quick actions (Compact Cards) */}
          <AnimatedEntrance delay={400}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Quick actions</Text>
              <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Text style={styles.sectionLink}>Edit</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.actionsRow}>
              <TouchableOpacity style={styles.actionCard} onPress={() => {}}>
                <View style={[styles.actionIconContainer, { backgroundColor: '#E8F5E9' }]}>
                  <Feather name="user-plus" size={16} color={theme.colors.primary} />
                </View>
                <Text style={styles.actionLabel}>Add Visitor</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionCard} onPress={() => {}}>
                <View style={[styles.actionIconContainer, { backgroundColor: '#FFF3E0' }]}>
                  <Feather name="box" size={16} color={theme.colors.accent} />
                </View>
                <Text style={styles.actionLabel}>Delivery Pass</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionCard} onPress={() => {}}>
                <View style={[styles.actionIconContainer, { backgroundColor: '#FBE9E7' }]}>
                  <Feather name="settings" size={16} color="#8B4513" />
                </View>
                <Text style={styles.actionLabel}>Raise Issue</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionCard} onPress={() => {}}>
                <View style={[styles.actionIconContainer, { backgroundColor: '#FFEBEE' }]}>
                  <Feather name="alert-triangle" size={16} color={theme.colors.error} />
                </View>
                <Text style={styles.actionLabel}>Emergency</Text>
              </TouchableOpacity>
            </View>
          </AnimatedEntrance>

          {/* Compact Community Event card */}
          <AnimatedEntrance delay={500}>
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
  heroContainer: {
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    paddingBottom: 24,
    backgroundColor: theme.colors.background, // warm ivory placeholder
  },
  heroImageAbsolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    backgroundColor: 'rgba(249, 247, 242, 0.35)', // subtle ivory translucent overlay to aid text readability without hiding the image
    paddingBottom: 48,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  logoImage: {
    width: 140, // Increased size
    height: 44,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bellIcon: {
    marginRight: 16,
    position: 'relative',
  },
  unreadDot: {
    position: 'absolute',
    top: 0,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.error,
    borderWidth: 1,
    borderColor: '#FFF',
  },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: theme.colors.textPrimary,
  },
  greetingContainer: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  greetingText: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  nameText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 26,
    color: theme.colors.textPrimary,
  },
  waveEmoji: {
    fontSize: 22,
    marginLeft: 8,
  },
  unitChip: {
    backgroundColor: '#FFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  unitChipText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 11,
    color: theme.colors.textPrimary,
  },
  contentWrapper: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  visitorCard: {
    backgroundColor: theme.colors.primary,
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 16,
    marginTop: -32,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  visitorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  visitorInfo: {
    flex: 1,
  },
  visitorName: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 2,
  },
  visitorDetails: {
    fontFamily: 'PlusJakartaSans_400Regular',
    color: 'rgba(255,255,255,0.8)',
    fontSize: 11,
  },
  visitorAvatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  visitorAvatarText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#FFFFFF',
    fontSize: 14,
  },
  visitorActions: {
    flexDirection: 'row',
    gap: 10,
  },
  visitorBtnOutline: {
    flex: 1,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  visitorBtnOutlineText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#FFFFFF',
    fontSize: 12,
  },
  visitorBtnSolid: {
    flex: 1,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  visitorBtnSolidText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#FFFFFF',
    fontSize: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 16,
    color: theme.colors.textPrimary,
  },
  sectionLink: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 12,
    color: theme.colors.accent,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
    paddingHorizontal: 16,
  },
  statCard: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: 'flex-start',
    borderRadius: 10,
  },
  statIconWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 4,
  },
  statNumber: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 16,
    color: theme.colors.textPrimary,
  },
  statLabel: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 10,
    color: theme.colors.textSecondary,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    gap: 8,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  actionIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  actionLabel: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 10,
    color: theme.colors.textPrimary,
    textAlign: 'center',
  },
  eventCard: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 20,
    padding: 12,
    borderRadius: 14,
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
    fontSize: 14,
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  eventDesc: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginBottom: 8,
    lineHeight: 16,
  },
  eventLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventLinkText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 12,
    color: theme.colors.accent,
  },
  eventImage: {
    width: 64,
    height: 64,
    borderRadius: 10,
  },
});
