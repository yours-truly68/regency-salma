import { PremiumPressable } from '../../src/components/ui/PremiumPressable';
import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from '../../src/components/ui/Text';
import { ScreenEntrance } from '../../src/components/ui/ScreenEntrance';
import { AppHeader } from '../../src/components/ui/AppHeader';
import { useScreenInsets } from '../../src/hooks/useScreenInsets';
import { theme } from '../../src/theme';

const FEED_FIXTURES = [
  { id: '1', author: 'Regency Admin', time: '2 hours ago', content: 'The main pool will be closed for maintenance this Tuesday from 9 AM to 3 PM. Apologies for the inconvenience.', pinned: true, likes: 24, comments: 5 },
  { id: '2', author: 'Priya Patel', time: '5 hours ago', content: 'Anyone found a set of keys near Tower B lobby? Attached a keychain with a blue car.', pinned: false, likes: 3, comments: 12 },
];

export default function CommunityScreen() {
  const { bottomClearance } = useScreenInsets(true);
  const [activeTab, setActiveTab] = useState('feed');

  return (
    <View style={styles.container}>
      <AppHeader variant="tabroot" title="Community" />

      <View style={styles.tabs}>
        {['feed', 'polls', 'events', 'gallery'].map((tab) => (
          <PremiumPressable
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </PremiumPressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.feed}>
        {FEED_FIXTURES.map((post, index) => (
          <ScreenEntrance key={post.id} delay={100 + index * 100}>
            <View style={styles.feedCard}>
              {post.pinned && (
                <View style={styles.pinnedBadge}>
                  <Feather name="anchor" size={12} color={theme.colors.accent} />
                  <Text style={styles.pinnedText}>Pinned</Text>
                </View>
              )}
              <View style={styles.postHeader}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{post.author.charAt(0)}</Text>
                </View>
                <View>
                  <Text style={styles.author}>{post.author}</Text>
                  <Text style={styles.time}>{post.time}</Text>
                </View>
              </View>
              <Text style={styles.content}>{post.content}</Text>

              <View style={styles.actions}>
                <PremiumPressable style={styles.actionBtn}>
                  <Feather name="heart" size={16} color={theme.colors.textSecondary} />
                  <Text style={styles.actionText}>{post.likes}</Text>
                </PremiumPressable>
                <PremiumPressable style={styles.actionBtn}>
                  <Feather name="message-square" size={16} color={theme.colors.textSecondary} />
                  <Text style={styles.actionText}>{post.comments}</Text>
                </PremiumPressable>
              </View>
            </View>
          </ScreenEntrance>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingHorizontal: 20,
  },
  tab: {
    paddingVertical: 14,
    marginRight: 24,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: theme.colors.primary,
  },
  tabText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 15,
    color: theme.colors.textSecondary,
  },
  tabTextActive: {
    color: theme.colors.primary,
  },
  feed: {
    padding: 20,
    paddingBottom: 100,
  },
  feedCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    borderRadius: 18,
    padding: 20,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  pinnedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    backgroundColor: '#FFF7ED',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
  },
  pinnedText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 12,
    color: theme.colors.accent,
    marginLeft: 6,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  author: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 15,
    color: theme.colors.textPrimary,
  },
  time: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  content: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 15,
    color: theme.colors.textPrimary,
    lineHeight: 23,
    marginBottom: 18,
  },
  actions: {
    flexDirection: 'row',
    gap: 24,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.04)',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  actionText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 14,
    color: theme.colors.textSecondary,
  }
});
