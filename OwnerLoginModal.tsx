import React, { useState } from 'react';
import { useRestaurantData } from '../../context/RestaurantDataContext';
import { Lock, KeyRound, ShieldAlert, X, Eye, EyeOff, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface OwnerLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const OwnerLoginModal: React.FC<OwnerLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { loginOwner } = useRestaurantData();
  const [username, setUsername] = useState('owner');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!password.trim()) {
      setErrorMessage('Please enter the owner passphrase.');
      return;
    }

    if (password.length < 1 || password.length > 10) {
      setErrorMessage('Password must be between 1 and 10 characters.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const result = loginOwner(username, password);
      setIsLoading(false);

      if (result.success) {
        if (onSuccess) onSuccess();
        onClose();
      } else {
        setErrorMessage(result.error || 'Authentication failed. Please verify credentials.');
      }
    }, 300);
  };

  const handleQuickFill = () => {
    setUsername('owner');
    setPassword('12345');
    setErrorMessage('');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-md bg-[#14110F] border border-[#C5A059]/30 rounded-2xl p-7 shadow-2xl shadow-black text-[#F5F2ED] overflow-hidden"
        >
          {/* Subtle Ambient Gold Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#C5A059]/15 rounded-full blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-[#D6CEBF]/70 hover:text-[#F5F2ED] p-1.5 rounded-lg hover:bg-white/5 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D4AF37]/20 to-[#8C5E10]/30 border border-[#C5A059]/40 flex items-center justify-center text-[#D4AF37] shadow-inner">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] tracking-[0.25em] uppercase font-bold text-[#C5A059]">
                Management Verification
              </div>
              <h3 className="text-xl font-display font-semibold text-white tracking-wide">
                Owner Dashboard Access
              </h3>
            </div>
          </div>

          <p className="text-sm text-[#D6CEBF] mb-6 leading-relaxed">
            Please authenticate your executive credentials to manage live menus, recipes, special offers, gallery, and restaurant operations.
          </p>

          {/* Error Message */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-2.5"
            >
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#D6CEBF] uppercase tracking-wider mb-2">
                Owner / Executive Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="e.g. owner or admin"
                  className="w-full bg-[#1C1815] border border-white/10 focus:border-[#C5A059] rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-[#D6CEBF] uppercase tracking-wider">
                  Passphrase Key
                </label>
                <button
                  type="button"
                  onClick={handleQuickFill}
                  className="text-[11px] text-[#C5A059] hover:underline flex items-center gap-1 font-medium"
                >
                  <Sparkles className="w-3 h-3" />
                  Quick Fill Demo Credentials
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  maxLength={10}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter executive password (1-10 chars)"
                  className="w-full bg-[#1C1815] border border-white/10 focus:border-[#C5A059] rounded-xl pl-4 pr-11 py-3 text-sm text-white placeholder-white/25 outline-none transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10px] text-white/40 mt-1">Rule: 1–10 characters (numeric or alphanumeric). Testing key: 12345</p>
            </div>

            {/* Quick Demo Credentials Box */}
            <div className="p-3 bg-[#1B1815]/90 border border-[#C5A059]/20 rounded-xl text-xs text-[#D6CEBF] flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-[10px] uppercase tracking-wider text-[#C5A059] font-bold">Standard Owner Verification:</div>
                <div className="text-white/90 font-mono text-[11px]">User: <span className="text-[#C5A059]">owner</span> | Key: <span className="text-[#C5A059]">12345</span></div>
              </div>
              <button
                type="button"
                onClick={handleQuickFill}
                className="px-2.5 py-1.5 rounded-lg bg-[#C5A059]/15 hover:bg-[#C5A059]/25 text-[#E5C158] text-[11px] font-semibold transition-colors cursor-pointer"
              >
                Auto Fill
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-gold py-3.5 rounded-xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#C5A059]/20 mt-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-[#0D0D0D] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  Unlock Owner Dashboard
                </>
              )}
            </button>
          </form>

          {/* Security Guarantee */}
          <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-center gap-2 text-[11px] text-[#D6CEBF]/60 text-center">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Encrypted Owner Session. Edit tools are hidden from normal diners.</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
