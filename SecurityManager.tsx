import React, { useState } from 'react';
import { useRestaurantData } from '../../context/RestaurantDataContext';
import { 
  ShieldCheck, 
  KeyRound, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  LogOut, 
  UserCheck, 
  Clock, 
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { motion } from 'motion/react';

interface SecurityManagerProps {
  onShowToast: (title: string, message?: string, type?: 'success' | 'gold' | 'info') => void;
}

export const SecurityManager: React.FC<SecurityManagerProps> = ({ onShowToast }) => {
  const { 
    authSession, 
    logoutOwner, 
    changeOwnerPassword, 
    resetOwnerPassword 
  } = useRestaurantData();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!currentPassword.trim()) {
      setErrorMsg('Please enter your current active password.');
      return;
    }

    if (!newPassword.trim()) {
      setErrorMsg('Please enter a new password.');
      return;
    }

    // 1-10 character rule enforcement
    if (newPassword.length < 1 || newPassword.length > 10) {
      setErrorMsg('Password must be between 1 and 10 characters in length.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('New password and confirmation do not match.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const result = changeOwnerPassword(currentPassword, newPassword);
      setIsSubmitting(false);

      if (result.success) {
        setSuccessMsg('Executive owner password updated successfully and saved securely.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        onShowToast('Password Updated', 'Your new owner security key is now active and persisted in the database.', 'gold');
      } else {
        setErrorMsg(result.error || 'Failed to update password.');
      }
    }, 350);
  };

  const handleResetDefault = () => {
    resetOwnerPassword();
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setErrorMsg('');
    setSuccessMsg('Owner password reset to default testing key (12345).');
    onShowToast('Password Reset', 'Testing key 12345 has been restored.', 'info');
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#18130F] to-[#120F0D] border border-[#C5A059]/30 rounded-2xl p-6 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D4AF37]/20 to-[#8C5E10]/30 border border-[#C5A059]/40 flex items-center justify-center text-[#D4AF37] shadow-inner shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#C5A059]">Access Control & Encryption</div>
              <h2 className="text-xl font-bold font-display text-white">Owner Security & Password Management</h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={logoutOwner}
              className="px-3.5 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/40 text-rose-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Active Session Info Card */}
        <div className="md:col-span-1 bg-[#14100D] border border-white/10 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2.5 text-[#C5A059] font-bold text-xs uppercase tracking-wider border-b border-white/5 pb-3">
            <UserCheck className="w-4 h-4" />
            <span>Active Session</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="text-white/40 uppercase text-[10px] tracking-wider">Executive User</div>
              <div className="text-white font-semibold mt-0.5">{authSession.username || 'Executive Owner'}</div>
            </div>

            <div>
              <div className="text-white/40 uppercase text-[10px] tracking-wider">Authority Role</div>
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#C5A059]/15 border border-[#C5A059]/30 text-[#E5C158] font-bold text-[11px] mt-1">
                <ShieldCheck className="w-3 h-3" />
                <span>Super Administrator</span>
              </div>
            </div>

            <div>
              <div className="text-white/40 uppercase text-[10px] tracking-wider">Session Started</div>
              <div className="text-[#D6CEBF] font-mono text-[11px] mt-0.5 flex items-center gap-1">
                <Clock className="w-3 h-3 text-white/40" />
                <span>{authSession.loginTime ? new Date(authSession.loginTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Active now'}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-white/5 space-y-1 text-[11px] text-white/60">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Encrypted Client Storage</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Unauthorized Diners Blocked</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/5">
            <button
              type="button"
              onClick={handleResetDefault}
              className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset to Default Key (12345)</span>
            </button>
          </div>
        </div>

        {/* Change Password Form */}
        <div className="md:col-span-2 bg-[#14100D] border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#C5A059]/15 border border-[#C5A059]/30 flex items-center justify-center text-[#D4AF37]">
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Change Owner Password</h3>
                <p className="text-xs text-white/50">Enforce the 1–10 character security rule</p>
              </div>
            </div>
          </div>

          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3.5 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-2.5"
            >
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </motion.div>
          )}

          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-200 text-xs flex items-start gap-2.5"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </motion.div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4">
            {/* Current Password */}
            <div>
              <label className="block text-xs font-semibold text-[#D6CEBF] uppercase tracking-wider mb-1.5">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPassword}
                  maxLength={10}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter active password (e.g. 12345)"
                  className="w-full bg-[#1C1815] border border-white/10 focus:border-[#C5A059] rounded-xl pl-4 pr-11 py-2.5 text-sm text-white placeholder-white/25 outline-none font-mono transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer"
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-[#D6CEBF] uppercase tracking-wider">
                  New Password (1–10 Characters)
                </label>
                <span className="text-[10px] text-[#C5A059] font-mono">{newPassword.length}/10 chars</span>
              </div>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  maxLength={10}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new 1-10 character key"
                  className="w-full bg-[#1C1815] border border-white/10 focus:border-[#C5A059] rounded-xl pl-4 pr-11 py-2.5 text-sm text-white placeholder-white/25 outline-none font-mono transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10px] text-white/40 mt-1">Allows numbers 0-9 and letters. Maximum 10 characters.</p>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-xs font-semibold text-[#D6CEBF] uppercase tracking-wider mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  maxLength={10}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type new password"
                  className="w-full bg-[#1C1815] border border-white/10 focus:border-[#C5A059] rounded-xl pl-4 pr-11 py-2.5 text-sm text-white placeholder-white/25 outline-none font-mono transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-gold py-3 rounded-xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#C5A059]/20 cursor-pointer"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Save & Update Owner Password</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
