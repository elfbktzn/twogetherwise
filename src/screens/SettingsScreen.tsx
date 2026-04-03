import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { logout, changePassword } from '@/services/authService';

export function SettingsScreen() {
  const { firebaseUser, userProfile } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: () => logout() },
    ]);
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await changePassword(newPassword);
      Alert.alert('Success', 'Password changed successfully.');
      setNewPassword('');
      setShowPasswordChange(false);
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Settings</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Account</Text>
        <Text style={styles.value}>
          {userProfile?.isAnonymous
            ? 'Anonymous User'
            : firebaseUser?.email || 'Unknown'}
        </Text>
      </View>

      {!userProfile?.isAnonymous && (
        <View style={styles.card}>
          <TouchableOpacity
            onPress={() => setShowPasswordChange(!showPasswordChange)}
          >
            <Text style={styles.actionText}>Change Password</Text>
          </TouchableOpacity>

          {showPasswordChange && (
            <View style={styles.passwordSection}>
              <TextInput
                style={styles.input}
                placeholder="New password"
                placeholderTextColor="#888"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
              />
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleChangePassword}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.saveBtnText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutBtnText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    paddingHorizontal: 20,
    paddingTop: 70,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  label: {
    fontSize: 13,
    color: '#888',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#fff',
  },
  actionText: {
    fontSize: 16,
    color: '#e94560',
    fontWeight: '500',
  },
  passwordSection: {
    marginTop: 12,
  },
  input: {
    backgroundColor: '#1a1a2e',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#fff',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  saveBtn: {
    backgroundColor: '#e94560',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  logoutBtn: {
    marginTop: 24,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e94560',
  },
  logoutBtnText: {
    color: '#e94560',
    fontSize: 16,
    fontWeight: '600',
  },
});
