import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';

import { PremiumPressable } from './ui/PremiumPressable';
import { Text } from './ui/Text';
import { theme } from '../theme';

interface WelcomeHomeAnimationProps {
  userId: string;
  communityId: string;
  communityName: string;
  unitNumber: string;
  firstName: string;
  onComplete: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function WelcomeHomeAnimation({
  communityName,
  unitNumber,
  firstName,
  onComplete,
}: WelcomeHomeAnimationProps) {
  const [phase, setPhase] = useState(0);

  /*
   * ============================================================
   * MASTER ANIMATION VALUES
   * ============================================================
   */

  const screenOpacity = useRef(new Animated.Value(1)).current;

  const brandOpacity = useRef(new Animated.Value(0)).current;
  const brandY = useRef(new Animated.Value(18)).current;
  const brandScale = useRef(new Animated.Value(0.96)).current;

  const buildingOpacity = useRef(new Animated.Value(0)).current;
  const buildingY = useRef(new Animated.Value(28)).current;
  const buildingScale = useRef(new Animated.Value(0.96)).current;

  const pathProgress = useRef(new Animated.Value(0)).current;

  const destinationGlow = useRef(new Animated.Value(0)).current;
  const destinationScale = useRef(new Animated.Value(0.8)).current;

  const welcomeOpacity = useRef(new Animated.Value(0)).current;
  const welcomeY = useRef(new Animated.Value(24)).current;
  const welcomeScale = useRef(new Animated.Value(0.96)).current;

  const skipOpacity = useRef(new Animated.Value(1)).current;

  /*
   * ============================================================
   * UNIT PARSING
   * ============================================================
   *
   * Examples:
   * 9A
   * 10B
   * 1A
   */

  const match = unitNumber
    .toUpperCase()
    .trim()
    .match(/^([0-9]+)([A-Z])$/);

  const floorRaw = match ? parseInt(match[1], 10) : 1;
  const sideRaw = match ? match[2] : 'A';

  const floor = Math.max(1, Math.min(10, floorRaw));
  const isLeft = sideRaw === 'A';

  /*
   * ============================================================
   * BUILDING GEOMETRY
   * ============================================================
   */

  const floorHeight = 34;

  const targetY =
    -(floor - 1) * floorHeight -
    floorHeight / 2;

  const targetX = isLeft ? -46 : 46;

  const dotX = pathProgress.interpolate({
    inputRange: [0, 0.65, 1],
    outputRange: [0, 0, targetX],
  });

  const dotY = pathProgress.interpolate({
    inputRange: [0, 0.65, 1],
    outputRange: [0, targetY, targetY],
  });

  /*
   * ============================================================
   * DESTINATION POSITION
   * ============================================================
   */

  const destinationX = isLeft ? -46 : 46;

  /*
   * ============================================================
   * MASTER SEQUENCE
   * ============================================================
   */

  useEffect(() => {
    let cancelled = false;

    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        const timer = setTimeout(resolve, ms);

        return () => clearTimeout(timer);
      });

    const run = async () => {
      /*
       * --------------------------------------------------------
       * PHASE 1
       * BRAND
       * --------------------------------------------------------
       */

      setPhase(0);

      Animated.parallel([
        Animated.timing(brandOpacity, {
          toValue: 1,
          duration: 450,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),

        Animated.spring(brandScale, {
          toValue: 1,
          damping: 15,
          stiffness: 140,
          mass: 0.8,
          useNativeDriver: true,
        }),

        Animated.timing(brandY, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();

      await wait(950);

      if (cancelled) return;

      /*
       * --------------------------------------------------------
       * TRANSITION
       * BRAND MOVES UP
       * BUILDING ENTERS FROM BELOW
       * --------------------------------------------------------
       */

      setPhase(1);

      Animated.parallel([
        Animated.timing(brandOpacity, {
          toValue: 0,
          duration: 350,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),

        Animated.timing(brandY, {
          toValue: -24,
          duration: 450,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),

        Animated.timing(buildingOpacity, {
          toValue: 1,
          duration: 450,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),

        Animated.spring(buildingY, {
          toValue: 0,
          damping: 18,
          stiffness: 120,
          mass: 0.9,
          useNativeDriver: true,
        }),

        Animated.spring(buildingScale, {
          toValue: 1,
          damping: 18,
          stiffness: 120,
          mass: 0.9,
          useNativeDriver: true,
        }),
      ]).start();

      await wait(600);

      if (cancelled) return;

      /*
       * --------------------------------------------------------
       * PHASE 2
       * BUILDING + PATH
       * --------------------------------------------------------
       */

      setPhase(2);

      Animated.timing(pathProgress, {
        toValue: 1,
        duration: 1250,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      }).start();

      await wait(1350);

      if (cancelled) return;

      /*
       * --------------------------------------------------------
       * PHASE 3
       * DESTINATION
       * --------------------------------------------------------
       */

      setPhase(3);

      Animated.parallel([
        Animated.sequence([
          Animated.spring(destinationScale, {
            toValue: 1.12,
            damping: 10,
            stiffness: 180,
            useNativeDriver: true,
          }),

          Animated.spring(destinationScale, {
            toValue: 1,
            damping: 14,
            stiffness: 150,
            useNativeDriver: true,
          }),
        ]),

        Animated.sequence([
          Animated.timing(destinationGlow, {
            toValue: 1,
            duration: 250,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),

          Animated.timing(destinationGlow, {
            toValue: 0.65,
            duration: 250,
            easing: Easing.inOut(Easing.cubic),
            useNativeDriver: true,
          }),

          Animated.timing(destinationGlow, {
            toValue: 1,
            duration: 220,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
      ]).start();

      await wait(750);

      if (cancelled) return;

      /*
       * --------------------------------------------------------
       * PHASE 4
       * BUILDING TRANSITIONS INTO WELCOME
       * --------------------------------------------------------
       */

      setPhase(4);

      Animated.parallel([
        Animated.timing(buildingOpacity, {
          toValue: 0,
          duration: 400,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),

        Animated.timing(buildingY, {
          toValue: -18,
          duration: 450,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),

        Animated.timing(welcomeOpacity, {
          toValue: 1,
          duration: 450,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),

        Animated.spring(welcomeY, {
          toValue: 0,
          damping: 18,
          stiffness: 130,
          mass: 0.9,
          useNativeDriver: true,
        }),

        Animated.spring(welcomeScale, {
          toValue: 1,
          damping: 18,
          stiffness: 130,
          mass: 0.9,
          useNativeDriver: true,
        }),

        Animated.timing(skipOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();

      await wait(1500);

      if (cancelled) return;

      /*
       * --------------------------------------------------------
       * PHASE 5
       * EXIT
       * --------------------------------------------------------
       */

      Animated.timing(screenOpacity, {
        toValue: 0,
        duration: 350,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      }).start();

      await wait(400);

      if (cancelled) return;

      onComplete();
    };

    run();

    return () => {
      cancelled = true;

      brandOpacity.stopAnimation();
      brandY.stopAnimation();
      brandScale.stopAnimation();

      buildingOpacity.stopAnimation();
      buildingY.stopAnimation();
      buildingScale.stopAnimation();

      pathProgress.stopAnimation();

      destinationGlow.stopAnimation();
      destinationScale.stopAnimation();

      welcomeOpacity.stopAnimation();
      welcomeY.stopAnimation();
      welcomeScale.stopAnimation();

      screenOpacity.stopAnimation();
      skipOpacity.stopAnimation();
    };
  }, [
    brandOpacity,
    brandY,
    brandScale,
    buildingOpacity,
    buildingY,
    buildingScale,
    pathProgress,
    destinationGlow,
    destinationScale,
    welcomeOpacity,
    welcomeY,
    welcomeScale,
    screenOpacity,
    skipOpacity,
    onComplete,
  ]);

  /*
   * ============================================================
   * SKIP
   * ============================================================
   */

  const handleSkip = () => {
    onComplete();
  };

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: screenOpacity,
        },
      ]}
    >
      {/* SKIP */}

      <Animated.View
        style={[
          styles.skipWrapper,
          {
            opacity: skipOpacity,
          },
        ]}
      >
        <PremiumPressable
          style={styles.skipButton}
          onPress={handleSkip}
        >
          <Text style={styles.skipText}>
            Skip
          </Text>
        </PremiumPressable>
      </Animated.View>

      {/* =====================================================
          BRAND
      ===================================================== */}

      {phase < 2 && (
        <Animated.View
          style={[
            styles.brandContainer,
            {
              opacity: brandOpacity,
              transform: [
                { translateY: brandY },
                { scale: brandScale },
              ],
            },
          ]}
        >
          <View style={styles.brandMark}>
            <Text style={styles.brandMarkText}>
              R
            </Text>
          </View>

          <Text style={styles.brandTitle}>
            REGENCY SALMA
          </Text>

          <View style={styles.brandDivider} />

          <Text style={styles.brandSubtitle}>
            {communityName}
          </Text>
        </Animated.View>
      )}

      {/* =====================================================
          BUILDING
      ===================================================== */}

      {phase >= 1 && phase < 4 && (
        <Animated.View
          style={[
            styles.buildingContainer,
            {
              opacity: buildingOpacity,
              transform: [
                { translateY: buildingY },
                { scale: buildingScale },
              ],
            },
          ]}
        >
          <View style={styles.buildingHeader}>
            <Text style={styles.buildingTitle}>
              YOUR HOME
            </Text>

            <Text style={styles.buildingSubtitle}>
              {communityName}
            </Text>
          </View>

          <View style={styles.buildingGrid}>

            {/* Vertical building spine */}

            <View style={styles.buildingSpine} />

            {Array.from({ length: 10 }).map((_, index) => {
              const currentFloor = 10 - index;
              const isTargetFloor =
                currentFloor === floor;

              return (
                <View
                  key={currentFloor}
                  style={styles.floorRow}
                >
                  <Text style={styles.floorNumber}>
                    {currentFloor}
                  </Text>

                  {/* LEFT UNIT */}

                  <View
                    style={[
                      styles.room,
                      isTargetFloor &&
                        isLeft &&
                        styles.targetRoom,
                    ]}
                  >
                    {isTargetFloor && isLeft && (
                      <Animated.View
                        style={[
                          styles.roomGlow,
                          {
                            opacity:
                              destinationGlow,
                            transform: [
                              {
                                scale:
                                  destinationScale,
                              },
                            ],
                          },
                        ]}
                      />
                    )}

                    <Text
                      style={[
                        styles.roomLabel,
                        isTargetFloor &&
                          isLeft &&
                          styles.targetRoomLabel,
                      ]}
                    >
                      A
                    </Text>
                  </View>

                  {/* CENTER */}

                  <View style={styles.centerShaft}>
                    <View style={styles.centerLine} />
                  </View>

                  {/* RIGHT UNIT */}

                  <View
                    style={[
                      styles.room,
                      isTargetFloor &&
                        !isLeft &&
                        styles.targetRoom,
                    ]}
                  >
                    {isTargetFloor && !isLeft && (
                      <Animated.View
                        style={[
                          styles.roomGlow,
                          {
                            opacity:
                              destinationGlow,
                            transform: [
                              {
                                scale:
                                  destinationScale,
                              },
                            ],
                          },
                        ]}
                      />
                    )}

                    <Text
                      style={[
                        styles.roomLabel,
                        isTargetFloor &&
                          !isLeft &&
                          styles.targetRoomLabel,
                      ]}
                    >
                      B
                    </Text>
                  </View>
                </View>
              );
            })}

            {/* =================================================
                TRAVEL MARKER
            ================================================= */}

            <Animated.View
              style={[
                styles.travelMarker,
                {
                  transform: [
                    {
                      translateX: dotX,
                    },
                    {
                      translateY: dotY,
                    },
                  ],
                },
              ]}
            >
              <View style={styles.travelMarkerInner} />
            </Animated.View>

            {/* DESTINATION PIN */}

            <Animated.View
              style={[
                styles.destinationPin,
                {
                  left:
                    SCREEN_WIDTH / 2 +
                    destinationX -
                    12,
                  top:
                    10 +
                    (10 - floor) *
                      floorHeight -
                    12,
                  opacity:
                    destinationGlow,
                  transform: [
                    {
                      scale:
                        destinationScale,
                    },
                  ],
                },
              ]}
            >
              <View style={styles.destinationPinDot} />
            </Animated.View>
          </View>

          <View style={styles.unitBadge}>
            <Text style={styles.unitBadgeLabel}>
              HOME
            </Text>

            <Text style={styles.unitBadgeValue}>
              {unitNumber}
            </Text>
          </View>
        </Animated.View>
      )}

      {/* =====================================================
          WELCOME
      ===================================================== */}

      {phase >= 4 && (
        <Animated.View
          style={[
            styles.welcomeContainer,
            {
              opacity: welcomeOpacity,
              transform: [
                { translateY: welcomeY },
                { scale: welcomeScale },
              ],
            },
          ]}
        >
          <View style={styles.welcomeIcon}>
            <Text style={styles.welcomeIconText}>
              ✓
            </Text>
          </View>

          <Text style={styles.welcomeEyebrow}>
            WELCOME HOME
          </Text>

          <Text style={styles.welcomeTitle}>
            Welcome home, {firstName}.
          </Text>

          <Text style={styles.welcomeBody}>
            Your home at {communityName}
            {'\n'}
            {unitNumber} is ready.
          </Text>
        </Animated.View>
      )}
    </Animated.View>
  );
}

/*
 * ================================================================
 * STYLES
 * ================================================================
 */

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },

  /*
   * ============================================================
   * SKIP
   * ============================================================
   */

  skipWrapper: {
    position: 'absolute',
    top: 54,
    right: 20,
    zIndex: 100,
  },

  skipButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },

  skipText: {
    fontFamily:
      'PlusJakartaSans_600SemiBold',
    fontSize: 13,
    color: theme.colors.textSecondary,
  },

  /*
   * ============================================================
   * BRAND
   * ============================================================
   */

  brandContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  brandMark: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#C79A57',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },

  brandMarkText: {
    fontFamily:
      'PlusJakartaSans_700Bold',
    fontSize: 21,
    color: theme.colors.primary,
    letterSpacing: 1,
  },

  brandTitle: {
    fontFamily:
      'PlusJakartaSans_700Bold',
    fontSize: 23,
    color: theme.colors.primary,
    letterSpacing: 2.4,
  },

  brandDivider: {
    width: 42,
    height: 1,
    backgroundColor: '#C79A57',
    marginVertical: 10,
  },

  brandSubtitle: {
    fontFamily:
      'PlusJakartaSans_500Medium',
    fontSize: 13,
    color: theme.colors.textSecondary,
    letterSpacing: 0.4,
  },

  /*
   * ============================================================
   * BUILDING
   * ============================================================
   */

  buildingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  buildingHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },

  buildingTitle: {
    fontFamily:
      'PlusJakartaSans_700Bold',
    fontSize: 15,
    color: theme.colors.primary,
    letterSpacing: 1.8,
  },

  buildingSubtitle: {
    marginTop: 5,
    fontFamily:
      'PlusJakartaSans_500Medium',
    fontSize: 12,
    color: theme.colors.textSecondary,
  },

  buildingGrid: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },

  buildingSpine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor:
      'rgba(20,61,42,0.12)',
  },

  floorRow: {
    height: 34,
    flexDirection: 'row',
    alignItems: 'center',
  },

  floorNumber: {
    width: 24,
    marginRight: 8,
    fontFamily:
      'PlusJakartaSans_500Medium',
    fontSize: 9,
    color: theme.colors.textSecondary,
    textAlign: 'right',
  },

  room: {
    width: 48,
    height: 25,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(20,61,42,0.16)',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },

  targetRoom: {
    borderColor: theme.colors.primary,
    borderWidth: 1.5,
    backgroundColor: '#F7FBF8',
  },

  roomLabel: {
    fontFamily:
      'PlusJakartaSans_600SemiBold',
    fontSize: 10,
    color: theme.colors.textSecondary,
  },

  targetRoomLabel: {
    color: theme.colors.primary,
  },

  roomGlow: {
    ...StyleSheet.absoluteFill,
    borderRadius: 6,
    backgroundColor:
      'rgba(199,154,87,0.18)',
  },

  centerShaft: {
    width: 28,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },

  centerLine: {
    width: 1,
    height: 20,
    backgroundColor:
      'rgba(20,61,42,0.08)',
  },

  /*
   * ============================================================
   * TRAVEL MARKER
   * ============================================================
   */

  travelMarker: {
    position: 'absolute',
    bottom: -10,
    left: '50%',
    width: 14,
    height: 14,
    marginLeft: -7,
    marginTop: -7,
    borderRadius: 7,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.28,
    shadowRadius: 5,
    elevation: 5,
  },

  travelMarkerInner: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },

  /*
   * ============================================================
   * DESTINATION
   * ============================================================
   */

  destinationPin: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor:
      'rgba(199,154,87,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  destinationPinDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#C79A57',
  },

  /*
   * ============================================================
   * UNIT BADGE
   * ============================================================
   */

  unitBadge: {
    marginTop: 22,
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor:
      'rgba(20,61,42,0.10)',
  },

  unitBadgeLabel: {
    fontFamily:
      'PlusJakartaSans_600SemiBold',
    fontSize: 8,
    letterSpacing: 1.5,
    color: theme.colors.textSecondary,
  },

  unitBadgeValue: {
    marginTop: 2,
    fontFamily:
      'PlusJakartaSans_700Bold',
    fontSize: 16,
    color: theme.colors.primary,
  },

  /*
   * ============================================================
   * WELCOME
   * ============================================================
   */

  welcomeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },

  welcomeIcon: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#E7F2EC',
    borderWidth: 1,
    borderColor:
      'rgba(20,61,42,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },

  welcomeIconText: {
    fontFamily:
      'PlusJakartaSans_700Bold',
    fontSize: 30,
    color: theme.colors.primary,
  },

  welcomeEyebrow: {
    fontFamily:
      'PlusJakartaSans_600SemiBold',
    fontSize: 11,
    letterSpacing: 2,
    color: '#C0795E',
    marginBottom: 10,
  },

  welcomeTitle: {
    fontFamily:
      'PlusJakartaSans_700Bold',
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: -0.7,
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: 12,
  },

  welcomeBody: {
    fontFamily:
      'PlusJakartaSans_400Regular',
    fontSize: 15,
    lineHeight: 23,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});
