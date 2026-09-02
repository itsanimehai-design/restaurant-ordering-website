import { DealBox, MenuItem, Order, StoreSettings, CategoryItem } from '../types';
import { INITIAL_DEAL_BOXES, INITIAL_MENU_ITEMS, INITIAL_STORE_SETTINGS, INITIAL_CATEGORIES } from '../data/defaultData';

const LOCAL_STORAGE_KEYS = {
  SETTINGS: 'pakbite_settings',
  DEALS: 'pakbite_deals',
  MENU: 'pakbite_menu',
  ORDERS: 'pakbite_orders',
  CATEGORIES: 'pakbite_categories',
};

// Client API Helper
export const api = {
  // Store Settings
  async getSettings(): Promise<StoreSettings> {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem(LOCAL_STORAGE_KEYS.SETTINGS, JSON.stringify(data));
        return data;
      }
    } catch {
      // ignore
    }
    const local = localStorage.getItem(LOCAL_STORAGE_KEYS.SETTINGS);
    return local ? JSON.parse(local) : INITIAL_STORE_SETTINGS;
  },

  // Categories
  async getCategories(): Promise<CategoryItem[]> {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          localStorage.setItem(LOCAL_STORAGE_KEYS.CATEGORIES, JSON.stringify(data));
          return data;
        }
      }
    } catch {
      // ignore
    }
    try {
      const local = localStorage.getItem(LOCAL_STORAGE_KEYS.CATEGORIES);
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return Array.isArray(INITIAL_CATEGORIES) ? INITIAL_CATEGORIES : [];
  },

  async createCategory(cat: Partial<CategoryItem>): Promise<CategoryItem> {
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cat),
      });
      if (res.ok) return await res.json();
    } catch {
      // ignore
    }
    const newCat: CategoryItem = {
      id: `cat-${Date.now()}`,
      name: cat.name || 'New Category',
      type: cat.type || 'both',
      icon: cat.icon || 'Sparkles',
      image: cat.image || '',
      displayOrder: cat.displayOrder || 1,
      isActive: cat.isActive !== false,
    };
    const cats = await this.getCategories();
    cats.push(newCat);
    localStorage.setItem(LOCAL_STORAGE_KEYS.CATEGORIES, JSON.stringify(cats));
    return newCat;
  },

  async updateCategory(id: string, updates: Partial<CategoryItem>): Promise<CategoryItem> {
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) return await res.json();
    } catch {
      // ignore
    }
    const cats = await this.getCategories();
    const idx = cats.findIndex((c) => c.id === id);
    if (idx !== -1) {
      cats[idx] = { ...cats[idx], ...updates };
      localStorage.setItem(LOCAL_STORAGE_KEYS.CATEGORIES, JSON.stringify(cats));
      return cats[idx];
    }
    throw new Error('Category not found');
  },

  async deleteCategory(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      if (res.ok) return true;
    } catch {
      // ignore
    }
    const cats = await this.getCategories();
    const filtered = cats.filter((c) => c.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEYS.CATEGORIES, JSON.stringify(filtered));
    return true;
  },

  async updateSettings(settings: Partial<StoreSettings>): Promise<StoreSettings> {
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        const updated = await res.json();
        localStorage.setItem(LOCAL_STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
        return updated;
      }
    } catch {
      // ignore
    }
    const current = await this.getSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(LOCAL_STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    return updated;
  },

  // Deals & Boxes
  async getDeals(includeAll = false): Promise<DealBox[]> {
    try {
      const res = await fetch(`/api/deals${includeAll ? '?all=true' : ''}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          localStorage.setItem(LOCAL_STORAGE_KEYS.DEALS, JSON.stringify(data));
          return data;
        }
      }
    } catch {
      // ignore
    }
    try {
      const local = localStorage.getItem(LOCAL_STORAGE_KEYS.DEALS);
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed)) {
          return includeAll ? parsed : parsed.filter((d) => d && d.isActive);
        }
      }
    } catch {
      // ignore
    }
    const deals: DealBox[] = Array.isArray(INITIAL_DEAL_BOXES) ? INITIAL_DEAL_BOXES : [];
    return includeAll ? deals : deals.filter((d) => d && d.isActive);
  },

  async createDeal(deal: Partial<DealBox>): Promise<DealBox> {
    try {
      const res = await fetch('/api/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deal),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback
    }

    const newDeal: DealBox = {
      id: `deal-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: deal.name || 'New Deal Box',
      image: deal.image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80',
      description: deal.description || '',
      price: Number(deal.price) || 0,
      originalPrice: deal.originalPrice ? Number(deal.originalPrice) : undefined,
      discount: deal.discount || '',
      category: deal.category || 'Family Deals',
      includedItems: deal.includedItems || [],
      addons: deal.addons || [],
      optionGroups: deal.optionGroups || [],
      isAvailable: deal.isAvailable !== false,
      isFeatured: deal.isFeatured === true,
      displayOrder: deal.displayOrder || 1,
      isActive: deal.isActive !== false,
      tag: deal.tag || '',
      servings: deal.servings || '',
      prepTimeMinutes: deal.prepTimeMinutes || 20,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const deals = await this.getDeals(true);
    deals.unshift(newDeal);
    localStorage.setItem(LOCAL_STORAGE_KEYS.DEALS, JSON.stringify(deals));
    return newDeal;
  },

  async updateDeal(id: string, updates: Partial<DealBox>): Promise<DealBox> {
    try {
      const res = await fetch(`/api/deals/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback
    }

    const deals = await this.getDeals(true);
    const index = deals.findIndex((d) => d.id === id);
    if (index !== -1) {
      deals[index] = { ...deals[index], ...updates, updatedAt: new Date().toISOString() };
      localStorage.setItem(LOCAL_STORAGE_KEYS.DEALS, JSON.stringify(deals));
      return deals[index];
    }
    throw new Error('Deal not found');
  },

  async deleteDeal(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/deals/${id}`, { method: 'DELETE' });
      if (res.ok) {
        return true;
      }
    } catch {
      // fallback
    }

    const deals = await this.getDeals(true);
    const filtered = deals.filter((d) => d.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEYS.DEALS, JSON.stringify(filtered));
    return true;
  },

  async duplicateDeal(id: string): Promise<DealBox> {
    try {
      const res = await fetch(`/api/deals/duplicate/${id}`, { method: 'POST' });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback
    }

    const deals = await this.getDeals(true);
    const original = deals.find((d) => d.id === id);
    if (!original) throw new Error('Deal not found');

    const duplicate: DealBox = {
      ...original,
      id: `deal-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: `${original.name} (Copy)`,
      displayOrder: (original.displayOrder || 1) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      includedItems: (original.includedItems || []).map((item) => ({ ...item, id: `inc-${Date.now()}-${Math.random().toString(36).substring(2, 5)}` })),
      addons: original.addons?.map((a) => ({ ...a, id: `add-${Date.now()}-${Math.random().toString(36).substring(2, 5)}` })),
    };
    deals.unshift(duplicate);
    localStorage.setItem(LOCAL_STORAGE_KEYS.DEALS, JSON.stringify(deals));
    return duplicate;
  },

  async reorderDeals(orderedIds: string[]): Promise<boolean> {
    try {
      const res = await fetch('/api/deals/reorder/batch', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedIds }),
      });
      if (res.ok) return true;
    } catch {
      // fallback
    }

    const deals = await this.getDeals(true);
    orderedIds.forEach((id, idx) => {
      const d = deals.find((item) => item.id === id);
      if (d) d.displayOrder = idx + 1;
    });
    localStorage.setItem(LOCAL_STORAGE_KEYS.DEALS, JSON.stringify(deals));
    return true;
  },

  // Menu items
  async getMenu(): Promise<MenuItem[]> {
    try {
      const res = await fetch('/api/menu');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          localStorage.setItem(LOCAL_STORAGE_KEYS.MENU, JSON.stringify(data));
          return data;
        }
      }
    } catch {
      // fallback
    }
    try {
      const local = localStorage.getItem(LOCAL_STORAGE_KEYS.MENU);
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // fallback
    }
    return Array.isArray(INITIAL_MENU_ITEMS) ? INITIAL_MENU_ITEMS : [];
  },

  async createMenuItem(item: Partial<MenuItem>): Promise<MenuItem> {
    try {
      const res = await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }

    const newItem: MenuItem = {
      id: `m-${Date.now()}`,
      name: item.name || 'New Item',
      description: item.description || '',
      price: Number(item.price) || 0,
      originalPrice: item.originalPrice ? Number(item.originalPrice) : undefined,
      category: item.category || 'Deal Meal',
      image: item.image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
      isAvailable: item.isAvailable !== false,
      isFeatured: item.isFeatured === true,
      isSpicy: item.isSpicy === true,
      tag: item.tag || '',
      portion: item.portion || 'Standard',
      createdAt: new Date().toISOString(),
    };
    const items = await this.getMenu();
    items.unshift(newItem);
    localStorage.setItem(LOCAL_STORAGE_KEYS.MENU, JSON.stringify(items));
    return newItem;
  },

  async updateMenuItem(id: string, updates: Partial<MenuItem>): Promise<MenuItem> {
    try {
      const res = await fetch(`/api/menu/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    const items = await this.getMenu();
    const idx = items.findIndex((m) => m.id === id);
    if (idx !== -1) {
      items[idx] = { ...items[idx], ...updates };
      localStorage.setItem(LOCAL_STORAGE_KEYS.MENU, JSON.stringify(items));
      return items[idx];
    }
    throw new Error('Menu item not found');
  },

  async deleteMenuItem(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/menu/${id}`, { method: 'DELETE' });
      if (res.ok) return true;
    } catch {
      // fallback
    }
    const items = await this.getMenu();
    const filtered = (Array.isArray(items) ? items : []).filter((m) => m && m.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEYS.MENU, JSON.stringify(filtered));
    return true;
  },

  // Orders
  async getOrders(): Promise<Order[]> {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          localStorage.setItem(LOCAL_STORAGE_KEYS.ORDERS, JSON.stringify(data));
          return data;
        }
      }
    } catch {
      // fallback
    }
    try {
      const local = localStorage.getItem(LOCAL_STORAGE_KEYS.ORDERS);
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // fallback
    }
    return [];
  },

  async verifyOwnerPassword(password: string): Promise<{ success: boolean; token?: string; error?: string }> {
    try {
      const res = await fetch('/api/auth/verify-owner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Authentication failed' };
      }
      return { success: true, token: data.token };
    } catch (err: any) {
      return { success: false, error: err.message || 'Connection error' };
    }
  },

  async changeOwnerPassword(
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to change password' };
      }
      return { success: true, message: data.message };
    } catch (err: any) {
      return { success: false, error: err.message || 'Connection error' };
    }
  },

  async placeOrder(orderData: Partial<Order>): Promise<Order> {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `Server responded with status ${res.status}`);
    }

    const createdOrder: Order = await res.json();
    return createdOrder;
  },

  async updateOrderStatus(id: string, status: Order['status']): Promise<Order> {
    try {
      const res = await fetch(`/api/orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }
    const orders = await this.getOrders();
    const o = orders.find((ord) => ord.id === id);
    if (o) {
      o.status = status;
      localStorage.setItem(LOCAL_STORAGE_KEYS.ORDERS, JSON.stringify(orders));
      return o;
    }
    throw new Error('Order not found');
  },

  async resetData(): Promise<void> {
    try {
      await fetch('/api/reset-demo-data', { method: 'POST' });
    } catch {
      // fallback
    }
    localStorage.setItem(LOCAL_STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_STORE_SETTINGS));
    localStorage.setItem(LOCAL_STORAGE_KEYS.DEALS, JSON.stringify(INITIAL_DEAL_BOXES));
    localStorage.setItem(LOCAL_STORAGE_KEYS.MENU, JSON.stringify(INITIAL_MENU_ITEMS));
    localStorage.setItem(LOCAL_STORAGE_KEYS.ORDERS, JSON.stringify([]));
  },
};

// Named exports for convenient direct imports
export const apiGetSettings = () => api.getSettings();
export const apiUpdateSettings = (s: Partial<StoreSettings>) => api.updateSettings(s);
export const apiGetDeals = (includeAll = true) => api.getDeals(includeAll);
export const apiCreateDeal = (deal: Partial<DealBox>) => api.createDeal(deal);
export const apiUpdateDeal = (id: string, updates: Partial<DealBox>) => api.updateDeal(id, updates);
export const apiDeleteDeal = (id: string) => api.deleteDeal(id);
export const apiDuplicateDeal = (id: string) => api.duplicateDeal(id);
export const apiReorderDeals = (orderedIds: string[]) => api.reorderDeals(orderedIds);
export const apiGetMenuItems = () => api.getMenu();
export const apiCreateMenuItem = (item: Partial<MenuItem>) => api.createMenuItem(item);
export const apiUpdateMenuItem = (id: string, updates: Partial<MenuItem>) => api.updateMenuItem(id, updates);
export const apiDeleteMenuItem = (id: string) => api.deleteMenuItem(id);
export const apiGetOrders = () => api.getOrders();
export const apiPlaceOrder = (orderData: Partial<Order>) => api.placeOrder(orderData);
export const apiUpdateOrderStatus = (id: string, status: Order['status']) => api.updateOrderStatus(id, status);
export const apiGetCategories = () => api.getCategories();
export const apiCreateCategory = (cat: Partial<CategoryItem>) => api.createCategory(cat);
export const apiUpdateCategory = (id: string, updates: Partial<CategoryItem>) => api.updateCategory(id, updates);
export const apiDeleteCategory = (id: string) => api.deleteCategory(id);
export const apiResetToDefault = () => api.resetData();
export const apiVerifyOwnerPassword = (password: string) => api.verifyOwnerPassword(password);
export const apiChangeOwnerPassword = (cur: string, nw: string, conf: string) => api.changeOwnerPassword(cur, nw, conf);

