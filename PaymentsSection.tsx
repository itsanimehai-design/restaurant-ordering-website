import React, { useState } from 'react';
import {
  CreditCard,
  Save,
  Check,
  Banknote,
  DollarSign,
  Smartphone,
  ShieldCheck,
} from 'lucide-react';
import { StoreSettings } from '../../../types';

interface PaymentsSectionProps {
  settings: StoreSettings;
  onUpdateSettings: (newSettings: Partial<StoreSettings>) => Promise<StoreSettings>;
}

export const PaymentsSection: React.FC<PaymentsSectionProps> = ({
  settings,
  onUpdateSettings,
}) => {
  const [formData, setFormData] = useState<StoreSettings>(settings);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handlePaymentChange = (key: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      payments: {
        ...(prev.payments as any),
        [key]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onUpdateSettings(formData);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-stone-900 font-serif">
            Payment Gateways & Methods
          </h2>
          <p className="text-xs text-stone-500">
            Configure Cash on Delivery, JazzCash, Easypaisa and Card payment options for customer checkout
          </p>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          {savedSuccess ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              <span>Saved Successfully!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving Changes...' : 'Save Payment Methods'}</span>
            </>
          )}
        </button>
      </div>

      {/* Payment Channels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Cash on Delivery */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
                <Banknote className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-stone-900 block">Cash on Delivery (COD)</span>
                <span className="text-[10px] text-stone-500">Pay cash upon rider arrival</span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.payments?.cashOnDelivery !== false}
                onChange={(e) => handlePaymentChange('cashOnDelivery', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600" />
            </label>
          </div>
          <p className="text-stone-500 text-[11px]">
            Recommended for Pakistani restaurant deliveries. Most customers prefer COD.
          </p>
        </div>

        {/* Card on Delivery */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-stone-900 block">Debit / Credit Card on Delivery</span>
                <span className="text-[10px] text-stone-500">Rider brings wireless POS machine</span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.payments?.cardOnDelivery === true}
                onChange={(e) => handlePaymentChange('cardOnDelivery', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600" />
            </label>
          </div>
          <p className="text-stone-500 text-[11px]">
            Enable if your dispatch riders carry mobile card swipe machines.
          </p>
        </div>

        {/* JazzCash Account */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-800 font-black flex items-center justify-center text-xs">
                JC
              </div>
              <div>
                <span className="font-bold text-stone-900 block">JazzCash Mobile Wallet</span>
                <span className="text-[10px] text-stone-500">Instant Pakistani mobile payment</span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.payments?.jazzcash === true}
                onChange={(e) => handlePaymentChange('jazzcash', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600" />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <div>
              <label className="font-bold text-stone-700 block mb-1 text-[11px]">JazzCash Account Title</label>
              <input
                type="text"
                value={formData.payments?.jazzcashTitle || ''}
                onChange={(e) => handlePaymentChange('jazzcashTitle', e.target.value)}
                placeholder="e.g. PakBite Official"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5 text-stone-900"
              />
            </div>
            <div>
              <label className="font-bold text-stone-700 block mb-1 text-[11px]">JazzCash Account #</label>
              <input
                type="text"
                value={formData.payments?.jazzcashNumber || ''}
                onChange={(e) => handlePaymentChange('jazzcashNumber', e.target.value)}
                placeholder="03001234567"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5 text-stone-900 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Easypaisa Account */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 font-black flex items-center justify-center text-xs">
                EP
              </div>
              <div>
                <span className="font-bold text-stone-900 block">Easypaisa Mobile Wallet</span>
                <span className="text-[10px] text-stone-500">Direct mobile wallet transfer</span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.payments?.easypaisa === true}
                onChange={(e) => handlePaymentChange('easypaisa', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600" />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <div>
              <label className="font-bold text-stone-700 block mb-1 text-[11px]">Easypaisa Account Title</label>
              <input
                type="text"
                value={formData.payments?.easypaisaTitle || ''}
                onChange={(e) => handlePaymentChange('easypaisaTitle', e.target.value)}
                placeholder="e.g. PakBite Fast Food"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5 text-stone-900"
              />
            </div>
            <div>
              <label className="font-bold text-stone-700 block mb-1 text-[11px]">Easypaisa Account #</label>
              <input
                type="text"
                value={formData.payments?.easypaisaNumber || ''}
                onChange={(e) => handlePaymentChange('easypaisaNumber', e.target.value)}
                placeholder="03451234567"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5 text-stone-900 font-mono"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
