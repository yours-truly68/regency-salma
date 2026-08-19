import { PremiumPressable } from './ui/PremiumPressable';
import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, StyleSheet, Modal, SafeAreaView, Switch } from 'react-native';
import { Text } from './ui/Text';
import { theme } from '../theme';

export interface QuickActionItem {
  id: string;
  icon: any;
  label: string;
  bgColor: string;
  iconColor: string;
  visible: boolean;
}

interface QuickActionsEditorModalProps {
  visible: boolean;
  actions: QuickActionItem[];
  onClose: () => void;
  onSave: (updated: QuickActionItem[]) => void;
}

export function QuickActionsEditorModal({ visible, actions, onClose, onSave }: QuickActionsEditorModalProps) {
  const [localActions, setLocalActions] = useState<QuickActionItem[]>(actions);

  React.useEffect(() => {
    if (visible) {
      setLocalActions(actions);
    }
  }, [visible, actions]);

  const toggleAction = (id: string) => {
    const updated = localActions.map(a => 
      a.id === id ? { ...a, visible: !a.visible } : a
    );
    if (updated.filter(a => a.visible).length === 0) return; // Enforce min 1
    setLocalActions(updated);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...localActions];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    setLocalActions(updated);
  };

  const moveDown = (index: number) => {
    if (index === localActions.length - 1) return;
    const updated = [...localActions];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    setLocalActions(updated);
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Edit quick actions</Text>
          <Text style={styles.subtitle}>Choose which actions appear on your Home screen.</Text>
        </View>

        <View style={styles.list}>
          {localActions.map((action, index) => (
            <View key={action.id} style={styles.row}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconContainer, { backgroundColor: action.bgColor }]}>
                  <Feather name={action.icon} size={18} color={action.iconColor} />
                </View>
                <Text style={styles.rowLabel}>{action.label}</Text>
              </View>
              <View style={styles.rowRight}>
                <View style={styles.arrows}>
                  <PremiumPressable onPress={() => moveUp(index)} disabled={index === 0} style={{ opacity: index === 0 ? 0.3 : 1 }}>
                    <Feather name="chevron-up" size={20} color={theme.colors.textSecondary} />
                  </PremiumPressable>
                  <PremiumPressable onPress={() => moveDown(index)} disabled={index === localActions.length - 1} style={{ opacity: index === localActions.length - 1 ? 0.3 : 1 }}>
                    <Feather name="chevron-down" size={20} color={theme.colors.textSecondary} />
                  </PremiumPressable>
                </View>
                <Switch 
                  value={action.visible} 
                  onValueChange={() => toggleAction(action.id)} 
                  trackColor={{ true: theme.colors.primary, false: 'rgba(0,0,0,0.1)' }}
                />
              </View>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <PremiumPressable style={styles.cancelBtn} onPress={onClose}>
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </PremiumPressable>
          <PremiumPressable style={styles.saveBtn} onPress={() => onSave(localActions)}>
            <Text style={styles.saveBtnText}>Save changes</Text>
          </PremiumPressable>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFBF7',
  },
  header: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  title: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 22,
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  list: {
    flex: 1,
    padding: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  rowLabel: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 15,
    color: theme.colors.textPrimary,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  arrows: {
    flexDirection: 'row',
    gap: 12,
  },
  footer: {
    padding: 24,
    flexDirection: 'row',
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  cancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelBtnText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 14,
    color: theme.colors.textPrimary,
  },
  saveBtn: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveBtnText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 14,
    color: '#FFF',
  },
});
