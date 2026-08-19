/* eslint-disable @typescript-eslint/no-require-imports */
import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, ScrollView, Image, Platform, UIManager, Animated, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Text } from '../../src/components/ui/Text';
import { PremiumPressable } from '../../src/components/ui/PremiumPressable';
import { ScreenEntrance } from '../../src/components/ui/ScreenEntrance';
import { QuickActionsEditorModal, QuickActionItem } from '../../src/components/quick-actions-editor-modal';
import { VisitorApprovalCard, VisitorApproval } from '../../src/components/visitor-approval-card';
import { AddVisitorModal } from '../../src/components/add-visitor-modal';
import { useOpenIssues, removeIssue, ISSUE_CATEGORIES } from '../../src/store/issues';
import { useCalendarEvents } from '../../src/store/calendar-events';
import { useAvailability, setAvailability } from '../../src/store/availability';
import { theme } from '../../src/theme';
import { useSession } from '../../src/store/auth';
import { AppHeader } from '../../src/components/ui/AppHeader';
import { useScreenInsets } from '../../src/hooks/useScreenInsets';
import { EmptyState } from '../../src/components/ui/EmptyState';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function HomeScreen() {
  const router = useRouter();
  const { bottomClearance } = useScreenInsets(true);
  const { user } = useSession() || {};
  const displayName = user?.firstName || 'Resident';
  const unitNumber = user?.unitNumber || '';

  const [isQuickActionsVisible, setIsQuickActionsVisible] = useState(false);
  const [isAddVisitorVisible, setIsAddVisitorVisible] = useState(false);
  const isAway = useAvailability();
  const [gateVisitor, setGateVisitor] = useState<VisitorApproval | null>(null);
  const [quickActions, setQuickActions] = useState<QuickActionItem[]>([
    { id: '1', icon: 'user', label: 'Add Visitor', bgColor: '#E8F5E9', iconColor: theme.colors.primary, visible: true },
    { id: '2', icon: 'package', label: 'Delivery Pass', bgColor: '#FFF3E0', iconColor: '#E65100', visible: true },
    { id: '3', icon: 'tool', label: 'Raise Issue', bgColor: '#FBE9E7', iconColor: '#8B4513', visible: true },
    { id: '4', icon: 'alert-circle', label: 'Emergency', bgColor: '#FFEBEE', iconColor: '#C62828', visible: true }
  ]);

  const openIssues = useOpenIssues();
  const calendarEvents = useCalendarEvents();

  const todayStr = (() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  })();

  const nextEvent = calendarEvents
    .filter((e) => e.date >= todayStr)
    .sort((a, b) => a.date.localeCompare(b.date))[0];

  const eventDateLabel = (() => {
    if (!nextEvent) return '';
    try {
      return new Date(`${nextEvent.date}T00:00:00`).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return '';
    }
  })();

  const statCards = [
    { label: 'Visitors', value: '0', route: '/visitors' as const },
    { label: 'Deliveries', value: '0', route: '/visitors' as const },
    { label: 'Maintenance', value: String(openIssues.length).padStart(2, '0'), route: '/services/maintenance' as const },
    { label: 'Staff', value: '0', route: '/services/staff-attendance' as const },
  ];

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning,';
    if (hour < 17) return 'Good afternoon,';
    if (hour < 21) return 'Good evening,';
    return 'Good night,';
  })();

  const { height: windowHeight } = useWindowDimensions();
  const bgFade = useRef(new Animated.Value(0)).current;
  const bgParallax = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(bgFade, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();
  }, [bgFade]);

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: bgParallax } } }],
    { useNativeDriver: true },
  );

  const bgTranslate = Animated.multiply(bgParallax, -0.35);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.bgWrapper, { opacity: bgFade, transform: [{ translateY: bgTranslate }] }]}
        pointerEvents="none"
      >
        <Image
          source={require('../../assets/home-residential-hero.png')}
          style={[styles.bgImage, { height: windowHeight + 200 }]}
          resizeMode="cover"
        />
        <View style={styles.bgOverlay} />
      </Animated.View>

      <AppHeader variant="home" firstName={displayName} />

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomClearance }]}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        <View style={styles.headerSection}>
          {/* 2. Greeting & Resident Identity */}
          <ScreenEntrance delay={50}>
            <View style={styles.greetingContainer}>
              <Text style={styles.greetingText}>{greeting}</Text>

              <View style={styles.nameRow}>
                <View style={styles.nameLeft}>
                  <Text style={styles.nameText}>{displayName}</Text>
                  <Text style={styles.waveEmoji}>👋</Text>
                </View>

                {/* 3. Property Context */}
                <PremiumPressable onPress={() => router.push('/my-home')} style={styles.unitChip}>
                  <Text style={styles.unitChipText}>{unitNumber} · My Home</Text>
                </PremiumPressable>
              </View>
            </View>
          </ScreenEntrance>
        </View>

        {/* 4. Residential Hero Image — HIDDEN (temporarily disabled, not deleted) */}
        <View style={styles.heroWrapperHidden}>
          <View style={styles.heroImageContainerHidden}>
            <Image
              source={require('../../assets/hero-image.png')}
              style={styles.heroImage}
              resizeMode="cover"
            />
            <PremiumPressable
              style={[styles.availabilityBadge, isAway && styles.availabilityBadgeAway, styles.availabilityBadgeOnImage]}
              activeOpacity={0.85}
              accessibilityRole="switch"
              accessibilityState={{ checked: !isAway }}
              accessibilityLabel={isAway ? 'Set status to At Home' : 'Set status to Away'}
              onPress={() => setAvailability(!isAway)}
            >
              <View style={[styles.availabilityDot, isAway && styles.availabilityDotAway]} />
              <Text style={[styles.availabilityText, isAway && styles.availabilityTextAway]}>
                {isAway ? 'Away' : 'At Home'}
              </Text>
            </PremiumPressable>
          </View>
        </View>

        <View style={styles.mainContent}>
          {/* 5. Today at a glance */}
          <ScreenEntrance delay={100}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Today at a glance</Text>
              <PremiumPressable hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => router.push('/activity-overview')}>
                <Text style={styles.sectionLink}>View all</Text>
              </PremiumPressable>
            </View>

            {/* 6. Glance grid */}
            <View style={styles.glanceGrid}>
              {statCards.map((stat) => (
                <PremiumPressable
                  key={stat.label}
                  style={({ pressed }) => [styles.glanceCard, pressed && styles.glanceCardPressed]}
                  activeOpacity={0.9}
                  scaleTo={0.95}
                  accessibilityRole="button"
                  accessibilityLabel={`${stat.label}: ${stat.value}`}
                  onPress={() => router.push(stat.route)}
                >
                  <Text style={styles.glanceValue}>{stat.value}</Text>
                  <Text style={styles.glanceLabel} numberOfLines={1}>{stat.label}</Text>
                </PremiumPressable>
              ))}
            </View>
          </ScreenEntrance>

          {/* 4b. Gate requests */}
          <ScreenEntrance delay={130}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Gate requests</Text>
              <PremiumPressable hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => router.push('/visitors')}>
                <Text style={styles.sectionLink}>View all</Text>
              </PremiumPressable>
            </View>
            {gateVisitor ? (
              <VisitorApprovalCard visitor={gateVisitor} onDelete={() => setGateVisitor(null)} />
            ) : (
              <View style={styles.gateEmptyCard}>
                <View style={styles.gateEmptyIcon}>
                  <Feather name="shield" size={20} color={theme.colors.success} />
                </View>
                <View style={styles.gateEmptyTextWrap}>
                  <Text style={styles.gateEmptyTitle}>No gate requests</Text>
                  <Text style={styles.gateEmptyDesc}>You're all clear — no one is waiting at the gate.</Text>
                </View>
              </View>
            )}
          </ScreenEntrance>

          {/* 5. Quick Actions */}
          <ScreenEntrance delay={150}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Quick actions</Text>
              <PremiumPressable hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => setIsQuickActionsVisible(true)}>
                <Text style={styles.sectionLink}>Edit</Text>
              </PremiumPressable>
            </View>

            <View style={styles.actionsRow}>
              {quickActions.filter((a) => a.visible).slice(0, 4).map((action) => {
                const getActionRoute = (id: string) => {
                  if (id === '2') return '/visitors' as const;
                  if (id === '3') return '/services/raise-issue' as const;
                  return '/quick-actions' as const;
                };
                return (
                  <View key={action.id} style={styles.actionItem}>
                    <PremiumPressable style={styles.actionCircle} onPress={() => {
                      if (action.id === '1') {
                        setIsAddVisitorVisible(true);
                      } else {
                        router.push(getActionRoute(action.id));
                      }
                    }}>
                      <View style={[styles.actionIconContainer, { backgroundColor: action.bgColor }]}>
                        <Feather name={action.icon as React.ComponentProps<typeof Feather>['name']} size={28} color={action.iconColor} />
                      </View>
                    </PremiumPressable>
                    <Text style={styles.actionLabel}>{action.label}</Text>
                  </View>
                );
              })}
            </View>
          </ScreenEntrance>

          {/* 6. Current issues */}
          <ScreenEntrance delay={180}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Current issues</Text>
              <PremiumPressable hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => router.push('/services/maintenance')}>
                <Text style={styles.sectionLink}>View all</Text>
              </PremiumPressable>
            </View>
            {openIssues.length > 0 ? (
              openIssues.map((issue) => {
                const meta = ISSUE_CATEGORIES.find((c) => c.id === issue.category);
                const chipBg = meta?.bg ?? '#E8F5E9';
                const chipColor = meta?.color ?? theme.colors.primary;
                return (
                  <View key={issue.id} style={styles.issueCard}>
                    <View style={[styles.issueIcon, { backgroundColor: chipBg }]}>
                      <Feather name={issue.icon} size={20} color={chipColor} />
                    </View>
                    <View style={styles.issueInfo}>
                      <Text style={styles.issueTitle} numberOfLines={1}>{issue.title}</Text>
                      <Text style={styles.issueMeta}>{issue.category} · {issue.time}</Text>
                    </View>
                    <View style={[styles.issueStatus, issue.status === 'Open' ? styles.issueStatusOpen : styles.issueStatusProgress]}>
                      <Text style={[styles.issueStatusText, issue.status === 'Open' ? styles.issueStatusTextOpen : styles.issueStatusTextProgress]}>{issue.status}</Text>
                    </View>
                    <PremiumPressable
                      style={styles.issueDelete}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      accessibilityRole="button"
                      accessibilityLabel={`Delete ${issue.title}`}
                      onPress={() => removeIssue(issue.id)}
                    >
                      <Feather name="trash-2" size={16} color={theme.colors.textSecondary} />
                    </PremiumPressable>
                  </View>
                );
              })
            ) : (
              <EmptyState
                icon="tool"
                title="No open issues"
                description="Everything is running smoothly. Report a new issue anytime from Quick actions."
              />
            )}
          </ScreenEntrance>

          {/* 8. Community Event Card */}
          <ScreenEntrance delay={250}>
            <View style={styles.eventCard}>
              <View style={styles.eventContent}>
                <Text style={styles.eventTitle}>{nextEvent ? nextEvent.title : 'No upcoming events'}</Text>
                <Text style={styles.eventDesc}>{nextEvent
                  ? `${eventDateLabel}${nextEvent.location ? ` · ${nextEvent.location}` : ''}${nextEvent.time ? ` · ${nextEvent.time}` : ''}`
                  : 'Check the calendar for upcoming community activities.'}</Text>
                <PremiumPressable style={styles.eventLink} onPress={() => router.push('/calendar')}>
                  <Text style={styles.eventLinkText}>View details</Text>
                  <Feather name="arrow-right" size={14} color={theme.colors.accent} style={{ marginLeft: 4 }} />
                </PremiumPressable>
              </View>
              <Image
                source={require('../../assets/community-event-illustration.jpg')}
                style={styles.eventImage}
                resizeMode="cover"
              />
            </View>
          </ScreenEntrance>
        </View>

        <QuickActionsEditorModal
          visible={isQuickActionsVisible}
          actions={quickActions}
          onClose={() => setIsQuickActionsVisible(false)}
          onSave={(updated) => { setQuickActions(updated); setIsQuickActionsVisible(false); }}
        />
        <AddVisitorModal visible={isAddVisitorVisible} onClose={() => setIsAddVisitorVisible(false)} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  bgWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  bgImage: {
    width: '100%',
  },
  bgOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(249, 247, 242, 0.82)',
  },
  scrollContent: {
    backgroundColor: 'transparent',
  },
  headerSection: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  greetingContainer: {
    marginTop: 6,
  },
  greetingText: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 18,
    letterSpacing: 0.1,
    color: '#6B7280',
    marginBottom: 4,
  },
  availabilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    gap: 6,
  },
  availabilityBadgeAway: {
    backgroundColor: '#FEF3C7',
  },
  availabilityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.success,
  },
  availabilityDotAway: {
    backgroundColor: '#D97706',
  },
  availabilityText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 12,
    color: theme.colors.primary,
  },
  availabilityTextAway: {
    color: '#B45309',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  nameLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  nameText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 36,
    lineHeight: 42,
    letterSpacing: -0.7,
    color: '#111827',
  },
  waveEmoji: {
    fontSize: 30,
    marginLeft: 8,
  },
  unitChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
    marginLeft: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
  },
  unitChipText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 14,
    color: theme.colors.textPrimary,
  },
  heroWrapper: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  heroWrapperHidden: {
    display: 'none',
  },
  heroImageContainer: {
    position: 'relative',
    width: '100%',
    height: 320,
    borderRadius: 20,
    overflow: 'hidden',
  },
  heroImageContainerHidden: {
    position: 'relative',
    width: '100%',
    height: 320,
    borderRadius: 20,
    overflow: 'hidden',
    display: 'none',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  availabilityBadgeOnImage: {
    position: 'absolute',
    top: 24,
    right: 24,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 3,
  },
  mainContent: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 14,
    marginTop: 8,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 16,
    letterSpacing: -0.3,
    color: '#111827',
  },
  sectionLink: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 13,
    color: theme.colors.accent,
  },
  glanceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  glanceCard: {
    flexGrow: 1,
    flexBasis: 0,
    minWidth: 148,
    minHeight: 120,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E0E4E2',
    borderBottomWidth: 6,
    borderBottomColor: '#CCD1D3',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glanceCardPressed: {
    borderBottomWidth: 2,
  },
  glanceValue: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 30,
    lineHeight: 34,
    letterSpacing: -0.6,
    color: theme.colors.textPrimary,
  },
  glanceLabel: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 14,
    lineHeight: 19,
    color: theme.colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  issueCard: {
    backgroundColor: theme.colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  issueIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  issueInfo: {
    flex: 1,
  },
  issueTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 15,
    letterSpacing: -0.2,
    color: theme.colors.textPrimary,
    marginBottom: 2,
  },
  issueMeta: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  issueStatus: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 100,
  },
  issueStatusOpen: {
    backgroundColor: '#FEF3C7',
  },
  issueStatusProgress: {
    backgroundColor: '#EFF6FF',
  },
  issueStatusText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 11,
  },
  issueStatusTextOpen: {
    color: '#B45309',
  },
  issueStatusTextProgress: {
    color: '#1D4ED8',
  },
  issueDelete: {
    marginLeft: 10,
    padding: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
    marginBottom: 20,
  },
  gateEmptyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    padding: 14,
    marginBottom: 20,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  gateEmptyIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gateEmptyTextWrap: {
    flex: 1,
  },
  gateEmptyTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 15,
    color: theme.colors.textPrimary,
    marginBottom: 2,
  },
  gateEmptyDesc: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 12,
    color: theme.colors.textSecondary,
    lineHeight: 17,
  },
  actionItem: {
    alignItems: 'center',
    width: 100,
  },
  actionCircle: {
    marginBottom: 8,
  },
  actionIconContainer: {
    width: 76,
    height: 76,
    borderRadius: 38,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  actionLabel: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 14,
    color: '#1F2937',
    textAlign: 'center',
    lineHeight: 18,
  },
  eventCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 20,
    backgroundColor: '#FBF5ED',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(210, 125, 103, 0.12)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
    marginBottom: 20,
  },
  eventContent: {
    flex: 1,
    paddingRight: 14,
  },
  eventTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 15,
    letterSpacing: -0.3,
    color: '#2A1810',
    marginBottom: 4,
  },
  eventDesc: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 12,
    color: '#736154',
    marginBottom: 10,
    lineHeight: 17,
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
    width: 82,
    height: 82,
    borderRadius: 14,
  },
});
