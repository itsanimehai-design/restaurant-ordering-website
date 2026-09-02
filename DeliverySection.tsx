import React, { useState } from 'react';
import {
  Truck,
  Save,
  Check,
  Plus,
  Trash2,
  Clock,
  DollarSign,
  MapPin,
  ShoppingBag,
} from 'lucide-react';
import { StoreSettings } from '../../../types';

interface DeliverySectionProps {
  settings: StoreSettings;
  onUpdateSettings: (newSettings: Partial<StoreSettings>) => Promise<StoreSettings>;
}

export const DeliverySection: React.FC<DeliverySectionProps> = ({
  settings,
  onUpdateSettings,
}) => {
  const [formData, setFormData] = useState<StoreSettings>(settings);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // New zone state
  const [newZoneName, setNewZoneName] = useState('');
  const [newZoneFee, setNewZoneFee] = useState<number | ''>('');
  const [newZoneMinTime, setNewZoneMinTime] = useState<number>(30);

  const handleChange = (field: keyof StoreSettings, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDeliveryRuleChange = (key: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      deliveryRules: {
        ...(prev.deliveryRules as any),
        [key]: value,
      },
    }));
  };

  const handleAddZone = () => {
    if (!newZoneName.trim()) return;
    const newZone = {
      id: `zone-${Date.now()}`,
      name: newZoneName.trim(),
      fee: newZoneFee === '' ? (formData.deliveryRules?.standardFee || 150) : Number(newZoneFee),
      minDeliveryTimeMinutes: newZoneMinTime || 35,
    };
    const currentZones = formData.deliveryRules?.zones || [];
    handleDeliveryRuleChange('zones', [...currentZones, newZone]);
    setNewZoneName('');
    setNewZoneFee('');
  };

  const handleRemoveZone = (id: string) => {
    const currentZones = formData.deliveryRules?.zones || [];
    handleDeliveryRuleChange('zones', currentZones.filter((z) => z.id !== id));
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
            Delivery & Takeaway Configuration
          </h2>
          <p className="text-xs text-stone-500">
            Set delivery charges, free delivery thresholds, estimated prep times, and service zones
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
              <span>{isSaving ? 'Saving Changes...' : 'Save Delivery Rules'}</span>
            </>
          )}
        </button>
      </div>

      {/* Toggles for Services */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-stone-900 text-xs block">Home Delivery Service</span>
              <span className="text-[10px] text-stone-500">Accept orders for rider dispatch</span>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.deliveryRules?.enableDelivery !== false}
              onChange={(e) => handleDeliveryRuleChange('enableDelivery', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-10 h-5 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600" />
          </label>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-800 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-stone-900 text-xs block">Self Pickup / Takeaway</span>
              <span className="text-[10px] text-stone-500">Allow customers to collect in branch</span>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.deliveryRules?.enablePickup !== false}
              onChange={(e) => handleDeliveryRuleChange('enablePickup', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-10 h-5 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600" />
          </label>
        </div>
      </div>

      {/* Delivery Pricing Parameters */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
          <DollarSign className="w-4 h-4 text-amber-600" />
          <h3 className="text-sm font-bold text-stone-900 font-serif">Delivery Charges & Thresholds</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="font-bold text-stone-800 block mb-1">Standard Delivery Fee (PKR)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-stone-400">Rs.</span>
              <input
                type="number"
                min={0}
                value={formData.deliveryRules?.standardFee ?? 150}
                onChange={(e) => handleDeliveryRuleChange('standardFee', Number(e.target.value))}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-stone-900 font-bold"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-stone-800 block mb-1">Free Delivery on Orders Above</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-stone-400">Rs.</span>
              <input
                type="number"
                min={0}
                value={formData.deliveryRules?.freeDeliveryThreshold ?? 1500}
                onChange={(e) => handleDeliveryRuleChange('freeDeliveryThreshold', Number(e.target.value))}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-stone-900 font-bold"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-stone-800 block mb-1">Minimum Order Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-stone-400">Rs.</span>
              <input
                type="number"
                min={0}
                value={formData.deliveryRules?.minimumOrderAmount ?? 300}
                onChange={(e) => handleDeliveryRuleChange('minimumOrderAmount', Number(e.target.value))}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-stone-900 font-bold"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-stone-800 block mb-1">Est. Delivery Time (Mins)</label>
            <div className="relative">
              <Clock className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="number"
                min={5}
                value={formData.deliveryRules?.estimatedTimeMinutes ?? 35}
                onChange={(e) => handleDeliveryRuleChange('estimatedTimeMinutes', Number(e.target.value))}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-stone-900 font-bold"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Areas & Zones List */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
          <MapPin className="w-4 h-4 text-amber-600" />
          <h3 className="text-sm font-bold text-stone-900 font-serif">Delivery Areas & Covered Zones</h3>
        </div>

        {/* Add Zone Inline Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs">
          <div className="sm:col-span-2">
            <input
              type="text"
              value={newZoneName}
              onChange={(e) => setNewZoneName(e.target.value)}
              placeholder="Zone name (e.g. DHA Phase 5, Model Town, Gulberg)"
              className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-900"
            />
          </div>
          <div>
            <input
              type="number"
              value={newZoneFee}
              onChange={(e) => setNewZoneFee(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="Fee (Rs. 150)"
              className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-900"
            />
          </div>
          <button
            type="button"
            onClick={handleAddZone}
            className="bg-stone-900 hover:bg-stone-800 text-white font-bold px-3 py-2 rounded-xl flex items-center justify-center gap-1"
          >
            <Plus className="w-4 h-4" />
            <span>Add Zone</span>
          </button>
        </div>

        {/* Zones Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
          {(formData.deliveryRules?.zones || []).map((zone) => (
            <div
              key={zone.id}
              className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between"
            >
              <div>
                <span className="font-bold text-stone-900 block">{zone.name}</span>
                <span className="text-[10px] text-amber-800 font-semibold">
                  Delivery Fee: Rs. {zone.fee} &bull; ~{zone.minDeliveryTimeMinutes || 35} mins
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveZone(zone.id)}
                className="p-1 text-stone-400 hover:text-rose-600 rounded"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </form>
  );
};
