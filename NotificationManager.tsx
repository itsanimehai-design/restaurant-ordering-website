import React, { useState } from 'react';
import { useRestaurantData } from '../../context/RestaurantDataContext';
import { 
  Bell, 
  Volume2, 
  Mail, 
  MessageSquare, 
  PhoneCall, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  Play, 
  ShieldCheck, 
  Smartphone,
  Send
} from 'lucide-react';
import { motion } from 'motion/react';

interface NotificationManagerProps {
  onShowToast: (title: string, message?: string, type?: 'success' | 'gold' | 'info') => void;
}

export const NotificationManager: React.FC<NotificationManagerProps> = ({ onShowToast }) => {
  const { config, updateConfig } = useRestaurantData();

  const currentSettings = config.notificationSettings || {
    browserPush: true,
    soundAlerts: true,
    emailAlerts: true,
    emailAddress: config.contact?.email || 'orders@emberandspice.com',
    whatsappAlerts: true,
    whatsappNumber: config.contact?.phone || '+92 300 1234567',
    smsAlerts: false,
    smsNumber: '+92 300 1234567'
  };

  const [browserPush, setBrowserPush] = useState(currentSettings.browserPush !== false);
  const [soundAlerts, setSoundAlerts] = useState(currentSettings.soundAlerts !== false);
  const [emailAlerts, setEmailAlerts] = useState(currentSettings.emailAlerts !== false);
  const [emailAddress, setEmailAddress] = useState(currentSettings.emailAddress || 'orders@emberandspice.com');

  const [whatsappAlerts, setWhatsappAlerts] = useState(currentSettings.whatsappAlerts !== false);
  const [whatsappNumber, setWhatsappNumber] = useState(currentSettings.whatsappNumber || '+92 300 1234567');

  const [smsAlerts, setSmsAlerts] = useState(!!currentSettings.smsAlerts);
  const [smsNumber, setSmsNumber] = useState(currentSettings.smsNumber || '+92 300 1234567');

  const handleTestSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);
      onShowToast('Audio Chime Played', 'New order notification chime tested successfully.', 'gold');
    } catch {
      onShowToast('Sound Chime', 'Sound triggered (Audio Context stimulated).', 'info');
    }
  };

  const handleRequestPushPermission = async () => {
    if ('Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          onShowToast('Push Permission Granted', 'Browser push notifications are now active.', 'success');
        } else {
          onShowToast('Push Notice', `Notification permission status: ${permission}`, 'info');
        }
      } catch {
        onShowToast('Push Notice', 'Push notification request completed.', 'info');
      }
    } else {
      onShowToast('Not Supported', 'Browser notifications not supported in this environment.', 'info');
    }
  };

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedSettings = {
      browserPush,
      soundAlerts,
      emailAlerts,
      emailAddress: emailAddress.trim(),
      whatsappAlerts,
      whatsappNumber: whatsappNumber.trim(),
      smsAlerts,
      smsNumber: smsNumber.trim()
    };

    updateConfig({
      notificationSettings: updatedSettings
    });

    onShowToast('Notifications Saved', 'Order alert channels and notification preferences updated.', 'gold');
  };

  return (
    <form onSubmit={handleSaveAll} className="space-y-8 max-w-5xl">
      {/* Banner */}
      <div className="bg-[#14100D] border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C5A059]">
            <Bell className="w-4 h-4" />
            <span>Order Alert & Dispatch Dispatcher</span>
          </div>
          <h2 className="text-xl font-bold font-display text-white mt-1">Real-Time Notifications & Sound Chimes</h2>
          <p className="text-xs text-white/50 mt-1">Configure live order alerts via browser push, kitchen sound chimes, WhatsApp and email</p>
        </div>

        <button
          type="submit"
          className="btn-gold py-2.5 px-6 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#C5A059]/20 self-start sm:self-auto cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Settings</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* BROWSER PUSH & SOUND CHIME */}
        <div className="bg-[#14100D] border border-white/10 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#C5A059]/15 border border-[#C5A059]/30 flex items-center justify-center text-[#D4AF37]">
                <Volume2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Browser & Kitchen Sound Alerts</h3>
                <p className="text-[11px] text-white/50">Instant chimes when customers place orders</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Sound Chime Toggle */}
            <div className="p-3.5 rounded-xl bg-[#181411] border border-white/5 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">Kitchen Audio Bell / Chime</div>
                <div className="text-[11px] text-white/50 mt-0.5">Plays loud melodic chime upon incoming order</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleTestSound}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[#C5A059] text-[11px] font-bold flex items-center gap-1 border border-white/5 transition-colors cursor-pointer"
                >
                  <Play className="w-3 h-3" /> Test Chime
                </button>
                <input
                  type="checkbox"
                  checked={soundAlerts}
                  onChange={(e) => setSoundAlerts(e.target.checked)}
                  className="accent-[#C5A059] w-4 h-4 rounded cursor-pointer"
                />
              </div>
            </div>

            {/* Browser Push Toggle */}
            <div className="p-3.5 rounded-xl bg-[#181411] border border-white/5 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">Browser Push Notifications</div>
                <div className="text-[11px] text-white/50 mt-0.5">Desktop banner alerts even when tab is backgrounded</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRequestPushPermission}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 text-[11px] font-semibold border border-white/5 transition-colors cursor-pointer"
                >
                  Permissions
                </button>
                <input
                  type="checkbox"
                  checked={browserPush}
                  onChange={(e) => setBrowserPush(e.target.checked)}
                  className="accent-[#C5A059] w-4 h-4 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* WHATSAPP ORDER ALERTS */}
        <div className="bg-[#14100D] border border-white/10 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">WhatsApp Business Dispatch</h3>
                <p className="text-[11px] text-white/50">Send formatted order tickets directly to WhatsApp</p>
              </div>
            </div>

            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
              whatsappAlerts ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-300' : 'bg-white/5 text-white/40'
            }`}>
              {whatsappAlerts ? 'Connected' : 'Disabled'}
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-white/80 uppercase tracking-wider">
                Enable WhatsApp Order Forwarding
              </label>
              <input
                type="checkbox"
                checked={whatsappAlerts}
                onChange={(e) => setWhatsappAlerts(e.target.checked)}
                className="accent-[#C5A059] w-4 h-4 rounded cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-[11px] text-white/40 uppercase mb-1">WhatsApp Business Number</label>
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="+92 300 1234567"
                className="w-full bg-[#181411] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2 text-xs text-white outline-none font-mono"
              />
            </div>
          </div>
        </div>

        {/* EMAIL ORDER NOTIFICATIONS */}
        <div className="bg-[#14100D] border border-white/10 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Email Invoices & Receipts</h3>
                <p className="text-[11px] text-white/50">Send itemized PDF receipts to managers and customers</p>
              </div>
            </div>

            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
              emailAlerts ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-300' : 'bg-white/5 text-white/40'
            }`}>
              {emailAlerts ? 'Connected' : 'Disabled'}
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-white/80 uppercase tracking-wider">
                Enable Order Email Alerts
              </label>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="accent-[#C5A059] w-4 h-4 rounded cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-[11px] text-white/40 uppercase mb-1">Manager Notification Email</label>
              <input
                type="email"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                placeholder="orders@emberandspice.com"
                className="w-full bg-[#181411] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2 text-xs text-white outline-none font-mono"
              />
            </div>
          </div>
        </div>

        {/* SMS NOTIFICATIONS */}
        <div className="bg-[#14100D] border border-white/10 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">SMS Order Updates</h3>
                <p className="text-[11px] text-white/50">SMS gateway alerts on status changes</p>
              </div>
            </div>

            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
              smsAlerts ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-300' : 'bg-white/5 text-white/40'
            }`}>
              {smsAlerts ? 'Connected' : 'Not Connected'}
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-white/80 uppercase tracking-wider">
                Enable Direct SMS Gateway
              </label>
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                className="accent-[#C5A059] w-4 h-4 rounded cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-[11px] text-white/40 uppercase mb-1">Dispatch Phone Number</label>
              <input
                type="text"
                value={smsNumber}
                onChange={(e) => setSmsNumber(e.target.value)}
                placeholder="+92 300 1234567"
                className="w-full bg-[#181411] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2 text-xs text-white outline-none font-mono"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="btn-gold py-3 px-8 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-[#C5A059]/25 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Notification Configuration</span>
        </button>
      </div>
    </form>
  );
};
