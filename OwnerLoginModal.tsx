import React, { useState } from 'react';
import { Lock, Eye, EyeOff, X, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { apiVerifyOwnerPassword } from '../../lib/api';

interface OwnerLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  restaurantName?: string;
}

export const OwnerLoginModal: React.FC<OwnerLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  restaurantName = 'PakBite Food',
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (errorMsg) setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPass = password.trim();
    if (!cleanPass) {
      setErrorMsg('Please enter the owner password.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const result = await apiVerifyOwnerPassword(cleanPass);
      if (result.success) {
        setPassword('');
        onSuccess();
      } else {
        setErrorMsg(result.error || 'Incorrect password. Please try again.');
      }
    } catch {
      setErrorMsg('Unable to verify password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="relative bg-stone-900 border border-stone-800 rounded-3xl max-w-sm w-full p-6 sm:p-7 shadow-2xl overflow-hidden text-center">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Lock Icon */}
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-4 shadow-inner">
          <Lock className="w-7 h-7" />
        </div>

        {/* Title & Description */}
        <h3 className="text-xl font-black text-white font-serif tracking-tight mb-1">
          Owner Portal
        </h3>
        <p className="text-xs text-stone-400 mb-6">
          Enter your password to access the store management dashboard
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={handleInputChange}
                autoFocus
                placeholder="Enter password"
                className={`w-full bg-stone-950 border ${
                  errorMsg ? 'border-rose-500 ring-1 ring-rose-500/30' : 'border-stone-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30'
                } rounded-2xl py-3.5 pl-4 pr-11 text-center text-lg sm:text-xl font-mono font-bold text-white focus:outline-none transition-all placeholder:text-stone-600`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 p-1.5 rounded-lg hover:bg-stone-800 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-950/50 border border-rose-800/60 text-rose-300 text-xs text-left">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !password.trim()}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-stone-950 font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-amber-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>{isLoading ? 'Verifying...' : 'Unlock Portal'}</span>
              {!isLoading && <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
