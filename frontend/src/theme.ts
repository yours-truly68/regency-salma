export const theme = {
  colors: {
    primary: '#143D2A', // Deep Hunter Green
    background: '#F9F7F2', // Warm Off-White / Cream
    surface: '#FFFFFF',
    textPrimary: '#1F2937', // Dark Charcoal
    textSecondary: '#6B7280', // Slate Gray
    accent: '#D27D67', // Muted Terracotta
    error: '#EF4444',
    errorBackground: '#FEE2E2',
    success: '#10B981',
    successBackground: '#D1FAE5',
    border: '#E5E7EB',
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
  },
  radii: {
    s: 8,
    m: 12,
    l: 16,
    xl: 24,
    pill: 100,
  },
  typography: {
    heading: {
      fontFamily: 'PlusJakartaSans_700Bold',
      fontSize: 28,
      color: '#1F2937',
    },
    subheading: {
      fontFamily: 'PlusJakartaSans_600SemiBold',
      fontSize: 20,
      color: '#1F2937',
    },
    body: {
      fontFamily: 'PlusJakartaSans_400Regular',
      fontSize: 16,
      color: '#1F2937',
    },
    bodySecondary: {
      fontFamily: 'PlusJakartaSans_400Regular',
      fontSize: 14,
      color: '#6B7280',
    },
    label: {
      fontFamily: 'PlusJakartaSans_600SemiBold',
      fontSize: 12,
      textTransform: 'uppercase' as const,
      letterSpacing: 0.5,
      color: '#6B7280',
    },
  },
  shadows: {
    card: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
  },
};
