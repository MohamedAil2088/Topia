import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks/useRedux';
import { updateUserProfile } from '../redux/slices/authSlice';
import { Link } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import { FiUser, FiPackage, FiMapPin, FiClock, FiShield, FiStar, FiChevronRight, FiCheckCircle, FiInfo, FiX } from 'react-icons/fi';
import Swal from 'sweetalert2';

const ProfilePage = () => {
    const { userInfo, loading } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();

    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPointsModal, setShowPointsModal] = useState(false);

    useEffect(() => {
        if (userInfo) {
            setName(userInfo.name);
        }
    }, [userInfo]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        // 🛡️ Enhanced Validation
        if (!name.trim()) {
            return Swal.fire({ icon: 'warning', title: 'Name Required', text: 'Please enter your full name.', confirmButtonColor: '#000' });
        }

        if (password) {
            if (password.length < 6) {
                return Swal.fire({
                    icon: 'error',
                    title: 'Weak Password',
                    text: 'Password must be at least 6 characters long for your security.',
                    confirmButtonColor: '#000'
                });
            }
            if (password !== confirmPassword) {
                return Swal.fire({
                    icon: 'error',
                    title: 'Mismatch',
                    text: 'Passwords do not match. Please check again.',
                    confirmButtonColor: '#000'
                });
            }
        }

        try {
            await dispatch(updateUserProfile({ name, password })).unwrap();

            Swal.fire({
                icon: 'success',
                title: 'Profile Updated!',
                text: 'Your account information has been synchronized successfully.',
                timer: 2000,
                showConfirmButton: false,
                position: 'top-end',
                toast: true
            });

            setPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: err || 'Something went wrong while updating your profile.',
                confirmButtonColor: '#000'
            });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50">
            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                    <div>
                        <h1 className="text-4xl font-black font-display text-primary-900 tracking-tight">
                            ⚙️ Account <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">Settings</span>
                        </h1>
                        <p className="text-gray-500 font-medium mt-1">Manage your profile, orders and elite rewards</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400 font-bold uppercase tracking-widest">
                        <FiShield className="text-accent-600" /> Secure Account
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Sidebar Menu - Elite Design */}
                    <div className="lg:w-1/4">
                        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden sticky top-32">
                            <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-primary-900 text-white flex items-center justify-center text-xl font-black shadow-lg shadow-primary-900/20">
                                        {userInfo?.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="truncate">
                                        <p className="text-sm font-black text-gray-900 truncate">{userInfo?.name}</p>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Verified Member</p>
                                    </div>
                                </div>
                            </div>
                            <div className="py-4">
                                <Link to="/profile" className="flex items-center justify-between px-6 py-4 text-primary-700 bg-primary-50/50 border-r-4 border-primary-900 transition-all group">
                                    <span className="flex items-center gap-3 font-bold"><FiUser /> Profile Overview</span>
                                    <FiChevronRight className="transition-transform group-hover:translate-x-1" />
                                </Link>
                                <Link to="/profile/orders" className="flex items-center justify-between px-6 py-4 text-gray-500 hover:text-primary-900 hover:bg-gray-50 transition-all group">
                                    <span className="flex items-center gap-3 font-bold"><FiPackage /> My Orders</span>
                                    <FiChevronRight className="opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                                </Link>
                                <Link to="/custom-orders/my-orders" className="flex items-center justify-between px-6 py-4 text-gray-500 hover:text-primary-900 hover:bg-gray-50 transition-all group">
                                    <span className="flex items-center gap-3 font-bold"><span className="text-purple-600">🎨</span> My Custom Orders</span>
                                    <FiChevronRight className="opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                                </Link>
                                <Link to="/profile/history" className="flex items-center justify-between px-6 py-4 text-gray-500 hover:text-primary-900 hover:bg-gray-50 transition-all group">
                                    <span className="flex items-center gap-3 font-bold"><FiClock /> Purchase History</span>
                                    <FiChevronRight className="opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                                </Link>
                                <Link to="/profile/addresses" className="flex items-center justify-between px-6 py-4 text-gray-500 hover:text-primary-900 hover:bg-gray-50 transition-all group">
                                    <span className="flex items-center gap-3 font-bold"><FiMapPin /> Saved Addresses</span>
                                    <FiChevronRight className="opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="lg:w-3/4 space-y-10">
                        {/* Loyalty Points Card - Premium Transformation */}
                        <div className="relative group bg-primary-950 rounded-[2.5rem] shadow-2xl overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-gray-900 to-black pointer-events-none"></div>

                            <div className="relative z-10 p-10 md:p-12 flex flex-col md:flex-row justify-between items-center gap-10">
                                <div className="text-center md:text-left">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-500/10 text-accent-400 border border-accent-500/20 text-[10px] font-black uppercase tracking-[0.2em] mb-6 shadow-xl">
                                        <FiStar className="animate-spin-slow" /> Elite Membership
                                    </div>
                                    <h2 className="text-4xl md:text-5xl font-black font-display text-white mb-4 tracking-tighter">Your Rewards Balance</h2>
                                    <p className="text-gray-400 text-sm max-w-sm leading-relaxed mb-8">
                                        Your loyalty is valuable. Every <span className="text-accent-400 font-bold">100 points</span> gives you <span className="text-accent-400 font-bold">10 EGP</span> credit back for your next purchase.
                                    </p>
                                    <button
                                        onClick={() => setShowPointsModal(true)}
                                        className="inline-flex items-center gap-2 text-xs font-black text-white hover:text-accent-400 transition-colors uppercase tracking-widest border-b-2 border-accent-500 pb-1"
                                    >
                                        <FiInfo /> How to accumulate points?
                                    </button>
                                </div>

                                <div className="flex flex-col items-center gap-4">
                                    <div className="relative p-1 bg-gradient-to-tr from-accent-500 via-white/20 to-primary-500 rounded-[3rem] shadow-2xl">
                                        <div className="relative flex flex-col items-center justify-center bg-gray-900 border border-white/5 w-48 h-48 rounded-[2.8rem] backdrop-blur-xl group-hover:scale-105 transition-transform duration-500">
                                            <p className="text-6xl font-black text-white tracking-tighter mb-1 animate-pulse tabular-nums">
                                                {userInfo?.points || 0}
                                            </p>
                                            <p className="text-[10px] font-black text-accent-500 uppercase tracking-[0.4em] translate-x-1">Points</p>

                                            <div className="absolute -top-4 -right-4 w-12 h-12 bg-accent-500 rounded-2xl flex items-center justify-center text-primary-950 text-xl shadow-lg shadow-accent-500/30 transform rotate-12">
                                                🎁
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                        <FiCheckCircle className="text-green-500" /> Real-time Update
                                    </div>
                                </div>
                            </div>

                            {/* Decorative Background */}
                            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-accent-500/10 rounded-full blur-[120px]"></div>
                            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-primary-500/20 rounded-full blur-[120px]"></div>
                        </div>

                        {/* Profile Info Form */}
                        <div className="bg-white p-10 md:p-12 rounded-[2.5rem] shadow-sm border border-gray-100">
                            <div className="flex items-center gap-3 mb-10">
                                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-primary-900 border border-gray-100">
                                    <FiUser size={20} />
                                </div>
                                <h2 className="text-2xl font-black text-gray-900">Personal Information</h2>
                            </div>

                            <form onSubmit={handleUpdate} className="space-y-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                            Display Name <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Enter your full name"
                                            className="h-14 font-bold rounded-2xl border-gray-100 focus:border-primary-900 focus:ring-0"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                            Email Identity <FiShield className="text-accent-600" />
                                        </label>
                                        <Input
                                            value={userInfo?.email || ''}
                                            disabled
                                            className="h-14 font-bold rounded-2xl bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed italic"
                                        />
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-gray-50">
                                    <h3 className="text-lg font-black text-gray-900 mb-8 flex items-center gap-2">
                                        Security Upgrade <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">(Leave blank to keep current)</span>
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">New Master Password</label>
                                            <Input
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="••••••••"
                                                className="h-14 font-bold rounded-2xl border-gray-100 focus:border-primary-900 focus:ring-0"
                                            />
                                            {password && (
                                                <div className="flex gap-1 h-1 mt-2">
                                                    <div className={`flex-1 rounded-full ${password.length > 5 ? 'bg-green-500' : 'bg-red-400'}`}></div>
                                                    <div className={`flex-1 rounded-full ${password.length > 8 ? 'bg-green-500' : 'bg-gray-100'}`}></div>
                                                    <div className={`flex-1 rounded-full ${password.length > 11 ? 'bg-green-500' : 'bg-gray-100'}`}></div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Confirm Synchronization</label>
                                            <Input
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                placeholder="••••••••"
                                                className="h-14 font-bold rounded-2xl border-gray-100 focus:border-primary-900 focus:ring-0"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 flex justify-end">
                                    <Button
                                        type="submit"
                                        isLoading={loading}
                                        className="h-14 px-12 bg-primary-900 hover:bg-black text-white rounded-2xl font-black shadow-xl shadow-primary-900/20 active:scale-95 transition-all text-sm uppercase tracking-widest"
                                    >
                                        Update Profile Matrix
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Points Info Modal */}
            {showPointsModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowPointsModal(false)}></div>
                    <div className="relative bg-white w-full max-w-xl rounded-[3rem] overflow-hidden shadow-2xl animate-scale-up">
                        <div className="bg-primary-950 p-12 text-white relative">
                            <button
                                onClick={() => setShowPointsModal(false)}
                                className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"
                            >
                                <FiX size={24} />
                            </button>
                            <h2 className="text-4xl font-black mb-4">Elite Rewards Guide</h2>
                            <p className="text-gray-400 font-medium">Earn points with every step you take in Topia.</p>
                        </div>
                        <div className="p-12 space-y-8">
                            <div className="flex gap-6">
                                <div className="w-14 h-14 rounded-[1.25rem] bg-accent-500/10 flex items-center justify-center text-accent-600 flex-shrink-0">
                                    <FiPackage size={28} />
                                </div>
                                <div>
                                    <h4 className="text-lg font-black text-gray-900 mb-1">Shopping Rewards</h4>
                                    <p className="text-gray-500 text-sm leading-relaxed">Earn <span className="text-primary-900 font-bold">1 point</span> for every <span className="text-primary-900 font-bold">10 EGP</span> spent on any collection.</p>
                                </div>
                            </div>
                            <div className="flex gap-6">
                                <div className="w-14 h-14 rounded-[1.25rem] bg-indigo-500/10 flex items-center justify-center text-indigo-600 flex-shrink-0">
                                    <FiStar size={28} />
                                </div>
                                <div>
                                    <h4 className="text-lg font-black text-gray-900 mb-1">Review Contributions</h4>
                                    <p className="text-gray-500 text-sm leading-relaxed">Verified purchasers receive <span className="text-primary-900 font-bold">50 points</span> for every verified review with images.</p>
                                </div>
                            </div>
                            <div className="flex gap-6">
                                <div className="w-14 h-14 rounded-[1.25rem] bg-emerald-500/10 flex items-center justify-center text-emerald-600 flex-shrink-0">
                                    <FiCheckCircle size={28} />
                                </div>
                                <div>
                                    <h4 className="text-lg font-black text-gray-900 mb-1">Redemption Rule</h4>
                                    <p className="text-gray-500 text-sm leading-relaxed">Points are automatically converted to credit during checkout. <span className="text-primary-900 font-bold">100 points = 10 EGP discount</span>.</p>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowPointsModal(false)}
                                className="w-full bg-primary-900 text-white h-16 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-primary-900/20 mt-4"
                            >
                                Got it, thanks!
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
