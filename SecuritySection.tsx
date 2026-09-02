import React, { useState } from 'react';
import {
  Shield,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  LogOut,
} from 'lucide-react';
import { StoreSettings } from '../../../types';
import { apiChangeOwnerPassword } from '../../../lib/api';

interface SecuritySectionProps {
  settings: StoreSettings;
  onUpdateSettings: (newSettings: Partial<StoreSettings>) => Promise<StoreSettings>;
  onLockPortal: () => void;
}

export const SecuritySection: React.FC<SecuritySectionProps> = ({
  settings,
  onUpdateSettings,
  onLockPortal,
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [isChanging, setIsChanging] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const cleanInput = (val: string) => val.slice(0, 30);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    const cur = currentPassword.trim();
    const nw = newPassword.trim();
    const conf = confirmPassword.trim();

    if (!cur) {
      setStatusMessage({ type: 'error', text: 'Please enter your current password.' });
      return;
    }

    if (nw.length < 3) {
      setStatusMessage({ type: 'error', text: 'New password must be at least 3 characters.' });
      return;
    }

    if (nw !== conf) {
      setStatusMessage({ type: 'error', text: 'New password and confirmation do not match.' });
      return;
    }

    setIsChanging(true);

    try {
      const res = await apiChangeOwnerPassword(cur, nw, conf);
      if (res.success) {
        setStatusMessage({
          type: 'success',
          text: 'Password changed successfully! Use your new password for your next login.',
        });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setStatusMessage({
          type: 'error',
          text: res.error || 'Failed to change password. Please check your current password.',
        });
      }
    } catch {
      setStatusMessage({
        type: 'error',
        text: 'An error occurred while connecting to the server.',
      });
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-stone-900 font-serif">
            Security & Owner Authentication
          </h2>
          <p className="text-xs text-stone-500">
            Manage your password for Owner Portal access and session security
          </p>
        </div>

        <button
          type="button"
          onClick={onLockPortal}
          className="bg-stone-900 hover:bg-stone-800 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-colors self-start sm:self-auto"
        >
          <LogOut className="w-4 h-4 text-amber-400" />
          <span>Lock & Log Out</span>
        </button>
      </div>

      {/* Change Password Card */}
      <div className="bg-white p-5 sm:p-7 rounded-2xl border border-stone-200 shadow-2xs space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200/60">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-stone-900 text-sm">Change Owner Password</h3>
            <p className="text-xs text-stone-500">
              Set a secure password for Owner Portal access
            </p>
          </div>
        </div>

        {statusMessage && (
          <div
            className={`flex items-start gap-2.5 p-3.5 rounded-xl border text-xs ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            )}
            <p className="font-medium">{statusMessage.text}</p>
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-xl">
          {/* Current Password */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-stone-800">Current Password *</label>
            </div>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(cleanInput(e.target.value))}
                placeholder="Enter current password"
                required
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-900 font-mono font-bold text-sm focus:outline-none focus:border-amber-500 focus:bg-white"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* New Password & Confirm */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-stone-800">New Password *</label>
              </div>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(cleanInput(e.target.value))}
                  placeholder="Enter new password"
                  required
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-900 font-mono font-bold text-sm focus:outline-none focus:border-amber-500 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-stone-800">Confirm New Password *</label>
              </div>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(cleanInput(e.target.value))}
                  placeholder="Confirm new password"
                  required
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-900 font-mono font-bold text-sm focus:outline-none focus:border-amber-500 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isChanging || !newPassword.trim() || !confirmPassword.trim() || !currentPassword.trim()}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>{isChanging ? 'Updating Password...' : 'Save New Password'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>

      {/* Security Guidelines */}
      <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 sm:p-5 text-xs text-stone-600 space-y-2">
        <h4 className="font-bold text-stone-800 flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-amber-600" />
          Security Rules for Owner Access
        </h4>
        <ul className="list-disc list-inside space-y-1 text-stone-500 text-[11px] leading-relaxed">
          <li>The password is never exposed in the customer-facing frontend or source code.</li>
          <li>You can change your password at any time without modifying any website files.</li>
          <li>Make sure to lock the portal when you are finished managing products or orders on a shared device.</li>
        </ul>
      </div>
    </div>
  );
};
