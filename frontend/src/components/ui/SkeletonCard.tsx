import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Skeleton } from './Skeleton';
import { Card } from './Card';

interface SkeletonCardProps {
  style?: ViewStyle;
}

export function SkeletonCard({ style }: SkeletonCardProps) {
  return (
    <Card style={[styles.card, style]}>
      <View style={styles.header}>
        <Skeleton width={40} height={40} borderRadius={20} />
        <View style={styles.headerText}>
          <Skeleton width={120} height={16} style={{ marginBottom: 8 }} />
          <Skeleton width={80} height={12} />
        </View>
      </View>
      <Skeleton width="100%" height={60} style={{ marginBottom: 12 }} />
      <Skeleton width="40%" height={32} borderRadius={16} />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerText: {
    marginLeft: 12,
  },
});
