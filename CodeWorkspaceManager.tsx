import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRestaurantData } from '../../context/RestaurantDataContext';
import {
  Code2,
  FileCode,
  Save,
  RotateCcw,
  Copy,
  Check,
  Download,
  Upload,
  Sparkles,
  Play,
  Terminal,
  Layers,
  AlertCircle,
  CheckCircle2,
  Search,
  BookOpen,
  Eye,
  Database,
  RefreshCw,
  FolderCode,
  FileJson,
  Hash,
  ArrowRight,
  Sliders,
  CheckCheck
} from 'lucide-react';

interface CodeWorkspaceManagerProps {
  onShowToast: (title: string, message?: string, type?: 'success' | 'gold' | 'info') => void;
  onNavigateTab?: (tab: string) => void;
}

type VirtualFileId =
  | 'config'
  | 'menu'
  | 'deals'
  | 'nashta'
  | 'drinks'
  | 'icecream'
  | 'categories'
  | 'food3d'
  | 'details'
  | 'payment'
  | 'delivery'
  | 'ai'
  | 'recipes'
  | 'chefs'
  | 'events'
  | 'reviews'
  | 'full-database';

interface VirtualFile {
  id: VirtualFileId;
  name: string;
  filename: string;
  category: 'core' | 'catalog' | 'features' | 'database';
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const VIRTUAL_FILES: VirtualFile[] = [
  {
    id: 'full-database',
    name: 'Full Application Database',
    filename: 'full-live-database.json',
    category: 'database',
    description: 'Complete state bundle including all menu, deals, config, and media records.',
    icon: Database
  },
  {
    id: 'config',
    name: 'Restaurant Config & Identity',
    filename: 'restaurant-config.json',
    category: 'core',
    description: 'Name, glowing title, hero media, contact info, currency, and theme colors.',
    icon: FileCode
  },
  {
    id: 'menu',
    name: 'Menu Dishes & Pricing',
    filename: 'menu-catalog.json',
    category: 'catalog',
    description: 'All Karahi, Handi, BBQ, Steaks, Burgers, Starters, and spicy level flags.',
    icon: FileJson
  },
  {
    id: 'deals',
    name: 'Meals & Deals (Combos)',
    filename: 'combos-and-deals.json',
    category: 'catalog',
    description: 'Family deals, BBQ platters, fast food bundles, and portion descriptions.',
    icon: FileJson
  },
  {
    id: 'nashta',
    name: 'Nashta Point (Breakfast & Chai)',
    filename: 'nashta-breakfast.json',
    category: 'catalog',
    description: 'Halwa Puri thali, Paratha rolls, Karak Chai, and breakfast hours.',
    icon: FileJson
  },
  {
    id: 'drinks',
    name: 'Soft Drinks & Packaging Sizes',
    filename: 'soft-drinks-bar.json',
    category: 'catalog',
    description: 'Chilled halal sodas, tin cans, 1.5L bottles, and mineral water.',
    icon: FileJson
  },
  {
    id: 'icecream',
    name: 'Ice Cream & Dessert Bar',
    filename: 'dessert-bar.json',
    category: 'catalog',
    description: 'Artisan Gelato, Sundaes, Thickshakes, and sizzling brownie skillets.',
    icon: FileJson
  },
  {
    id: 'categories',
    name: 'Custom Categories',
    filename: 'custom-categories.json',
    category: 'core',
    description: 'Navigation category slugs, display orders, and badges.',
    icon: Layers
  },
  {
    id: 'food3d',
    name: '3D Food Showcase & Visual',
    filename: '3d-food-showcase.json',
    category: 'features',
    description: 'Live Shinwari 3D wok parameters, rotation speeds, embers, and glow.',
    icon: Sparkles
  },
  {
    id: 'details',
    name: 'Restaurant Details & Glow Title',
    filename: 'details-heritage-block.json',
    category: 'core',
    description: 'Heritage description, glowing header typography, and custom detail cards.',
    icon: FileCode
  },
  {
    id: 'payment',
    name: 'Payment & QR Code Settings',
    filename: 'payment-methods-qr.json',
    category: 'features',
    description: 'Raast instant QR image, wallet account numbers, and cash on delivery.',
    icon: Hash
  },
  {
    id: 'delivery',
    name: 'Delivery, Pickup & Hotlines',
    filename: 'delivery-and-pickup.json',
    category: 'features',
    description: 'Delivery radius, fees, preparation windows, and dispatch hotlines.',
    icon: FileCode
  },
  {
    id: 'ai',
    name: 'AI Assistant & Billa Rules',
    filename: 'ai-assistant-rules.json',
    category: 'features',
    description: 'Personality prompts, bilingual Urdu/English behavior, and recommendations.',
    icon: Sparkles
  },
  {
    id: 'recipes',
    name: 'Special Hearth Recipes',
    filename: 'hearthside-recipes.json',
    category: 'catalog',
    description: 'Secret culinary recipes, ingredients, instructions, and chef tips.',
    icon: BookOpen
  },
  {
    id: 'chefs',
    name: 'Executive Chefs',
    filename: 'executive-chefs.json',
    category: 'catalog',
    description: 'Chef biographies, specialties, awards, and credentials.',
    icon: FileCode
  },
  {
    id: 'events',
    name: 'Events & Tastings',
    filename: 'events-and-tastings.json',
    category: 'catalog',
    description: 'Masterclasses, BBQ nights, and private culinary tasting reservations.',
    icon: FileCode
  },
  {
    id: 'reviews',
    name: 'Customer Reviews',
    filename: 'customer-reviews.json',
    category: 'catalog',
    description: 'Patron reviews, ratings, approved status, and feedback dates.',
    icon: FileCode
  }
];

export const CodeWorkspaceManager: React.FC<CodeWorkspaceManagerProps> = ({
  onShowToast,
  onNavigateTab
}) => {
  const {
    config,
    updateConfig,
    menuItems,
    deals,
    nashtaConfig,
    updateNashtaConfig,
    nashtaItems,
    softDrinks,
    dessertBarItems,
    food3dConfig,
    updateFood3DConfig,
    updateDetailsBlock,
    specialRecipes,
    chefs,
    events,
    reviews,
    exportDataJSON,
    importDataJSON
  } = useRestaurantData();

  const [selectedFileId, setSelectedFileId] = useState<VirtualFileId>('config');
  const [codeContent, setCodeContent] = useState<string>('');
  const [initialFileContent, setInitialFileContent] = useState<string>('');
  const [searchFilter, setSearchFilter] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isModified, setIsModified] = useState(false);
  const [activeWorkspaceMode, setActiveWorkspaceMode] = useState<'editor' | 'sandbox' | 'snippets'>('editor');

  // Interactive Sandbox / Query State
  const [sandboxQuery, setSandboxQuery] = useState<string>('data.length');
  const [sandboxOutput, setSandboxOutput] = useState<string>('');
  const [sandboxError, setSandboxError] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to extract JSON data corresponding to selected file
  const getFileData = (fileId: VirtualFileId): any => {
    switch (fileId) {
      case 'config':
        return config;
      case 'menu':
        return menuItems;
      case 'deals':
        return deals;
      case 'nashta':
        return { config: nashtaConfig, items: nashtaItems };
      case 'drinks':
        return softDrinks;
      case 'icecream':
        return dessertBarItems;
      case 'categories':
        return config.customCategories || [];
      case 'food3d':
        return food3dConfig;
      case 'details':
        return config.detailsBlock || {};
      case 'payment':
        return config.qrPayment || {};
      case 'delivery':
        return config.deliverySettings || {};
      case 'ai':
        return config.aiAssistant || {};
      case 'recipes':
        return specialRecipes;
      case 'chefs':
        return chefs;
      case 'events':
        return events;
      case 'reviews':
        return reviews;
      case 'full-database':
        try {
          return JSON.parse(exportDataJSON());
        } catch {
          return { config, menuItems, deals, nashtaConfig, nashtaItems, softDrinks, dessertBarItems };
        }
      default:
        return {};
    }
  };

  // Synchronize editor content when file selection changes or live data initializes
  useEffect(() => {
    const rawData = getFileData(selectedFileId);
    const formatted = JSON.stringify(rawData, null, 2);
    setCodeContent(formatted);
    setInitialFileContent(formatted);
    setIsModified(false);
    setValidationError(null);
  }, [selectedFileId]);

  // Track modification & validate live syntax
  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const nextVal = e.target.value;
    setCodeContent(nextVal);
    setIsModified(nextVal !== initialFileContent);

    try {
      JSON.parse(nextVal);
      setValidationError(null);
    } catch (err: any) {
      setValidationError(err.message || 'JSON Syntax Error');
    }
  };

  // Prettify / Format JSON
  const handleFormatCode = () => {
    try {
      const parsed = JSON.parse(codeContent);
      const formatted = JSON.stringify(parsed, null, 2);
      setCodeContent(formatted);
      setValidationError(null);
      onShowToast('Code Formatted', 'JSON successfully validated and indented with 2-space formatting.', 'gold');
    } catch (err: any) {
      setValidationError(err.message || 'Cannot format invalid JSON');
      onShowToast('Format Failed', 'Fix JSON syntax errors before formatting.', 'info');
    }
  };

  // Minify JSON
  const handleMinifyCode = () => {
    try {
      const parsed = JSON.parse(codeContent);
      const minified = JSON.stringify(parsed);
      setCodeContent(minified);
      setValidationError(null);
      onShowToast('Code Minified', 'Whitespace removed from JSON document.', 'info');
    } catch (err: any) {
      setValidationError(err.message || 'Cannot minify invalid JSON');
    }
  };

  // Save / Apply Changes Live to Context & LocalStorage
  const handleSaveCode = () => {
    try {
      const parsed = JSON.parse(codeContent);
      let currentBundle: any = {};
      try {
        currentBundle = JSON.parse(exportDataJSON());
      } catch {
        currentBundle = { config, menuItems, deals, nashtaConfig, nashtaItems, softDrinks, dessertBarItems };
      }

      switch (selectedFileId) {
        case 'config':
          updateConfig(parsed);
          break;
        case 'menu':
          if (Array.isArray(parsed)) {
            importDataJSON(JSON.stringify({ ...currentBundle, menuItems: parsed }));
          } else {
            throw new Error('Menu items must be an Array of dish objects.');
          }
          break;
        case 'deals':
          if (Array.isArray(parsed)) {
            importDataJSON(JSON.stringify({ ...currentBundle, deals: parsed }));
          } else {
            throw new Error('Deals must be an Array of deal objects.');
          }
          break;
        case 'nashta':
          if (parsed.config) updateNashtaConfig(parsed.config);
          if (Array.isArray(parsed.items)) {
            importDataJSON(JSON.stringify({ ...currentBundle, nashtaItems: parsed.items, nashtaConfig: parsed.config || nashtaConfig }));
          }
          break;
        case 'drinks':
          if (Array.isArray(parsed)) {
            importDataJSON(JSON.stringify({ ...currentBundle, softDrinks: parsed }));
          } else {
            throw new Error('Soft drinks must be an Array.');
          }
          break;
        case 'icecream':
          if (Array.isArray(parsed)) {
            importDataJSON(JSON.stringify({ ...currentBundle, dessertBarItems: parsed }));
          } else {
            throw new Error('Dessert items must be an Array.');
          }
          break;
        case 'categories':
          if (Array.isArray(parsed)) {
            updateConfig({ customCategories: parsed });
          } else {
            throw new Error('Categories must be an Array.');
          }
          break;
        case 'food3d':
          updateFood3DConfig(parsed);
          break;
        case 'details':
          updateDetailsBlock(parsed);
          break;
        case 'payment':
          updateConfig({ qrPayment: parsed });
          break;
        case 'delivery':
          updateConfig({ deliverySettings: parsed });
          break;
        case 'ai':
          updateConfig({ aiAssistant: parsed });
          break;
        case 'recipes':
          if (Array.isArray(parsed)) {
            importDataJSON(JSON.stringify({ ...currentBundle, specialRecipes: parsed }));
          }
          break;
        case 'chefs':
          if (Array.isArray(parsed)) {
            importDataJSON(JSON.stringify({ ...currentBundle, chefs: parsed }));
          }
          break;
        case 'events':
          if (Array.isArray(parsed)) {
            importDataJSON(JSON.stringify({ ...currentBundle, events: parsed }));
          }
          break;
        case 'reviews':
          if (Array.isArray(parsed)) {
            importDataJSON(JSON.stringify({ ...currentBundle, reviews: parsed }));
          }
          break;
        case 'full-database':
          const result = importDataJSON(codeContent);
          if (!result.success) {
            throw new Error(result.error || 'Failed to import full database bundle');
          }
          break;
      }

      setInitialFileContent(codeContent);
      setIsModified(false);
      setValidationError(null);
      onShowToast(
        'Code Saved & Applied Live',
        `${selectedFile.name} (${selectedFile.filename}) updated in live website state.`,
        'success'
      );
    } catch (err: any) {
      setValidationError(err.message || 'Validation failed');
      onShowToast('Save Failed', err.message || 'Invalid JSON syntax encountered.', 'info');
    }
  };

  // Revert / Reset current editor
  const handleRevert = () => {
    setCodeContent(initialFileContent);
    setIsModified(false);
    setValidationError(null);
    onShowToast('Changes Reverted', 'Reverted editor content back to active system state.', 'info');
  };

  // Copy code to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(codeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
    onShowToast('Code Copied', `Copied ${selectedFile.filename} to clipboard.`, 'gold');
  };

  // Download code file
  const handleDownload = () => {
    const blob = new Blob([codeContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedFile.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onShowToast('File Downloaded', `Saved ${selectedFile.filename} to your device.`, 'gold');
  };

  // Upload and replace file
  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        JSON.parse(text); // validate
        setCodeContent(text);
        setIsModified(true);
        setValidationError(null);
        onShowToast('File Loaded', `Imported ${file.name}. Review and click "Apply Code Changes" to persist.`, 'gold');
      } catch (err: any) {
        setValidationError(err.message || 'Uploaded file contains invalid JSON.');
        onShowToast('Import Error', 'File is not valid JSON.', 'info');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Run Sandbox Query
  const handleRunQuery = () => {
    setSandboxError(null);
    try {
      const data = JSON.parse(codeContent);
      // Safe evaluation with standard Function constructor
      const queryFn = new Function('data', `return (${sandboxQuery});`);
      const result = queryFn(data);
      setSandboxOutput(
        typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result)
      );
    } catch (err: any) {
      setSandboxError(err.message || 'Execution error');
      setSandboxOutput('');
    }
  };

  // Insert Quick Snippet
  const handleInsertSnippet = (snippet: string) => {
    try {
      const current = JSON.parse(codeContent);
      const snippetObj = JSON.parse(snippet);

      if (Array.isArray(current)) {
        const next = [...current, snippetObj];
        const formatted = JSON.stringify(next, null, 2);
        setCodeContent(formatted);
        setIsModified(true);
        onShowToast('Snippet Appended', 'New item snippet appended to array.', 'gold');
      } else if (typeof current === 'object') {
        const next = { ...current, ...snippetObj };
        const formatted = JSON.stringify(next, null, 2);
        setCodeContent(formatted);
        setIsModified(true);
        onShowToast('Snippet Merged', 'Config snippet merged into JSON object.', 'gold');
      }
    } catch (err: any) {
      onShowToast('Snippet Failed', 'Ensure target file is valid JSON before inserting.', 'info');
    }
  };

  const selectedFile = VIRTUAL_FILES.find((f) => f.id === selectedFileId) || VIRTUAL_FILES[0];

  const filteredFiles = useMemo(() => {
    if (!searchFilter.trim()) return VIRTUAL_FILES;
    const q = searchFilter.toLowerCase();
    return VIRTUAL_FILES.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.filename.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q)
    );
  }, [searchFilter]);

  // Line count and character calculations
  const lineCount = useMemo(() => {
    return codeContent.split('\n').length;
  }, [codeContent]);

  const byteSize = useMemo(() => {
    return new Blob([codeContent]).size;
  }, [codeContent]);

  return (
    <div className="space-y-6">
      {/* Top Banner: Code Workspace Overview */}
      <div className="bg-gradient-to-r from-[#181412] via-[#1f1610] to-[#14110F] p-6 rounded-2xl border border-[#d4af37]/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#2d1e12] border border-[#d4af37] flex items-center justify-center text-[#d4af37] shadow-lg shrink-0">
            <Code2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#d4af37] text-[10px] font-bold uppercase tracking-wider">
                Developer &amp; Owner Code Workspace
              </span>
              <span className="text-xs text-[#a89d8f]">• Live JSON Editor &amp; State Compiler</span>
            </div>
            <h2 className="text-xl font-serif font-bold text-[#fdfbf7] mt-1">
              Live Configuration &amp; Code Workspace
            </h2>
            <p className="text-xs text-[#c5bcad] mt-1 leading-relaxed max-w-2xl">
              Inspect, edit, validate, and inject live JSON code across all restaurant modules, pricing structures, menu catalogs, and brand settings with instant live preview synchronization.
            </p>
          </div>
        </div>

        {/* Global Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleSaveCode}
            disabled={!!validationError}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all cursor-pointer ${
              isModified && !validationError
                ? 'bg-gradient-to-r from-[#d4af37] via-amber-400 to-[#b38927] text-black hover:brightness-110 animate-pulse'
                : 'bg-[#2a2219] text-[#c5bcad] border border-white/10 hover:bg-[#342a1e]'
            }`}
          >
            <Save className="w-4 h-4" />
            <span>{isModified ? 'Apply Code Changes' : 'Saved (Up to Date)'}</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Grid (Left Sidebar + Center Editor/Sandbox) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT COLUMN: Virtual Workspace Explorer (4 Cols) */}
        <div className="lg:col-span-4 bg-[#14110F] border border-white/10 rounded-2xl p-4 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <FolderCode className="w-4 h-4 text-[#d4af37]" />
              <span className="font-serif text-sm font-bold text-white uppercase tracking-wider">
                Workspace Files
              </span>
            </div>
            <span className="text-[11px] font-mono text-[#a89d8f]">
              {VIRTUAL_FILES.length} Files
            </span>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#a89d8f]" />
            <input
              type="text"
              placeholder="Search code files or datasets..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#1b1612] border border-white/10 rounded-xl text-xs text-white placeholder-white/30 outline-none focus:border-[#d4af37] transition-colors"
            />
          </div>

          {/* File Explorer List */}
          <div className="space-y-1.5 max-h-[580px] overflow-y-auto pr-1">
            {filteredFiles.map((file) => {
              const Icon = file.icon;
              const isSelected = file.id === selectedFileId;
              return (
                <button
                  key={file.id}
                  onClick={() => setSelectedFileId(file.id)}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-start gap-2.5 cursor-pointer group ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#2a1d13] to-[#1c140e] border-[#d4af37] shadow-md'
                      : 'bg-[#181310]/80 border-white/5 hover:border-white/20 hover:bg-[#201813]'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected
                        ? 'bg-[#d4af37] text-black font-bold'
                        : 'bg-[#251b14] text-[#d4af37] group-hover:bg-[#342419]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <div className="text-xs font-bold text-white truncate font-mono">
                        {file.filename}
                      </div>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-[#d4af37] shrink-0" />
                      )}
                    </div>
                    <div className="text-[10px] text-[#a89d8f] truncate mt-0.5">
                      {file.name}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Jump to Visual CMS Managers */}
          {onNavigateTab && (
            <div className="pt-3 border-t border-white/10 space-y-2">
              <div className="text-[10px] uppercase font-bold tracking-wider text-[#a89d8f] flex items-center gap-1.5">
                <Sliders className="w-3 h-3 text-[#d4af37]" />
                <span>Jump to Visual CMS Form</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                <button
                  onClick={() => onNavigateTab('menu')}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white transition-colors text-left truncate cursor-pointer"
                >
                  → Menu Dishes
                </button>
                <button
                  onClick={() => onNavigateTab('deals')}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white transition-colors text-left truncate cursor-pointer"
                >
                  → Deals &amp; Combos
                </button>
                <button
                  onClick={() => onNavigateTab('nashta')}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white transition-colors text-left truncate cursor-pointer"
                >
                  → Nashta Point
                </button>
                <button
                  onClick={() => onNavigateTab('branding')}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white transition-colors text-left truncate cursor-pointer"
                >
                  → Brand &amp; Logo
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Code Editor & Sandbox Workspace (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Workspace Tabs: [ Code Editor ] [ Live Query Sandbox ] [ Snippets ] */}
          <div className="bg-[#14110F] border border-white/10 rounded-2xl p-2 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveWorkspaceMode('editor')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeWorkspaceMode === 'editor'
                    ? 'bg-[#d4af37] text-black shadow-md'
                    : 'text-[#c5bcad] hover:text-white hover:bg-white/5'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Code Editor</span>
              </button>

              <button
                onClick={() => setActiveWorkspaceMode('sandbox')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeWorkspaceMode === 'sandbox'
                    ? 'bg-[#d4af37] text-black shadow-md'
                    : 'text-[#c5bcad] hover:text-white hover:bg-white/5'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Query Sandbox</span>
              </button>

              <button
                onClick={() => setActiveWorkspaceMode('snippets')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeWorkspaceMode === 'snippets'
                    ? 'bg-[#d4af37] text-black shadow-md'
                    : 'text-[#c5bcad] hover:text-white hover:bg-white/5'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Snippets Library</span>
              </button>
            </div>

            {/* Editor Metrics */}
            <div className="hidden sm:flex items-center gap-3 text-[11px] font-mono text-[#a89d8f] pr-2">
              <span>{lineCount} lines</span>
              <span>•</span>
              <span>{(byteSize / 1024).toFixed(1)} KB</span>
            </div>
          </div>

          {/* VIEW 1: CODE EDITOR */}
          {activeWorkspaceMode === 'editor' && (
            <div className="bg-[#0f0c0a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
              {/* Code Editor Toolbar */}
              <div className="bg-[#181412] px-4 py-2.5 border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-[#d4af37]">
                    {selectedFile.filename}
                  </span>
                  {isModified ? (
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-mono font-bold">
                      ● MODIFIED (UNSAVED)
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono">
                      SYNCED
                    </span>
                  )}
                </div>

                {/* Toolbar Buttons */}
                <div className="flex items-center flex-wrap gap-1.5">
                  <button
                    onClick={handleFormatCode}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-[#e2d9cc] text-[11px] font-medium transition-colors cursor-pointer"
                    title="Prettify and indent JSON"
                  >
                    Format JSON
                  </button>

                  <button
                    onClick={handleMinifyCode}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-[#a89d8f] text-[11px] font-medium transition-colors cursor-pointer"
                    title="Minify JSON"
                  >
                    Minify
                  </button>

                  <button
                    onClick={handleCopy}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-[#e2d9cc] text-[11px] transition-colors cursor-pointer"
                    title="Copy code"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={handleDownload}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-[#e2d9cc] text-[11px] transition-colors cursor-pointer"
                    title="Download JSON File"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-[#e2d9cc] text-[11px] transition-colors cursor-pointer"
                    title="Upload JSON File"
                  >
                    <Upload className="w-3.5 h-3.5" />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".json"
                    onChange={handleFileImport}
                    className="hidden"
                  />

                  {isModified && (
                    <button
                      onClick={handleRevert}
                      className="px-2.5 py-1 rounded-lg bg-rose-950/40 border border-rose-500/40 text-rose-300 text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                      title="Revert to last saved live state"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Revert</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Validation Alert Bar */}
              {validationError ? (
                <div className="bg-rose-950/80 border-b border-rose-500/40 px-4 py-2 text-rose-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span className="font-mono truncate">{validationError}</span>
                </div>
              ) : (
                <div className="bg-emerald-950/30 border-b border-emerald-500/20 px-4 py-1.5 text-emerald-400 text-[11px] flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Valid JSON Syntax</span>
                  </div>
                  <span className="text-[10px] text-[#a89d8f]">Ready for live injection</span>
                </div>
              )}

              {/* Main Code Textarea */}
              <div className="relative font-mono text-xs">
                <textarea
                  ref={textareaRef}
                  value={codeContent}
                  onChange={handleCodeChange}
                  spellCheck={false}
                  rows={24}
                  className="w-full bg-[#0d0b09] text-[#e8dfd3] p-4 font-mono text-xs leading-relaxed outline-none resize-y selection:bg-[#d4af37]/30 border-none min-h-[480px]"
                />
              </div>

              {/* Bottom Action Footer */}
              <div className="bg-[#14110F] px-4 py-3 border-t border-white/10 flex items-center justify-between gap-3">
                <div className="text-[11px] text-[#a89d8f]">
                  Editing: <strong className="text-white">{selectedFile.name}</strong>
                </div>

                <div className="flex items-center gap-2">
                  {isModified && (
                    <button
                      onClick={handleRevert}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-stone-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      Cancel &amp; Revert
                    </button>
                  )}

                  <button
                    onClick={handleSaveCode}
                    disabled={!!validationError}
                    className="btn-gold px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Apply Code Changes</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: LIVE QUERY & SANDBOX */}
          {activeWorkspaceMode === 'sandbox' && (
            <div className="bg-[#14110F] border border-white/10 rounded-2xl p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#d4af37]" />
                  <h3 className="font-serif font-bold text-white text-base">
                    JavaScript Query Runner &amp; Filter
                  </h3>
                </div>
                <span className="text-xs text-[#a89d8f]">Evaluates against current file data</span>
              </div>

              <p className="text-xs text-[#c5bcad] leading-relaxed">
                Type any JavaScript expression with the variable <code className="text-[#d4af37] bg-black/40 px-1 py-0.5 rounded font-mono">data</code> representing the parsed JSON of <span className="text-white font-semibold">{selectedFile.filename}</span>.
              </p>

              {/* Sample Queries */}
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => {
                    setSandboxQuery('Array.isArray(data) ? data.length : Object.keys(data).length');
                  }}
                  className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-[11px] font-mono text-[#d4af37] border border-white/5 cursor-pointer"
                >
                  Length / Count
                </button>
                <button
                  onClick={() => {
                    setSandboxQuery('Array.isArray(data) ? data.map(d => ({ name: d.name || d.title, price: d.price })) : data');
                  }}
                  className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-[11px] font-mono text-[#d4af37] border border-white/5 cursor-pointer"
                >
                  List Names &amp; Prices
                </button>
                <button
                  onClick={() => {
                    setSandboxQuery('Array.isArray(data) ? data.filter(d => (d.price || 0) > 1000) : data');
                  }}
                  className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-[11px] font-mono text-[#d4af37] border border-white/5 cursor-pointer"
                >
                  Filter Price &gt; 1000
                </button>
              </div>

              {/* Query Input Box */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider">
                  Expression (return value)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={sandboxQuery}
                    onChange={(e) => setSandboxQuery(e.target.value)}
                    placeholder="e.g. data.filter(item => item.isChefSpecial)"
                    className="flex-1 bg-[#0d0b09] border border-white/10 rounded-xl px-4 py-2.5 text-xs font-mono text-white placeholder-white/30 focus:border-[#d4af37] outline-none"
                  />
                  <button
                    onClick={handleRunQuery}
                    className="btn-gold px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Run Query</span>
                  </button>
                </div>
              </div>

              {/* Output Display */}
              {sandboxError && (
                <div className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs font-mono">
                  {sandboxError}
                </div>
              )}

              {sandboxOutput && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-[#a89d8f]">
                    <span>Output Terminal</span>
                    <button
                      onClick={() => navigator.clipboard.writeText(sandboxOutput)}
                      className="hover:text-white text-[11px] flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" /> Copy Output
                    </button>
                  </div>
                  <pre className="p-4 rounded-xl bg-[#0d0b09] border border-white/10 text-xs font-mono text-emerald-300 max-h-72 overflow-y-auto leading-relaxed">
                    {sandboxOutput}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* VIEW 3: SNIPPETS LIBRARY */}
          {activeWorkspaceMode === 'snippets' && (
            <div className="bg-[#14110F] border border-white/10 rounded-2xl p-5 shadow-2xl space-y-4">
              <div className="pb-3 border-b border-white/10">
                <h3 className="font-serif font-bold text-white text-base flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#d4af37]" />
                  Code Snippets &amp; Templates Library
                </h3>
                <p className="text-xs text-[#a89d8f] mt-1">
                  Inject pre-configured schema snippets directly into the open code editor.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Snippet 1: Karahi Dish */}
                <div className="p-4 rounded-xl bg-[#1b1612] border border-white/5 flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="text-xs font-bold text-white font-serif">New Shinwari Mutton Karahi</h4>
                    <p className="text-[11px] text-[#a89d8f] mt-0.5">
                      Authentic wok dish with spice level, price in PKR, and chef special badge.
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      handleInsertSnippet(
                        JSON.stringify(
                          {
                            id: `karahi-custom-${Date.now()}`,
                            name: 'Signature Hearth Mutton Karahi (Full)',
                            category: 'main-courses',
                            price: 3600,
                            description:
                              'Fresh mountain lamb slow-simmered in organic butter with green chillies, cracked black pepper, and fragrant ginger slivers.',
                            image:
                              'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
                            isChefSpecial: true,
                            isSignature: true,
                            spiceLevel: 3,
                            servingSize: '3-4 Persons',
                            available: true
                          },
                          null,
                          2
                        )
                      )
                    }
                    className="w-full py-2 rounded-lg bg-white/5 hover:bg-[#d4af37] hover:text-black text-xs font-bold uppercase tracking-wider text-[#d4af37] transition-all cursor-pointer"
                  >
                    + Insert Dish Snippet
                  </button>
                </div>

                {/* Snippet 2: Family Deal Combo */}
                <div className="p-4 rounded-xl bg-[#1b1612] border border-white/5 flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="text-xs font-bold text-white font-serif">Family Feast Platter Deal</h4>
                    <p className="text-[11px] text-[#a89d8f] mt-0.5">
                      Multi-course combo including Karahi, BBQ Skewers, Naan, and Chilled Drinks.
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      handleInsertSnippet(
                        JSON.stringify(
                          {
                            id: `deal-custom-${Date.now()}`,
                            title: 'Royal Hearth Family Feast',
                            tag: 'Mega Saver Platter',
                            price: 4999,
                            originalPrice: 6200,
                            savingsText: 'Save 20%',
                            serves: '4-5 Persons',
                            image:
                              'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
                            isPopular: true,
                            available: true,
                            items: [
                              '1x Shinwari Mutton Karahi (Full)',
                              '4x Seekh Kebab Skewers',
                              '4x Roghani Sesame Naan',
                              '1x Mint Raita & Fresh Salad',
                              '1x 1.5L Chilled Soft Drink Bottle'
                            ]
                          },
                          null,
                          2
                        )
                      )
                    }
                    className="w-full py-2 rounded-lg bg-white/5 hover:bg-[#d4af37] hover:text-black text-xs font-bold uppercase tracking-wider text-[#d4af37] transition-all cursor-pointer"
                  >
                    + Insert Deal Snippet
                  </button>
                </div>

                {/* Snippet 3: Chilled Soft Drink */}
                <div className="p-4 rounded-xl bg-[#1b1612] border border-white/5 flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="text-xs font-bold text-white font-serif">Chilled Drink with Sizes</h4>
                    <p className="text-[11px] text-[#a89d8f] mt-0.5">
                      Soft drink item with 250ml Can, 500ml Pet, and 1.5L family bottle options.
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      handleInsertSnippet(
                        JSON.stringify(
                          {
                            id: `drink-custom-${Date.now()}`,
                            name: 'Chilled Gourmet Mint Lemonade Soda',
                            category: 'soft-drinks',
                            price: 250,
                            description: 'Freshly squeezed mint cooler with crushed ice and sparkling soda.',
                            image:
                              'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
                            packagingSizes: [
                              { sizeLabel: 'Single Glass', volume: '300ml', price: 250, isDefault: true },
                              { sizeLabel: 'Sharing Pitcher', volume: '1000ml', price: 650 }
                            ],
                            isChilled: true,
                            isHalalCertified: true,
                            inStock: true
                          },
                          null,
                          2
                        )
                      )
                    }
                    className="w-full py-2 rounded-lg bg-white/5 hover:bg-[#d4af37] hover:text-black text-xs font-bold uppercase tracking-wider text-[#d4af37] transition-all cursor-pointer"
                  >
                    + Insert Drink Snippet
                  </button>
                </div>

                {/* Snippet 4: Nashta Breakfast Item */}
                <div className="p-4 rounded-xl bg-[#1b1612] border border-white/5 flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="text-xs font-bold text-white font-serif">Halwa Puri Breakfast Thali</h4>
                    <p className="text-[11px] text-[#a89d8f] mt-0.5">
                      Traditional morning breakfast platter with Semolina Halwa and spiced Chana.
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      handleInsertSnippet(
                        JSON.stringify(
                          {
                            id: `nashta-custom-${Date.now()}`,
                            name: 'Grand Halwa Puri Morning Thali',
                            category: 'halwa-puri',
                            price: 450,
                            description: '2 Crispy hot Puris, spiced Tarkari Chana, Aloo Bhujia, and rich Sooji Halwa.',
                            image:
                              'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
                            isSpecial: true,
                            inStock: true,
                            servingSize: '1 Person',
                            spiceLevel: 1
                          },
                          null,
                          2
                        )
                      )
                    }
                    className="w-full py-2 rounded-lg bg-white/5 hover:bg-[#d4af37] hover:text-black text-xs font-bold uppercase tracking-wider text-[#d4af37] transition-all cursor-pointer"
                  >
                    + Insert Nashta Snippet
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
