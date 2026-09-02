import React, { useState, useRef } from 'react';
import { useRestaurantData } from '../../context/RestaurantDataContext';
import { 
  QrCode, 
  Upload, 
  Trash2, 
  Eye, 
  Check, 
  RotateCcw, 
  Smartphone, 
  CreditCard, 
  Banknote, 
  Building2, 
  Sparkles, 
  AlertCircle,
  HelpCircle,
  Copy,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { DEFAULT_DEMO_QR_CODE } from '../../data/restaurantData';

interface PaymentSettingsManagerProps {
  onShowToast: (title: string, message?: string, type?: 'success' | 'gold' | 'info') => void;
}

export const PaymentSettingsManager: React.FC<PaymentSettingsManagerProps> = ({ onShowToast }) => {
  const { config, updateConfig } = useRestaurantData();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Local editable state initialized from current restaurant config
  const initialQr = config.qrPayment || {
    isEnabled: true,
    qrCodeImage: DEFAULT_DEMO_QR_CODE,
    accountName: 'Official Merchant Account (Raast / Wallet)',
    accountNumber: '+92 300 0000000',
    bankOrWalletName: 'Raast Instant QR • JazzCash • Easypaisa • All Bank Apps',
    instructions: 'Scan the QR code with your supported payment app to make your payment.',
    enableCashOnDelivery: true,
    enableCardOnDelivery: true,
    enableBankTransfer: false,
  };

  const [isEnabled, setIsEnabled] = useState<boolean>(initialQr.isEnabled);
  const [qrCodeImage, setQrCodeImage] = useState<string>(initialQr.qrCodeImage || DEFAULT_DEMO_QR_CODE);
  const [accountName, setAccountName] = useState<string>(initialQr.accountName || '');
  const [accountNumber, setAccountNumber] = useState<string>(initialQr.accountNumber || '');
  const [bankOrWalletName, setBankOrWalletName] = useState<string>(initialQr.bankOrWalletName || '');
  const [instructions, setInstructions] = useState<string>(
    initialQr.instructions || 'Scan the QR code with your supported payment app to make your payment.'
  );
  const [enableCashOnDelivery, setEnableCashOnDelivery] = useState<boolean>(
    initialQr.enableCashOnDelivery !== false
  );
  const [enableCardOnDelivery, setEnableCardOnDelivery] = useState<boolean>(
    initialQr.enableCardOnDelivery !== false
  );
  const [enableBankTransfer, setEnableBankTransfer] = useState<boolean>(
    initialQr.enableBankTransfer || false
  );

  const [imageUrlInput, setImageUrlInput] = useState<string>('');
  const [copiedTest, setCopiedTest] = useState<boolean>(false);
  const [dragOver, setDragOver] = useState<boolean>(false);

  // File Upload Handler
  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      onShowToast('Invalid File', 'Please upload a valid image file (PNG, JPG, SVG, WebP).', 'info');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setQrCodeImage(result);
        onShowToast('QR Code Loaded', 'New QR image preview loaded. Click "Save Payment Settings" to persist.', 'gold');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleApplyUrl = () => {
    if (!imageUrlInput.trim()) return;
    setQrCodeImage(imageUrlInput.trim());
    setImageUrlInput('');
    onShowToast('QR Image Set from URL', 'Preview updated. Click "Save Payment Settings" to persist.', 'gold');
  };

  const handleDeleteQr = () => {
    setQrCodeImage('');
    onShowToast('QR Code Removed', 'QR Code graphic deleted. You can upload a new one or restore demo QR.', 'info');
  };

  const handleResetToDemo = () => {
    setQrCodeImage(DEFAULT_DEMO_QR_CODE);
    setAccountName('Official Merchant Account (Raast / Wallet)');
    setAccountNumber('+92 300 0000000');
    setBankOrWalletName('Raast Instant QR • JazzCash • Easypaisa • All Bank Apps');
    setInstructions('Scan the QR code with your supported payment app to make your payment.');
    onShowToast('Restored Demo QR', 'Reset to official sample payment QR asset.', 'info');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedQrPayment = {
      isEnabled,
      qrCodeImage: qrCodeImage || DEFAULT_DEMO_QR_CODE,
      accountName: accountName.trim(),
      accountNumber: accountNumber.trim(),
      bankOrWalletName: bankOrWalletName.trim(),
      instructions: instructions.trim(),
      enableCashOnDelivery,
      enableCardOnDelivery,
      enableBankTransfer,
    };

    updateConfig({
      qrPayment: updatedQrPayment
    });

    onShowToast(
      'Payment Settings Saved',
      'QR Payment configuration is now immediately live on customer checkout.',
      'success'
    );
  };

  const handleCopySample = () => {
    if (accountNumber) {
      navigator.clipboard.writeText(accountNumber);
      setCopiedTest(true);
      setTimeout(() => setCopiedTest(false), 2000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#14110F] p-5 rounded-2xl border border-white/5 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#C5A059]/20 text-[#E5C158] flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-display font-bold text-white">
              Payment &amp; QR Code Settings
            </h2>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
              isEnabled 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
            }`}>
              {isEnabled ? 'QR Active' : 'QR Inactive'}
            </span>
          </div>
          <p className="text-xs text-[#D6CEBF] mt-1.5 leading-relaxed">
            Manage your restaurant’s customer payment methods. Upload, preview, replace, or deactivate your payment QR code. Changes automatically sync to the public checkout flow.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleResetToDemo}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#D6CEBF] text-xs font-semibold flex items-center gap-1.5 border border-white/10 transition-colors"
            title="Reset to sample demo QR code"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Sample</span>
          </button>

          <button
            id="save-payment-settings-btn"
            type="submit"
            className="btn-gold px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#C5A059]/25 hover:scale-[1.02] transition-transform cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: QR Asset & File Manager (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Live Customer Preview Card */}
          <div className="bg-[#14110F] border border-white/10 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white">
                <Eye className="w-4 h-4 text-[#C5A059]" />
                <span>Live Checkout QR Preview</span>
              </div>
              <span className="text-[10px] text-[#C5A059] font-mono">Mobile-Ready</span>
            </div>

            {/* QR Card Container */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#0d0b0a] border border-[#d4af37]/30 flex flex-col items-center text-center shadow-inner relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#d4af37]/5 rounded-full blur-2xl pointer-events-none" />

              {/* QR Image Frame */}
              <div className="relative group">
                <div className="w-48 h-48 sm:w-52 sm:h-52 bg-white rounded-2xl p-3 shadow-2xl flex items-center justify-center border-2 border-[#d4af37]/40">
                  {qrCodeImage ? (
                    <img
                      src={qrCodeImage}
                      alt="Restaurant Payment QR Code"
                      className="w-full h-full object-contain rounded-lg"
                    />
                  ) : (
                    <div className="text-center p-4 text-neutral-400">
                      <QrCode className="w-12 h-12 mx-auto mb-2 text-neutral-300 stroke-[1.5]" />
                      <p className="text-[11px] font-medium text-neutral-600">No QR Code Image Uploaded</p>
                    </div>
                  )}
                </div>

                {qrCodeImage && (
                  <div className="mt-2 text-[10px] text-emerald-400 font-mono flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Scannable Asset Loaded</span>
                  </div>
                )}
              </div>

              {/* Dynamic Account Details Preview */}
              <div className="w-full mt-4 pt-3 border-t border-white/10 space-y-1.5">
                <div className="text-xs font-bold text-[#fdfbf7]">
                  {accountName || 'Official Merchant Account'}
                </div>

                {accountNumber && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#1c1815] border border-white/10 text-[11px] font-mono text-[#d4af37]">
                    <span>{accountNumber}</span>
                    <button
                      type="button"
                      onClick={handleCopySample}
                      className="text-[#a89d8f] hover:text-white transition-colors"
                      title="Copy account number"
                    >
                      {copiedTest ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                )}

                <div className="text-[11px] text-[#a89d8f] leading-snug px-2">
                  {instructions || 'Scan the QR code with your supported payment app to make your payment.'}
                </div>

                {bankOrWalletName && (
                  <div className="text-[10px] text-[#8e8272] pt-1 border-t border-white/5">
                    Supported: {bankOrWalletName}
                  </div>
                )}
              </div>
            </div>

            {/* Upload & Replacement Controls */}
            <div className="space-y-3 pt-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
                id="qr-file-input"
              />

              {/* Drag & Drop / Upload Trigger Area */}
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`p-4 border-2 border-dashed rounded-xl text-center cursor-pointer transition-all ${
                  dragOver 
                    ? 'border-[#C5A059] bg-[#C5A059]/10' 
                    : 'border-white/15 hover:border-[#C5A059]/60 bg-white/[0.02]'
                }`}
              >
                <Upload className="w-6 h-6 text-[#C5A059] mx-auto mb-1.5" />
                <p className="text-xs font-bold text-white">Click or Drag &amp; Drop New QR Image</p>
                <p className="text-[10px] text-[#D6CEBF]/70 mt-0.5">Supports PNG, JPG, SVG, WebP (Max 5MB)</p>
              </div>

              {/* URL input fallback */}
              <div className="space-y-1">
                <label className="text-[11px] text-[#D6CEBF] font-medium">Or Set from Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    placeholder="https://example.com/payment-qr.png"
                    className="flex-1 bg-[#1A1715] border border-white/10 focus:border-[#C5A059] rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleApplyUrl}
                    disabled={!imageUrlInput.trim()}
                    className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 disabled:opacity-40 text-xs font-bold text-white transition-colors"
                  >
                    Apply URL
                  </button>
                </div>
              </div>

              {/* Delete / Clear Action */}
              {qrCodeImage && (
                <button
                  type="button"
                  onClick={handleDeleteQr}
                  className="w-full py-2 px-3 rounded-xl bg-rose-950/20 hover:bg-rose-950/40 text-rose-300 text-xs font-bold flex items-center justify-center gap-1.5 border border-rose-500/20 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Current QR Graphic</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Configuration & Options (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Activation & Payment Controls Card */}
          <div className="bg-[#14110F] border border-white/10 rounded-2xl p-5 space-y-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2 border-b border-white/10 pb-3">
              <Smartphone className="w-4 h-4 text-[#C5A059]" />
              <span>QR Payment Configuration</span>
            </h3>

            {/* Activation Switch */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#1A1715] border border-white/10">
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <span>Enable QR Payment at Checkout</span>
                  {isEnabled && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  )}
                </h4>
                <p className="text-[11px] text-[#D6CEBF]/70 mt-0.5">
                  When enabled, customers can select QR Payment and scan this code to pay.
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isEnabled}
                  onChange={(e) => setIsEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C5A059]"></div>
              </label>
            </div>

            {/* Displayed Account Name */}
            <div className="space-y-1.5">
              <label className="text-xs text-[#D6CEBF] font-semibold flex items-center justify-between">
                <span>Displayed Payment Account / Merchant Name <span className="text-rose-400">*</span></span>
                <span className="text-[10px] text-[#8e8272]">Shown to customers</span>
              </label>
              <input
                id="qr-account-name"
                type="text"
                required
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                placeholder="e.g. Official Merchant Account (Raast / Wallet)"
                className="w-full bg-[#1A1715] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white outline-none"
              />
            </div>

            {/* Account Number / Raast ID / IBAN */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs text-[#D6CEBF] font-semibold flex items-center justify-between">
                  <span>Account # / Raast ID (Optional)</span>
                </label>
                <input
                  id="qr-account-number"
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="e.g. +92 300 1234567 or Raast ID"
                  className="w-full bg-[#1A1715] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2.5 text-xs text-white font-mono outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-[#D6CEBF] font-semibold">
                  Supported Wallets &amp; Apps Label
                </label>
                <input
                  id="qr-wallets-label"
                  type="text"
                  value={bankOrWalletName}
                  onChange={(e) => setBankOrWalletName(e.target.value)}
                  placeholder="e.g. Raast, JazzCash, Easypaisa, SadaPay, Banking Apps"
                  className="w-full bg-[#1A1715] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                />
              </div>
            </div>

            {/* Customer Instruction Text */}
            <div className="space-y-1.5">
              <label className="text-xs text-[#D6CEBF] font-semibold flex items-center justify-between">
                <span>Customer Instructions</span>
                <span className="text-[10px] text-[#C5A059]">Shown directly under QR code</span>
              </label>
              <textarea
                id="qr-instructions"
                rows={2}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Scan the QR code with your supported payment app to make your payment."
                className="w-full bg-[#1A1715] border border-white/10 focus:border-[#C5A059] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none resize-none"
              />
            </div>
          </div>

          {/* Additional Checkout Payment Methods */}
          <div className="bg-[#14110F] border border-white/10 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2 border-b border-white/10 pb-3">
              <CreditCard className="w-4 h-4 text-[#C5A059]" />
              <span>Other Checkout Payment Options</span>
            </h3>

            <div className="space-y-3">
              {/* Cash On Delivery Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#1A1715] border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <Banknote className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">Cash on Delivery / Pay on Delivery</h5>
                    <p className="text-[10px] text-[#D6CEBF]/70">Accept physical cash payment upon delivery or takeaway pickup.</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={enableCashOnDelivery}
                  onChange={(e) => setEnableCashOnDelivery(e.target.checked)}
                  className="w-4 h-4 rounded accent-[#C5A059]"
                />
              </div>

              {/* Card on Delivery / POS Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#1A1715] border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">Card on Delivery (Mobile POS Terminal)</h5>
                    <p className="text-[10px] text-[#D6CEBF]/70">Rider brings wireless card terminal for Visa / Mastercard / PayPak.</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={enableCardOnDelivery}
                  onChange={(e) => setEnableCardOnDelivery(e.target.checked)}
                  className="w-4 h-4 rounded accent-[#C5A059]"
                />
              </div>

              {/* Direct Bank Transfer Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#1A1715] border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">Direct Bank / IBAN Transfer</h5>
                    <p className="text-[10px] text-[#D6CEBF]/70">Direct bank account details shown during checkout.</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={enableBankTransfer}
                  onChange={(e) => setEnableBankTransfer(e.target.checked)}
                  className="w-4 h-4 rounded accent-[#C5A059]"
                />
              </div>
            </div>
          </div>

          {/* Verification & Gateway Note */}
          <div className="p-4 rounded-xl bg-[#1A1715]/60 border border-white/10 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
            <div className="text-[11px] text-[#D6CEBF]/80 leading-relaxed">
              <strong className="text-white">Notice regarding Payment Verification:</strong> In accordance with hospitality best practices, orders placed with QR Payment will display the QR code for instant scanning and record the order. Payment verification occurs via your banking app notification or receipt inspection upon order arrival.
            </div>
          </div>

          {/* Bottom Save Bar */}
          <div className="pt-3 flex justify-end">
            <button
              id="save-payment-settings-bottom-btn"
              type="submit"
              className="btn-gold px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-[#C5A059]/20 hover:scale-[1.01] transition-transform cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Save &amp; Apply Payment Settings</span>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};
