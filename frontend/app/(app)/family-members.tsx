import { EmptyState } from '../../src/components/ui/EmptyState';
import { Feather } from '@expo/vector-icons';
import { PremiumPressable } from '../../src/components/ui/PremiumPressable';
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Modal, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Text } from '../../src/components/ui/Text';
import { ScreenEntrance } from '../../src/components/ui/ScreenEntrance';
import { AppHeader } from '../../src/components/ui/AppHeader';
import { useScreenInsets } from '../../src/hooks/useScreenInsets';
import { theme } from '../../src/theme';

const INITIAL_MEMBERS = [
  { id: '1', name: 'Priya Mehta', rel: 'Spouse', status: 'Active' },
  { id: '2', name: 'Diya Mehta', rel: 'Daughter', status: 'Active' },
];

export default function FamilyMembersScreen() {
  const router = useRouter();
  const { bottomClearance } = useScreenInsets(false);
  
  const [members, setMembers] = useState(INITIAL_MEMBERS);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<'add'|'edit'|'actions'>('add');
  const [selectedMember, setSelectedMember] = useState<any>(null);
  
  const [formData, setFormData] = useState({ name: '', rel: '', phone: '', email: '' });

  const openAdd = () => {
    setFormData({ name: '', rel: '', phone: '', email: '' });
    setModalMode('add');
    setModalVisible(true);
  };

  const openActions = (member: any) => {
    setSelectedMember(member);
    setModalMode('actions');
    setModalVisible(true);
  };

  const handleSave = () => {
    if (modalMode === 'add') {
      setMembers([...members, { id: Date.now().toString(), name: formData.name, rel: formData.rel, status: 'Active' }]);
    } else if (modalMode === 'edit' && selectedMember) {
      setMembers(members.map(m => m.id === selectedMember.id ? { ...m, name: formData.name, rel: formData.rel } : m));
    }
    setModalVisible(false);
  };

  const handleBlock = () => {
    setMembers(members.map(m => m.id === selectedMember.id ? { ...m, status: 'Blocked' } : m));
    setModalVisible(false);
  };

  const handleUnblock = () => {
    setMembers(members.map(m => m.id === selectedMember.id ? { ...m, status: 'Active' } : m));
    setModalVisible(false);
  };

  const handleRemove = () => {
    setMembers(members.filter(m => m.id !== selectedMember.id));
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <AppHeader
        variant="subscreen"
        title="Family Members"
        onBackPress={() => router.canGoBack() ? router.back() : router.replace('/my-home')}
        rightAction={
          <PremiumPressable
            style={styles.addBtn}
            onPress={openAdd}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather name="plus" size={20} color={theme.colors.primary} />
          </PremiumPressable>
        }
      />

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: bottomClearance }]}>
        <Text style={styles.devNote}>Local fixture behavior only. Changes will reset.</Text>
        
        {members.length > 0 ? members.map((member, i) => (
          <ScreenEntrance key={member.id} delay={i * 100}>
            <View style={[styles.card, member.status === 'Blocked' && { opacity: 0.6 }]}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{member.name.charAt(0)}</Text>
              </View>
              <View style={styles.info}>
                <Text style={styles.name}>{member.name}</Text>
                <Text style={styles.rel}>{member.rel} • {member.status}</Text>
              </View>
              <PremiumPressable style={styles.moreBtn} onPress={() => openActions(member)}>
                <Feather name="more-vertical" size={20} color={theme.colors.textSecondary} />
              </PremiumPressable>
            </View>
          </ScreenEntrance>
        )) : <EmptyState icon="users" title="No family members added" description="You have not added any family members yet." />}
      </ScrollView>

      {/* Shared Modal */}
      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            
            {modalMode === 'actions' && selectedMember && (
              <>
                <Text style={styles.modalTitle}>Manage {selectedMember.name}</Text>
                <PremiumPressable style={styles.modalActionRow} onPress={() => { setFormData(selectedMember); setModalMode('edit'); }}>
                  <Text style={styles.modalActionText}>Edit member</Text>
                </PremiumPressable>
                {selectedMember.status === 'Active' ? (
                  <PremiumPressable style={styles.modalActionRow} onPress={handleBlock}>
                    <Text style={[styles.modalActionText, { color: theme.colors.accent }]}>Block member</Text>
                  </PremiumPressable>
                ) : (
                  <PremiumPressable style={styles.modalActionRow} onPress={handleUnblock}>
                    <Text style={styles.modalActionText}>Unblock member</Text>
                  </PremiumPressable>
                )}
                <PremiumPressable style={styles.modalActionRow} onPress={handleRemove}>
                  <Text style={[styles.modalActionText, { color: theme.colors.error }]}>Remove member</Text>
                </PremiumPressable>
                <PremiumPressable style={[styles.modalActionRow, { borderBottomWidth: 0, marginTop: 12 }]} onPress={() => setModalVisible(false)}>
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </PremiumPressable>
              </>
            )}

            {(modalMode === 'add' || modalMode === 'edit') && (
              <>
                <Text style={styles.modalTitle}>{modalMode === 'add' ? 'Add family member' : 'Edit member'}</Text>
                
                <TextInput style={styles.input} placeholder="Full name" value={formData.name} onChangeText={t => setFormData({...formData, name: t})} placeholderTextColor="rgba(0,0,0,0.3)" />
                <TextInput style={styles.input} placeholder="Relationship" value={formData.rel} onChangeText={t => setFormData({...formData, rel: t})} placeholderTextColor="rgba(0,0,0,0.3)" />
                <TextInput style={styles.input} placeholder="Mobile number" value={formData.phone} onChangeText={t => setFormData({...formData, phone: t})} keyboardType="phone-pad" placeholderTextColor="rgba(0,0,0,0.3)" />
                <TextInput style={styles.input} placeholder="Email address" value={formData.email} onChangeText={t => setFormData({...formData, email: t})} keyboardType="email-address" placeholderTextColor="rgba(0,0,0,0.3)" />

                <View style={styles.modalButtons}>
                  <PremiumPressable style={styles.modalBtnOutline} onPress={() => setModalVisible(false)}>
                    <Text style={styles.modalBtnOutlineText}>Cancel</Text>
                  </PremiumPressable>
                  <PremiumPressable style={styles.modalBtnSolid} onPress={handleSave}>
                    <Text style={styles.modalBtnSolidText}>Save</Text>
                  </PremiumPressable>
                </View>
              </>
            )}
            
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  addBtn: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ECFDF5', borderRadius: 18 },
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 32 },
  devNote: { fontFamily: 'PlusJakartaSans_400Regular', fontSize: 13, color: theme.colors.textSecondary, marginBottom: 16, textAlign: 'center' },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  avatarText: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 18, color: '#FFF' },
  info: { flex: 1 },
  name: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 16, color: theme.colors.textPrimary, marginBottom: 4 },
  rel: { fontFamily: 'PlusJakartaSans_400Regular', fontSize: 14, color: theme.colors.textSecondary },
  moreBtn: { padding: 8 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { backgroundColor: '#FFFFFF', width: '100%', borderRadius: 24, padding: 28, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.15, shadowRadius: 24, elevation: 8 },
  modalTitle: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 20, letterSpacing: -0.3, color: theme.colors.textPrimary, marginBottom: 20, textAlign: 'center' },
  modalActionRow: { paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)', alignItems: 'center' },
  modalActionText: { fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 16, color: theme.colors.textPrimary },
  modalCancelText: { fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 16, color: theme.colors.textSecondary },
  input: { backgroundColor: '#F9F7F2', height: 52, borderRadius: 14, paddingHorizontal: 16, marginBottom: 14, fontFamily: 'PlusJakartaSans_500Medium', fontSize: 15, color: theme.colors.textPrimary },
  modalButtons: { flexDirection: 'row', gap: 12, marginTop: 16 },
  modalBtnOutline: { flex: 1, height: 48, borderRadius: 100, borderWidth: 1.5, borderColor: 'rgba(0,0,0,0.12)', justifyContent: 'center', alignItems: 'center' },
  modalBtnOutlineText: { fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 15, color: theme.colors.textPrimary },
  modalBtnSolid: { flex: 1, height: 48, borderRadius: 100, backgroundColor: theme.colors.primary, justifyContent: 'center', alignItems: 'center', shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 3 },
  modalBtnSolidText: { fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 15, color: '#FFF' },
});
