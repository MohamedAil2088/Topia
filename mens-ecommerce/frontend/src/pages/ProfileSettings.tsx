import React, { useState } from 'react';
import { useAppSelector } from '../hooks/useRedux';
import { FiUser, FiMail, FiLock, FiSave, FiShield } from 'react-icons/fi';
import Swal from 'sweetalert2';
import api from '../utils/api';

const ProfileSettings = () => {
    const user = useAppSelector((state) => state.auth.userInfo);
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [updating, setUpdating] = useState(false);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setUpdating(true);
        try {
            await api.put('/users/profile', { name, email });
            Swal.fire('Success', 'Profile updated successfully', 'success');
        } catch (error: any) {
            Swal.fire('Error', error.response?.data?.message || 'Failed to update profile', 'error');
        } finally {
            setUpdating(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            Swal.fire('Error', 'Passwords do not match', 'error');
            return;
        }

        setUpdating(true);
        try {
            await api.put('/users/password', {
                currentPassword,
                newPassword
            });
            Swal.fire('Success', 'Password changed successfully', 'success');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            Swal.fire('Error', error.response?.data?.message || 'Failed to change password', 'error');
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                    <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-4 rounded-xl">
                            <FiUser size={32} className="text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-gray-900">Profile Settings</h1>
                            <p className="text-gray-500 text-sm">Manage your account information and security</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <div className="text-center mb-6">
                                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-3xl font-black mb-4">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </div>
                                <h3 className="text-xl font-black text-gray-900">{user?.name}</h3>
                                <p className="text-sm text-gray-500">{user?.email}</p>
                            </div>

                            {user?.role === 'admin' && (
                                <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border-2 border-purple-200">
                                    <div className="flex items-center gap-2 text-purple-700">
                                        <FiShield size={20} />
                                        <span className="font-black text-sm">Administrator</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Profile Information */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="bg-blue-100 text-blue-600 p-3 rounded-xl">
                                    <FiUser size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-gray-900">Profile Information</h2>
                                    <p className="text-sm text-gray-500">Update your personal details</p>
                                </div>
                            </div>

                            <form onSubmit={handleUpdateProfile} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-2">
                                        <FiUser className="inline mr-2" size={16} />
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-900 outline-none font-medium transition-all"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-2">
                                        <FiMail className="inline mr-2" size={16} />
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-900 outline-none font-medium transition-all"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={updating}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    <FiSave className="inline mr-2" size={20} />
                                    {updating ? 'Saving...' : 'Save Changes'}
                                </button>
                            </form>
                        </div>

                        {/* Change Password */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="bg-green-100 text-green-600 p-3 rounded-xl">
                                    <FiLock size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-gray-900">Change Password</h2>
                                    <p className="text-sm text-gray-500">Update your password to keep your account secure</p>
                                </div>
                            </div>

                            <form onSubmit={handleChangePassword} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-2">
                                        Current Password
                                    </label>
                                    <input
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-900 outline-none font-medium transition-all"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-2">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-900 outline-none font-medium transition-all"
                                        required
                                        minLength={6}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-2">
                                        Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-900 outline-none font-medium transition-all"
                                        required
                                        minLength={6}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={updating}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    <FiLock className="inline mr-2" size={20} />
                                    {updating ? 'Updating...' : 'Update Password'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettings;
