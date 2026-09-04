import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Client,
  Product,
  Invoice,
  CompanySettings,
  DocumentType,
  UserRole,
  ThemeMode,
  AuthCredentials,
  AuthUser,
} from '../types';
import { defaultClients, defaultProducts, defaultInvoices, defaultCompanySettings } from '../data/seedData';
import { generateInvoiceNumber } from '../utils/formatters';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface AppContextType {
  clients: Client[];
  products: Product[];
  invoices: Invoice[];
  settings: CompanySettings;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  activeTab: 'invoices' | 'new-invoice' | 'clients' | 'products' | 'settings' | 'guide';
  setActiveTab: (tab: 'invoices' | 'new-invoice' | 'clients' | 'products' | 'settings' | 'guide') => void;
  selectedInvoice: Invoice | null;
  setSelectedInvoice: (invoice: Invoice | null) => void;
  isEditingInvoice: boolean;
  setIsEditingInvoice: (editing: boolean) => void;
  previewInvoice: Invoice | null;
  setPreviewInvoice: (invoice: Invoice | null) => void;

  // Theme Management
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;

  // Authentication & Security
  isAuthenticated: boolean;
  currentUser: AuthUser | null;
  authCredentials: AuthCredentials;
  login: (passcode: string, targetRole?: UserRole) => { success: boolean; error?: string };
  logout: () => void;
  updateAuthCredentials: (credentials: Partial<AuthCredentials>) => void;
  
  // Client operations
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => Client;
  updateClient: (id: string, client: Partial<Client>) => void;
  deleteClient: (id: string) => boolean;

  // Product operations
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Product;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => boolean;

  // Invoice operations
  createInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) => Invoice;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  duplicateInvoice: (id: string) => Invoice | null;
  convertProformaToFacture: (id: string) => Invoice | null;

  // Settings & Storage
  updateSettings: (newSettings: Partial<CompanySettings>) => void;
  resetAllData: () => void;
  exportBackupJson: () => void;
  importBackupJson: (jsonData: string) => boolean;

  // Notifications
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CLIENTS: 'hini_clients_v1',
  PRODUCTS: 'hini_products_v1',
  INVOICES: 'hini_invoices_v1',
  SETTINGS: 'hini_settings_v1',
  THEME: 'hini_theme_mode_v1',
  AUTH_SESSION: 'hini_auth_session_v1',
  CREDENTIALS: 'hini_auth_credentials_v1',
};

const DEFAULT_CREDENTIALS: AuthCredentials = {
  commercialPasscode: 'COMMERCIAL2026',
  adminPasscode: 'ADMIN2026',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CLIENTS);
      return saved ? JSON.parse(saved) : defaultClients;
    } catch {
      return defaultClients;
    }
  });

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : defaultProducts;
    } catch {
      return defaultProducts;
    }
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INVOICES);
      return saved ? JSON.parse(saved) : defaultInvoices;
    } catch {
      return defaultInvoices;
    }
  });

  const [settings, setSettings] = useState<CompanySettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? JSON.parse(saved) : defaultCompanySettings;
    } catch {
      return defaultCompanySettings;
    }
  });

  // --- Theme Management (Eye-Care & Charte Graphique HINI) ---
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME) as ThemeMode | null;
      if (
        saved === 'classic-pro' ||
        saved === 'ivory-warm' ||
        saved === 'soft-navy' ||
        saved === 'light' ||
        saved === 'dark' ||
        saved === 'default'
      ) {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'classic-pro';
  });

  const applyThemeToDom = (mode: ThemeMode) => {
    if (typeof document === 'undefined') return;
    document.documentElement.setAttribute('data-theme', mode);
    if (mode === 'soft-navy' || mode === 'dark') {
      document.documentElement.classList.remove('light', 'theme-ivory');
      document.documentElement.classList.add('dark');
    } else if (mode === 'ivory-warm') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light', 'theme-ivory');
    } else {
      // classic-pro, light, default
      document.documentElement.classList.remove('dark', 'theme-ivory');
      document.documentElement.classList.add('light');
    }
  };

  const setTheme = (mode: ThemeMode) => {
    setThemeState(mode);
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, mode);
    } catch {
      // ignore
    }
    applyThemeToDom(mode);

    let message = 'Thème Clair Classique Pro activé (Gris perle doux & bleu marine)';
    if (mode === 'ivory-warm') {
      message = 'Thème Ivoire Élégant activé (Fond velin anti-lumière bleue & accents dorés)';
    } else if (mode === 'soft-navy' || mode === 'dark') {
      message = 'Thème Bleu Nuit Doux activé (Marine crépusculaire anti-fatigue oculaire)';
    }
    showToast(message, 'info');
  };

  useEffect(() => {
    applyThemeToDom(theme);
  }, [theme]);

  // --- Authentication & Passcodes ---
  const [authCredentials, setAuthCredentials] = useState<AuthCredentials>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CREDENTIALS);
      if (saved) {
        return { ...DEFAULT_CREDENTIALS, ...JSON.parse(saved) };
      }
    } catch {
      // ignore
    }
    return DEFAULT_CREDENTIALS;
  });

  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AUTH_SESSION);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return null;
  });

  const isAuthenticated = currentUser !== null;

  const [userRole, setUserRoleState] = useState<UserRole>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const mode = params.get('mode') || params.get('role');
      if (mode === 'commercial') return 'commercial';
      if (mode === 'admin') return 'admin';
      const saved = localStorage.getItem('hini_user_role_v1');
      if (saved === 'commercial' || saved === 'admin') return saved as UserRole;
    } catch {
      // ignore
    }
    return 'admin';
  });

  const login = (passcode: string, targetRole?: UserRole): { success: boolean; error?: string } => {
    const cleanCode = passcode.trim();
    if (!cleanCode) {
      return { success: false, error: "Veuillez saisir un code d'accès." };
    }

    const isCommercial = cleanCode.toUpperCase() === authCredentials.commercialPasscode.toUpperCase();
    const isAdmin = cleanCode.toUpperCase() === authCredentials.adminPasscode.toUpperCase();

    let matchedRole: UserRole | null = null;
    if (targetRole) {
      if (targetRole === 'commercial' && isCommercial) matchedRole = 'commercial';
      else if (targetRole === 'admin' && isAdmin) matchedRole = 'admin';
      else {
        return {
          success: false,
          error: `Code d'accès incorrect pour le profil ${targetRole === 'admin' ? 'Administrateur' : 'Commercial'}.`,
        };
      }
    } else {
      if (isAdmin) matchedRole = 'admin';
      else if (isCommercial) matchedRole = 'commercial';
      else {
        return {
          success: false,
          error: "Code d'accès incorrect. Vérifiez votre saisie.",
        };
      }
    }

    const userObj: AuthUser = {
      role: matchedRole,
      name: matchedRole === 'admin' ? (settings.prestataireSignatory || 'Direction Générale') : 'Équipe Commerciale',
      title: matchedRole === 'admin' ? (settings.prestataireTitle || 'Direction Générale & Finance') : 'Commercial Ventes & Terrain',
      lastLogin: new Date().toISOString(),
    };

    setCurrentUser(userObj);
    setUserRoleState(matchedRole);
    try {
      localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify(userObj));
      localStorage.setItem('hini_user_role_v1', matchedRole);
      const url = new URL(window.location.href);
      url.searchParams.set('mode', matchedRole);
      window.history.replaceState({}, '', url.toString());
    } catch {
      // ignore
    }

    showToast(
      matchedRole === 'admin'
        ? 'Bienvenue ! Session Administrateur déverrouillée (accès complet).'
        : 'Bienvenue ! Session Commerciale ouverte (saisie & facturation).',
      'success'
    );
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
    } catch {
      // ignore
    }
    showToast('Vous avez été déconnecté avec succès.', 'info');
  };

  const updateAuthCredentials = (newCreds: Partial<AuthCredentials>) => {
    setAuthCredentials((prev) => {
      const updated = { ...prev, ...newCreds };
      try {
        localStorage.setItem(STORAGE_KEYS.CREDENTIALS, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
    showToast("Codes d'accès mis à jour avec succès !", 'success');
  };

  const [activeTab, setActiveTab] = useState<'invoices' | 'new-invoice' | 'clients' | 'products' | 'settings' | 'guide'>('invoices');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isEditingInvoice, setIsEditingInvoice] = useState<boolean>(false);
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const setUserRole = (role: UserRole) => {
    setUserRoleState(role);
    try {
      localStorage.setItem('hini_user_role_v1', role);
      const url = new URL(window.location.href);
      url.searchParams.set('mode', role);
      window.history.replaceState({}, '', url.toString());
    } catch {
      // ignore
    }
    showToast(
      role === 'commercial'
        ? 'Mode Commercial activé (optimisé mobile & saisie rapide)'
        : 'Mode Administrateur activé (contrôle global et paramètres)',
      'info'
    );
  };

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
    } catch (e) {
      console.error('Failed to save clients to localStorage', e);
    }
  }, [clients]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error('Failed to save products to localStorage', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
    } catch (e) {
      console.error('Failed to save invoices to localStorage', e);
    }
  }, [invoices]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings to localStorage', e);
    }
  }, [settings]);

  // Toast notification helper
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Client actions
  const addClient = (clientData: Omit<Client, 'id' | 'createdAt'>): Client => {
    const newClient: Client = {
      ...clientData,
      id: 'cli-' + Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setClients((prev) => [newClient, ...prev]);
    showToast(`Client "${newClient.name}" créé avec succès.`);
    return newClient;
  };

  const updateClient = (id: string, updatedData: Partial<Client>) => {
    setClients((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updatedData } : c))
    );
    showToast('Client mis à jour.');
  };

  const deleteClient = (id: string): boolean => {
    // Check if client has associated invoices
    const hasInvoices = invoices.some((inv) => inv.clientId === id);
    if (hasInvoices) {
      showToast('Impossible de supprimer un client ayant des factures associées.', 'error');
      return false;
    }
    setClients((prev) => prev.filter((c) => c.id !== id));
    showToast('Client supprimé.');
    return true;
  };

  // Product actions
  const addProduct = (productData: Omit<Product, 'id' | 'createdAt'>): Product => {
    const newProduct: Product = {
      ...productData,
      id: 'prod-' + Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Produit/Réf "${newProduct.ref}" ajouté au catalogue.`);
    return newProduct;
  };

  const updateProduct = (id: string, updatedData: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedData } : p))
    );
    showToast('Produit mis à jour.');
  };

  const deleteProduct = (id: string): boolean => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Produit retiré du catalogue.');
    return true;
  };

  // Invoice actions
  const createInvoice = (data: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>): Invoice => {
    const newInvoice: Invoice = {
      ...data,
      id: 'inv-' + Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setInvoices((prev) => [newInvoice, ...prev]);
    showToast(`${newInvoice.type === 'PROFORMA' ? 'Facture Proforma' : 'Facture'} ${newInvoice.number} créée !`);
    return newInvoice;
  };

  const updateInvoice = (id: string, data: Partial<Invoice>) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === id
          ? {
              ...inv,
              ...data,
              updatedAt: new Date().toISOString(),
            }
          : inv
      )
    );
    showToast('Document commercial mis à jour.');
  };

  const deleteInvoice = (id: string) => {
    setInvoices((prev) => prev.filter((inv) => inv.id !== id));
    if (selectedInvoice?.id === id) {
      setSelectedInvoice(null);
    }
    if (previewInvoice?.id === id) {
      setPreviewInvoice(null);
    }
    showToast('Document supprimé.');
  };

  const duplicateInvoice = (id: string): Invoice | null => {
    const source = invoices.find((inv) => inv.id === id);
    if (!source) return null;

    const newNumber = generateInvoiceNumber(source.type);
    const today = new Date().toISOString().split('T')[0];

    const duplicated: Invoice = {
      ...source,
      id: 'inv-' + Date.now().toString(),
      number: newNumber,
      date: today,
      status: 'BROUILLON',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setInvoices((prev) => [duplicated, ...prev]);
    showToast(`Document dupliqué sous le numéro ${duplicated.number}`);
    return duplicated;
  };

  const convertProformaToFacture = (id: string): Invoice | null => {
    const proforma = invoices.find((inv) => inv.id === id);
    if (!proforma) return null;

    const newFactureNumber = generateInvoiceNumber('FACTURE');
    const today = new Date().toISOString().split('T')[0];

    const converted: Invoice = {
      ...proforma,
      id: 'inv-' + Date.now().toString(),
      type: 'FACTURE',
      number: newFactureNumber,
      date: today,
      status: 'VALIDEE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Also mark original proforma as transformed
    updateInvoice(id, { status: 'VALIDEE' });

    setInvoices((prev) => [converted, ...prev]);
    showToast(`Proforma convertie en Facture officielle N° ${converted.number}`);
    return converted;
  };

  const updateSettings = (newSettings: Partial<CompanySettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('Paramètres de l\'entreprise HINI MADAGASCAR enregistrés.');
  };

  const resetAllData = () => {
    setClients(defaultClients);
    setProducts(defaultProducts);
    setInvoices(defaultInvoices);
    setSettings(defaultCompanySettings);
    localStorage.removeItem(STORAGE_KEYS.CLIENTS);
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.INVOICES);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    showToast('Données réinitialisées avec les valeurs d\'origine de HINI MADAGASCAR.', 'info');
  };

  const exportBackupJson = () => {
    const data = {
      company: settings,
      clients,
      products,
      invoices,
      exportDate: new Date().toISOString(),
      version: '1.0',
    };
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `HINI_MADAGASCAR_Sauvegarde_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Sauvegarde JSON téléchargée avec succès.');
  };

  const importBackupJson = (jsonData: string): boolean => {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed.clients && Array.isArray(parsed.clients)) {
        setClients(parsed.clients);
      }
      if (parsed.products && Array.isArray(parsed.products)) {
        setProducts(parsed.products);
      }
      if (parsed.invoices && Array.isArray(parsed.invoices)) {
        setInvoices(parsed.invoices);
      }
      if (parsed.company) {
        setSettings(parsed.company);
      }
      showToast('Sauvegarde restaurée avec succès !');
      return true;
    } catch (err) {
      console.error(err);
      showToast('Fichier de sauvegarde invalide ou corrompu.', 'error');
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        clients,
        products,
        invoices,
        settings,
        userRole,
        setUserRole,
        activeTab,
        setActiveTab,
        selectedInvoice,
        setSelectedInvoice,
        isEditingInvoice,
        setIsEditingInvoice,
        previewInvoice,
        setPreviewInvoice,
        theme,
        setTheme,
        isAuthenticated,
        currentUser,
        authCredentials,
        login,
        logout,
        updateAuthCredentials,
        addClient,
        updateClient,
        deleteClient,
        addProduct,
        updateProduct,
        deleteProduct,
        createInvoice,
        updateInvoice,
        deleteInvoice,
        duplicateInvoice,
        convertProformaToFacture,
        updateSettings,
        resetAllData,
        exportBackupJson,
        importBackupJson,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
