import React, { useState } from 'react';
import {
  Bell,
  Save,
  Check,
  Volume2,
  Mail,
  Smartphone,
  Sparkles,
} from 'lucide-react';
import { StoreSettings } from '../../../types';

interface NotificationsSectionProps {
  settings: StoreSettings;
  onUpdateSettings: (newSettings: Partial<StoreSettings>) => Promise<StoreSettings>;
}

export const NotificationsSection: React.FC<NotificationsSectionProps> = ({
  settings,
  onUpdateSettings,
}) => {
  const [formData, setFormData] = useState<StoreSettings>(settings);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isTestingSound, setIsTestingSound] = useState(false);

  const handleNotificationChange = (key: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      notifications: {
        ...(prev.notifications as any),
        [key]: value,
      },
    }));
  };

  const playTestChime = () => {
    try {
      setIsTestingSound(true);
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.6);
      setTimeout(() => setIsTestingSound(false), 700);
    } catch {
      setIsTestingSound(false);
    }
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
            Alerts & Order Notifications
          </h2>
          <p className="text-xs text-stone-500">
            Configure kitchen audio chimes and dispatch alerts when customers place orders
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
              <span>{isSaving ? 'Saving Changes...' : 'Save Notification Rules'}</span>
            </>
          )}
        </button>
      </div>

      {/* Audio Chime Notification */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-stone-900 text-xs block">Audio Bell Chime on New Order</span>
              <span className="text-[10px] text-stone-500">Rings kitchen buzzer whenever a new order is received</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={playTestChime}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 transition-all flex items-center gap-1.5 ${
                isTestingSound ? 'scale-95' : ''
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Test Audio Chime</span>
            </button>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.notifications?.soundAlerts !== false}
                onChange={(e) => handleNotificationChange('soundAlerts', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600" />
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-bold text-stone-800 block mb-1">Kitchen Manager Alert Phone</label>
            <div className="relative">
              <Smartphone className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={formData.notifications?.staffAlertPhone || ''}
                onChange={(e) => handleNotificationChange('staffAlertPhone', e.target.value)}
                placeholder="+92 300 1234567"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-stone-900"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-stone-800 block mb-1">Order Dispatch Notification Email</label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={formData.notifications?.emailAlertsAddress || ''}
                onChange={(e) => handleNotificationChange('emailAlertsAddress', e.target.value)}
                placeholder="manager@pakbite.com"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-stone-900"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
