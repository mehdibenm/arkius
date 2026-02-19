'use client';

import { useEffect, useState, useRef } from 'react';
import {
  Settings,
  User as UserIcon,
  Lock,
  Users,
  Plus,
  Trash2,
  Camera,
  Save,
  Shield,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import {
  updateUser,
  getAllUsers,
  createUser as createUserInDb,
  deleteUser as deleteUserInDb,
} from '@/lib/firestore';
import { uploadMedia } from '@/lib/storage';
import AppLayout from '@/components/layout/AppLayout';
import type { User } from '@/types';

type SettingsTab = 'profile' | 'security' | 'users';

export default function SettingsPage() {
  const { user, changePassword, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  // Profile state
  const [displayName, setDisplayName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Password state
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  // User management state
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [addingUser, setAddingUser] = useState(false);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName);
      setDescription(user.description || '');
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === 'users' && user?.role === 'admin') {
      setLoadingUsers(true);
      getAllUsers()
        .then(setUsers)
        .catch(console.error)
        .finally(() => setLoadingUsers(false));
    }
  }, [activeTab, user]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateUser(user.uid, {
        displayName,
        description,
      });
      await refreshUser();
      toast.success('Profile updated');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (file: File, field: 'photoURL' | 'logoURL') => {
    if (!user) return;
    try {
      const { url } = await uploadMedia(file, user.uid);
      await updateUser(user.uid, { [field]: url });
      await refreshUser();
      toast.success('Image updated');
    } catch {
      toast.error('Failed to upload image');
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setChangingPassword(true);
    try {
      await changePassword(newPassword);
      toast.success('Password changed successfully');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch {
      toast.error('Failed to change password. You may need to re-authenticate.');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleAddUser = async () => {
    if (!newUserEmail || !newUserPassword || !newUserName) return;
    setAddingUser(true);
    try {
      // Note: In production, use Admin SDK via API route to create users
      // This is a simplified version for demonstration
      const newUser: User = {
        uid: uuidv4(),
        email: newUserEmail,
        displayName: newUserName,
        role: 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await createUserInDb(newUser);
      setUsers((prev) => [...prev, newUser]);
      toast.success('User added successfully');
      setShowAddUser(false);
      setNewUserName('');
      setNewUserEmail('');
      setNewUserPassword('');
    } catch {
      toast.error('Failed to add user');
    } finally {
      setAddingUser(false);
    }
  };

  const handleDeleteUser = async (uid: string) => {
    if (uid === user?.uid) {
      toast.error('Cannot delete your own account');
      return;
    }
    try {
      await deleteUserInDb(uid);
      setUsers((prev) => prev.filter((u) => u.uid !== uid));
      toast.success('User removed');
    } catch {
      toast.error('Failed to remove user');
    }
  };

  const tabs = [
    { id: 'profile' as const, label: 'Profile', icon: <UserIcon size={16} /> },
    { id: 'security' as const, label: 'Password', icon: <Lock size={16} /> },
    ...(user?.role === 'admin'
      ? [{ id: 'users' as const, label: 'Users', icon: <Users size={16} /> }]
      : []),
  ];

  return (
    <AppLayout>
      <div className="mb-6">
        <h2 className="text-[24px] font-semibold text-[var(--text-primary)]">
          Settings
        </h2>
        <p className="text-[14px] text-[var(--text-secondary)] mt-1">
          Manage your account and preferences
        </p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar tabs */}
        <div className="w-[200px] shrink-0">
          <div className="apple-card p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-[var(--accent)] text-white'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 max-w-[600px]">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="apple-card p-6 space-y-6 fade-in">
              <h3 className="text-[18px] font-semibold text-[var(--text-primary)]">
                Profile Information
              </h3>

              {/* Profile photo */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-[var(--bg-tertiary)] overflow-hidden flex items-center justify-center">
                    {user?.photoURL ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={user.photoURL}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserIcon size={32} className="text-[var(--text-tertiary)]" />
                    )}
                  </div>
                  <button
                    onClick={() => photoInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[var(--accent)] text-white flex items-center justify-center shadow-md"
                  >
                    <Camera size={12} />
                  </button>
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handlePhotoUpload(file, 'photoURL');
                    }}
                  />
                </div>
                <div>
                  <p className="text-[14px] font-medium text-[var(--text-primary)]">
                    Profile Photo
                  </p>
                  <p className="text-[12px] text-[var(--text-tertiary)]">
                    JPG or PNG, max 5MB
                  </p>
                </div>
              </div>

              {/* Logo */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-xl bg-[var(--bg-tertiary)] overflow-hidden flex items-center justify-center">
                    {user?.logoURL ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={user.logoURL}
                        alt="Logo"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Settings size={32} className="text-[var(--text-tertiary)]" />
                    )}
                  </div>
                  <button
                    onClick={() => logoInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[var(--accent)] text-white flex items-center justify-center shadow-md"
                  >
                    <Camera size={12} />
                  </button>
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handlePhotoUpload(file, 'logoURL');
                    }}
                  />
                </div>
                <div>
                  <p className="text-[14px] font-medium text-[var(--text-primary)]">
                    Account Logo
                  </p>
                  <p className="text-[12px] text-[var(--text-tertiary)]">
                    JPG or PNG, max 5MB
                  </p>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-[13px] font-medium text-[var(--text-secondary)] mb-1.5">
                  Display Name
                </label>
                <input
                  type="text"
                  className="apple-input"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>

              {/* Email (read-only) */}
              <div>
                <label className="block text-[13px] font-medium text-[var(--text-secondary)] mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  className="apple-input bg-[var(--bg-secondary)]"
                  value={user?.email || ''}
                  readOnly
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-[13px] font-medium text-[var(--text-secondary)] mb-1.5">
                  Account Description
                </label>
                <textarea
                  className="apple-input min-h-[80px] resize-none"
                  placeholder="Describe your account or brand..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="apple-btn apple-btn-primary"
              >
                {saving ? <span className="spinner" /> : <Save size={14} />}
                Save Changes
              </button>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="apple-card p-6 space-y-6 fade-in">
              <h3 className="text-[18px] font-semibold text-[var(--text-primary)]">
                Change Password
              </h3>

              <div>
                <label className="block text-[13px] font-medium text-[var(--text-secondary)] mb-1.5">
                  New Password
                </label>
                <input
                  type="password"
                  className="apple-input"
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[var(--text-secondary)] mb-1.5">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  className="apple-input"
                  placeholder="Confirm your new password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                />
              </div>

              <button
                onClick={handleChangePassword}
                disabled={changingPassword || !newPassword || !confirmNewPassword}
                className="apple-btn apple-btn-primary"
              >
                {changingPassword ? <span className="spinner" /> : <Lock size={14} />}
                Change Password
              </button>
            </div>
          )}

          {/* Users Tab (Admin only) */}
          {activeTab === 'users' && user?.role === 'admin' && (
            <div className="space-y-4 fade-in">
              <div className="apple-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-[18px] font-semibold text-[var(--text-primary)]">
                      User Management
                    </h3>
                    <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">
                      Add and manage users who can access this platform
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddUser(true)}
                    className="apple-btn apple-btn-primary text-[13px]"
                  >
                    <Plus size={14} /> Add User
                  </button>
                </div>

                {loadingUsers ? (
                  <div className="flex justify-center py-8">
                    <div className="spinner" style={{ width: 28, height: 28 }} />
                  </div>
                ) : (
                  <div className="divide-y divide-[var(--border-light)] -mx-6">
                    {users.map((u) => (
                      <div
                        key={u.uid}
                        className="flex items-center gap-4 px-6 py-3 hover:bg-[var(--bg-secondary)] transition-colors"
                      >
                        <div className="w-10 h-10 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center">
                          {u.photoURL ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={u.photoURL}
                              alt={u.displayName}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <UserIcon
                              size={18}
                              className="text-[var(--text-tertiary)]"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-[14px] font-medium text-[var(--text-primary)]">
                              {u.displayName}
                            </p>
                            {u.role === 'admin' && (
                              <span className="text-[10px] font-bold text-[var(--accent)] bg-blue-50 px-1.5 py-0.5 rounded">
                                Admin
                              </span>
                            )}
                          </div>
                          <p className="text-[12px] text-[var(--text-tertiary)]">
                            {u.email}
                          </p>
                        </div>
                        {u.uid !== user.uid && (
                          <button
                            onClick={() => handleDeleteUser(u.uid)}
                            className="p-2 rounded-lg hover:bg-red-50 text-[var(--text-tertiary)] hover:text-[var(--danger)] transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add User Modal */}
              {showAddUser && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                  <div className="apple-card w-full max-w-[420px] p-6 fade-in">
                    <h3 className="text-[18px] font-semibold text-[var(--text-primary)] mb-4">
                      Add New User
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-[13px] font-medium text-[var(--text-secondary)] mb-1.5">
                          Full Name
                        </label>
                        <input
                          type="text"
                          className="apple-input"
                          placeholder="John Doe"
                          value={newUserName}
                          onChange={(e) => setNewUserName(e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block text-[13px] font-medium text-[var(--text-secondary)] mb-1.5">
                          Email Address
                        </label>
                        <input
                          type="email"
                          className="apple-input"
                          placeholder="user@example.com"
                          value={newUserEmail}
                          onChange={(e) => setNewUserEmail(e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block text-[13px] font-medium text-[var(--text-secondary)] mb-1.5">
                          Password
                        </label>
                        <input
                          type="password"
                          className="apple-input"
                          placeholder="At least 6 characters"
                          value={newUserPassword}
                          onChange={(e) => setNewUserPassword(e.target.value)}
                        />
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => {
                            setShowAddUser(false);
                            setNewUserName('');
                            setNewUserEmail('');
                            setNewUserPassword('');
                          }}
                          className="apple-btn apple-btn-secondary flex-1"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleAddUser}
                          disabled={
                            addingUser ||
                            !newUserName ||
                            !newUserEmail ||
                            !newUserPassword
                          }
                          className="apple-btn apple-btn-primary flex-1"
                        >
                          {addingUser ? (
                            <span className="spinner" />
                          ) : (
                            <>
                              <Plus size={14} /> Add User
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
