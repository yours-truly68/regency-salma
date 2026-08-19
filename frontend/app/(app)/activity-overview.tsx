import { PremiumPressable } from '../../src/components/ui/PremiumPressable';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { AppHeader } from '../../src/components/ui/AppHeader';
import { useScreenInsets } from '../../src/hooks/useScreenInsets';
import { Text } from '../../src/components/ui/Text';
import { ScreenEntrance } from '../../src/components/ui/ScreenEntrance';
import { useIssues, removeIssue } from '../../src/store/issues';
import { theme } from '../../src/theme';

const FIXTURES = {
  visitors: [
    { id: 1, name: 'Rahul Sharma', time: 'Today · 6:30 PM', type: 'Personal Visitor', status: 'Expected' },
    { id: 2, name: 'Amazon Delivery', time: 'Today · 2:15 PM', type: 'Delivery', status: 'Arrived' },
    { id: 3, name: 'Swiggy', time: 'Today · 1:00 PM', type: 'Delivery', status: 'Completed' },
  ],
  deliveries: [
    { id: 1, item: 'Amazon Package', time: 'Today · 2:15 PM', status: 'At Gate' },
  ],
  issues: [
  ],
  staff: [
    { id: 1, name: 'Sunita (Maid)', time: 'Today · 8:00 AM - 10:00 AM', status: 'Present' },
    { id: 2, name: 'Ramesh (Driver)', time: 'Today · 9:00 AM', status: 'Present' },
  ]
};

export default function ActivityOverviewScreen() {
  const { bottomClearance } = useScreenInsets(false);
  const issues = useIssues();

  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({
    'Visitors': false,
    'Deliveries': false,
    'Issues': false,
    'Staff': false
  });

  const toggleSection = (title: string) => {
    setExpanded(prev => ({ ...prev, [title]: !prev[title] }));
  };

  const renderSection = (title: string, data: any[], icon: any, color: string, onDelete?: (id: string) => void) => {
    const isExpanded = expanded[title];
    return (
      <View style={styles.section} key={title}>
        <PremiumPressable style={styles.sectionHeader} onPress={() => toggleSection(title)} activeOpacity={0.8}>
          <View style={styles.sectionTitleRow}>
            <Feather name={icon} size={18} color={color} />
            <Text style={styles.sectionTitle}>{title} <Text style={{color: theme.colors.textSecondary}}>({data.length})</Text></Text>
          </View>
          <Feather name={isExpanded ? 'chevron-up' : 'chevron-down'} size={20} color={theme.colors.textSecondary} />
        </PremiumPressable>
        {isExpanded && (
          <View style={styles.expandedContent}>
            {data.map((item, index) => (
              <View key={item.id ?? index} style={styles.detailRow}>
                <View style={styles.detailInfo}>
                  <Text style={styles.detailTitle}>{item.name || item.item || item.title}</Text>
                  <Text style={styles.detailStatus}>{item.status || item.time}</Text>
                </View>
                {onDelete && (
                  <PremiumPressable
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    accessibilityRole="button"
                    accessibilityLabel={`Delete ${item.title || item.name || item.item || ''}`}
                    onPress={() => onDelete(item.id)}
                  >
                    <Feather name="trash-2" size={15} color={theme.colors.textSecondary} />
                  </PremiumPressable>
                )}
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader variant="subscreen" title="Activity Overview" />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: bottomClearance }]}>
        <ScreenEntrance delay={100}>
          {renderSection('Visitors', FIXTURES.visitors, 'user', theme.colors.primary)}
        </ScreenEntrance>
        <ScreenEntrance delay={200}>
          {renderSection('Deliveries', FIXTURES.deliveries, 'package', theme.colors.accent)}
        </ScreenEntrance>
        <ScreenEntrance delay={300}>
          {renderSection('Issues', issues, 'tool', '#8B4513', (id) => removeIssue(id))}
        </ScreenEntrance>
        <ScreenEntrance delay={400}>
          {renderSection('Staff', FIXTURES.staff, 'users', theme.colors.primary)}
        </ScreenEntrance>
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
  section: {
    marginBottom: 18,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sectionTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 17,
    letterSpacing: -0.3,
    color: theme.colors.textPrimary,
  },
  sectionCount: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 15,
    color: theme.colors.textSecondary,
  },
  expandedContent: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    borderTopWidth: 0,
    marginTop: -4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.04)',
  },
  detailInfo: {
    flex: 1,
    paddingRight: 12,
  },
  detailTitle: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 15,
    color: theme.colors.textPrimary,
  },
  detailStatus: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 2,
  }
});