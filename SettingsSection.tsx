import React, { useState } from 'react';
import {
  Settings,
  Save,
  Check,
  Download,
  Upload,
  RotateCcw,
  AlertTriangle,
  Database,
  FileJson,
  ShieldAlert,
} from 'lucide-react';
import { StoreSettings } from '../../../types';

interface SettingsSectionProps {
  settings: StoreSettings;
  onUpdateSettings: (newSettings: Partial<StoreSettings>) => Promise<StoreSettings>;
  onResetData: () => Promise<void>;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  settings,
  onUpdateSettings,
  onResetData,
}) => {
  const [formData, setFormData] = useState<StoreSettings>(settings);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [backupMessage, setBackupMessage] = useState('');

  const handleFooterChange = (key: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      footer: {
        ...(prev.footer as any),
        [key]: value,
      },
    }));
  };

  const handleDownloadBackup = async () => {
    try {
      const res = await fetch('/api/backup');
      if (res.ok) {
        const data = await res.json();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pakbite-database-backup-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        setBackupMessage('Backup JSON downloaded successfully!');
        setTimeout(() => setBackupMessage(''), 4000);
      }
    } catch {
      alert('Failed to generate backup JSON.');
    }
  };

  const handleRestoreBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (window.confirm('Restore database from this JSON backup? This will overwrite existing items.')) {
          const res = await fetch('/api/restore', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(json),
          });
          if (res.ok) {
            alert('Database restored successfully! Reloading...');
            window.location.reload();
          } else {
            alert('Failed to restore backup.');
          }
        }
      } catch {
        alert('Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetConfirm = async () => {
    if (window.confirm('Are you sure you want to reset all store data, deals, products, and categories back to factory defaults?')) {
      setIsResetting(true);
      try {
        await onResetData();
        alert('Store data reset to default demo content! Reloading...');
        window.location.reload();
      } finally {
        setIsResetting(false);
      }
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-stone-900 font-serif">
            Store Settings & Database Backup
          </h2>
          <p className="text-xs text-stone-500">
            Export JSON data backups, restore store records, and manage footer branding
          </p>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
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
              <span>{isSaving ? 'Saving Changes...' : 'Save Settings'}</span>
            </>
          )}
        </button>
      </div>

      {/* Database Backup & Restore */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
          <Database className="w-4 h-4 text-amber-600" />
          <h3 className="text-sm font-bold text-stone-900 font-serif">Database Backup & Portability</h3>
        </div>

        <p className="text-xs text-stone-500">
          Safely export your entire restaurant menu, unlimited deal boxes, category records and store settings as a single JSON file.
        </p>

        {backupMessage && (
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
            {backupMessage}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <button
            type="button"
            onClick={handleDownloadBackup}
            className="p-4 bg-stone-50 hover:bg-amber-50 border border-stone-200 hover:border-amber-300 rounded-xl flex items-center gap-3 text-left transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-stone-900 block">Export Full Database (.json)</span>
              <span className="text-[10px] text-stone-500">Download current products, deals & settings</span>
            </div>
          </button>

          <label className="p-4 bg-stone-50 hover:bg-blue-50 border border-stone-200 hover:border-blue-300 rounded-xl flex items-center gap-3 text-left transition-all cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center font-bold">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-stone-900 block">Restore Database from JSON</span>
              <span className="text-[10px] text-stone-500">Import previous backup JSON file</span>
            </div>
            <input type="file" accept=".json" onChange={handleRestoreBackup} className="hidden" />
          </label>
        </div>
      </div>

      {/* Footer & Copyright Text */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
          <Settings className="w-4 h-4 text-amber-600" />
          <h3 className="text-sm font-bold text-stone-900 font-serif">Website Footer & Copyright Notice</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-bold text-stone-800 block mb-1">Copyright Text</label>
            <input
              type="text"
              value={formData.footer?.copyrightText || ''}
              onChange={(e) => handleFooterChange('copyrightText', e.target.value)}
              placeholder="e.g. © 2025 PakBite Express. All rights reserved."
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900"
            />
          </div>

          <div>
            <label className="font-bold text-stone-800 block mb-1">Footer Tagline Note</label>
            <input
              type="text"
              value={formData.footer?.footerNote || ''}
              onChange={(e) => handleFooterChange('footerNote', e.target.value)}
              placeholder="e.g. Serving authentic Pakistani burgers, wings & platters with passion."
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900"
            />
          </div>
        </div>
      </div>

      {/* Danger Zone: Reset Data */}
      <div className="bg-rose-50/50 p-4 sm:p-6 rounded-2xl border border-rose-200 space-y-3">
        <div className="flex items-center gap-2 text-rose-800">
          <ShieldAlert className="w-4 h-4 text-rose-600" />
          <h3 className="text-sm font-bold font-serif">Factory Reset to Default Demo Data</h3>
        </div>

        <p className="text-xs text-rose-700">
          Resetting will restore the default deal boxes, menu items, categories, and store configurations.
        </p>

        <button
          type="button"
          onClick={handleResetConfirm}
          disabled={isResetting}
          className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-2xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{isResetting ? 'Resetting Store Data...' : 'Reset to Factory Defaults'}</span>
        </button>
      </div>
    </div>
  );
};
