import React, { useState } from 'react';
import {
  MessageSquareQuote,
  Save,
  Check,
  Send,
  ExternalLink,
  Sparkles,
  Phone,
} from 'lucide-react';
import { StoreSettings } from '../../../types';

interface WhatsAppSectionProps {
  settings: StoreSettings;
  onUpdateSettings: (newSettings: Partial<StoreSettings>) => Promise<StoreSettings>;
}

export const WhatsAppSection: React.FC<WhatsAppSectionProps> = ({
  settings,
  onUpdateSettings,
}) => {
  const [formData, setFormData] = useState<StoreSettings>(settings);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleWhatsAppChange = (key: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      whatsappSettings: {
        ...(prev.whatsappSettings as any),
        [key]: value,
      },
      whatsappNumber: key === 'orderPhone' ? value : prev.whatsappNumber,
    }));
  };

  const handleTestWhatsApp = () => {
    const phone = (formData.whatsappSettings?.orderPhone || formData.whatsappNumber || '').replace(/[^0-9]/g, '');
    const template = formData.whatsappSettings?.messageTemplate || 'Hello PakBite! I would like to place an order from your website.';
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(template)}`, '_blank');
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
            WhatsApp Integration & Direct Ordering
          </h2>
          <p className="text-xs text-stone-500">
            Allow customers to order and send order receipts directly to your kitchen WhatsApp
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
              <span>{isSaving ? 'Saving Changes...' : 'Save WhatsApp Settings'}</span>
            </>
          )}
        </button>
      </div>

      {/* WhatsApp Toggle & Number */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <MessageSquareQuote className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-stone-900 text-xs block">WhatsApp Direct Ordering Feature</span>
              <span className="text-[10px] text-stone-500">Customer cart is formatted and sent with 1-click</span>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.whatsappSettings?.enableDirectWhatsApp !== false}
              onChange={(e) => handleWhatsAppChange('enableDirectWhatsApp', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-10 h-5 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600" />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-bold text-stone-800 block mb-1">WhatsApp Order Receiving Number</label>
            <div className="relative">
              <Phone className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={formData.whatsappSettings?.orderPhone || formData.whatsappNumber || ''}
                onChange={(e) => handleWhatsAppChange('orderPhone', e.target.value)}
                placeholder="+92 300 1234567"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-stone-900 font-mono"
              />
            </div>
            <p className="text-[10px] text-stone-400 mt-1">Include country code (+92 for Pakistan).</p>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={handleTestWhatsApp}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-2 shadow-2xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Test WhatsApp Ordering Link</span>
            </button>
          </div>

          <div className="md:col-span-2">
            <label className="font-bold text-stone-800 block mb-1">Default Message Template Header</label>
            <textarea
              rows={3}
              value={formData.whatsappSettings?.messageTemplate || ''}
              onChange={(e) => handleWhatsAppChange('messageTemplate', e.target.value)}
              placeholder="e.g. 🍔 *NEW ORDER FROM PAKBITE WEBSITE*\nCustomer Details & Ordered Items:"
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 font-mono text-[11px]"
            />
          </div>
        </div>
      </div>
    </form>
  );
};
