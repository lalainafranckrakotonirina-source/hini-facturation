export type DocumentType = 'PROFORMA' | 'FACTURE';

export type DocumentStatus = 'BROUILLON' | 'ENVOYEE' | 'VALIDEE' | 'PAYEE' | 'ANNULEE';

export type UserRole = 'admin' | 'commercial';

export type ThemeMode =
  | 'classic-pro'
  | 'ivory-warm'
  | 'soft-navy'
  | 'default'
  | 'light'
  | 'dark';

export interface AuthCredentials {
  commercialPasscode: string;
  adminPasscode: string;
}

export interface AuthUser {
  role: UserRole;
  name: string;
  displayName?: string;
  title: string;
  email?: string;
  lastLogin?: string;
}

export interface Client {
  id: string;
  name: string; // Nom ou Société
  contactPerson?: string;
  address: string; // Adresse / Ville
  phone: string;
  email?: string;
  nif?: string;
  stat?: string;
  notes?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  ref: string; // ex: BAN-440, KAK-ROLL, TSH-SERI
  name: string; // ex: Banderole Bâche
  designation: string; // ex: Bâche frontlit 440g/m², impression quadri HD avec œillets tous les 50cm
  unitPrice: number; // Prix Unitaire en Ar
  category?: string; // ex: Impression grand format, PLV, Textile, Événementiel
  createdAt: string;
}

export interface InvoiceItem {
  id: string;
  productId?: string;
  ref: string;
  product: string;
  designation: string;
  quantity: number;
  unitPrice: number;
  amount: number; // calculated: quantity * unitPrice
}

export interface Invoice {
  id: string;
  type: DocumentType; // 'PROFORMA' | 'FACTURE'
  number: string; // ex: "020926/FP/20264901" ou "020926/FA/20264901"
  date: string; // YYYY-MM-DD
  location: string; // "Antananarivo"
  clientId: string;
  clientName: string;
  clientAddress?: string;
  clientPhone?: string;
  clientEmail?: string;
  clientNif?: string;
  clientStat?: string;
  items: InvoiceItem[];
  totalAmount: number;
  amountInWords?: string;
  status: DocumentStatus;
  notes?: string;
  paymentTerms: string;
  orderConfirmationTerms: string;
  bankDetails: string;
  chequeDetails: string;
  showStamp: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CompanySettings {
  name: string;
  slogan: string;
  location: string;
  gsm: string;
  email: string;
  nif: string;
  cis: string;
  stat: string;
  chequeOrder: string;
  bankRib: string;
  paymentTerms: string;
  prestataireSignatory: string;
  prestataireTitle: string;
  logoText: string;
  logoUrl?: string; // URL ou image base64 du logo personnalisé
}
