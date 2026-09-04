import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Invoice, InvoiceItem, DocumentType, DocumentStatus, Client } from '../types';
import { generateInvoiceNumber, formatAriary, printInvoiceDocument, formatInvoiceFileName } from '../utils/formatters';
import { numberToFrenchWords } from '../utils/numberToWords';
import { OfficialDocument } from './OfficialDocument';
import {
  Plus,
  Trash2,
  Save,
  Printer,
  ArrowLeft,
  UserPlus,
  Eye,
  CheckCircle,
  FileText,
  RotateCcw
} from 'lucide-react';

interface InvoiceEditorProps {
  initialInvoice?: Invoice | null;
  onClose: () => void;
}

export const InvoiceEditor: React.FC<InvoiceEditorProps> = ({
  initialInvoice,
  onClose,
}) => {
  const {
    clients,
    products,
    settings,
    createInvoice,
    updateInvoice,
    addClient,
    showToast,
  } = useApp();

  const isEditing = Boolean(initialInvoice);

  // Form State
  const [docType, setDocType] = useState<DocumentType>(initialInvoice?.type || 'PROFORMA');
  const [docNumber, setDocNumber] = useState<string>(
    initialInvoice?.number || generateInvoiceNumber('PROFORMA')
  );
  const [date, setDate] = useState<string>(
    initialInvoice?.date || new Date().toISOString().split('T')[0]
  );
  const [location, setLocation] = useState<string>(
    initialInvoice?.location || settings.location || 'Antananarivo'
  );
  const [selectedClientId, setSelectedClientId] = useState<string>(
    initialInvoice?.clientId || (clients.length > 0 ? clients[0].id : '')
  );
  const [status, setStatus] = useState<DocumentStatus>(
    initialInvoice?.status || 'VALIDEE'
  );
  const [showStamp, setShowStamp] = useState<boolean>(
    initialInvoice ? initialInvoice.showStamp : true
  );
  const [notes, setNotes] = useState<string>(initialInvoice?.notes || '');
  const [paymentTerms, setPaymentTerms] = useState<string>(
    initialInvoice?.paymentTerms || settings.paymentTerms
  );
  const [bankDetails, setBankDetails] = useState<string>(
    initialInvoice?.bankDetails || settings.bankRib
  );
  const [chequeDetails, setChequeDetails] = useState<string>(
    initialInvoice?.chequeDetails || settings.chequeOrder
  );

  // Items State
  const [items, setItems] = useState<InvoiceItem[]>(
    initialInvoice?.items || [
      {
        id: 'item-' + Date.now(),
        ref: products[0]?.ref || 'REF-01',
        product: products[0]?.name || '',
        designation: products[0]?.designation || '',
        quantity: 1,
        unitPrice: products[0]?.unitPrice || 0,
        amount: products[0]?.unitPrice || 0,
      },
    ]
  );

  // Quick New Client Modal
  const [showQuickClientModal, setShowQuickClientModal] = useState<boolean>(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newClientAddress, setNewClientAddress] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');

  // Live preview mode on mobile/desktop
  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');

  // Selected client object
  const currentClient = clients.find((c) => c.id === selectedClientId);

  // When type changes and not editing an existing document, update number prefix
  const handleTypeChange = (newType: DocumentType) => {
    setDocType(newType);
    if (!isEditing) {
      setDocNumber(generateInvoiceNumber(newType));
    }
  };

  const regenerateNumber = () => {
    setDocNumber(generateInvoiceNumber(docType));
  };

  // Add Item Line
  const handleAddItem = () => {
    const defaultProd = products[0];
    const newItem: InvoiceItem = {
      id: 'item-' + Date.now() + Math.random().toString().slice(2, 5),
      productId: defaultProd?.id,
      ref: defaultProd?.ref || 'REF-01',
      product: defaultProd?.name || 'Prestation Publicitaire',
      designation: defaultProd?.designation || 'Désignation technique...',
      quantity: 1,
      unitPrice: defaultProd?.unitPrice || 0,
      amount: defaultProd?.unitPrice || 0,
    };
    setItems((prev) => [...prev, newItem]);
  };

  // Product Selection handler for a row
  const handleSelectProduct = (itemId: string, productId: string) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;

    setItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            productId: prod.id,
            ref: prod.ref,
            product: prod.name,
            designation: prod.designation,
            unitPrice: prod.unitPrice,
            amount: item.quantity * prod.unitPrice,
          };
        }
        return item;
      })
    );
  };

  // Item Field Change
  const handleItemChange = (
    itemId: string,
    field: keyof InvoiceItem,
    value: any
  ) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const updated = { ...item, [field]: value };
          if (field === 'quantity' || field === 'unitPrice') {
            const qty = field === 'quantity' ? Number(value) || 0 : item.quantity;
            const pu = field === 'unitPrice' ? Number(value) || 0 : item.unitPrice;
            updated.amount = Math.max(0, qty * pu);
          }
          return updated;
        }
        return item;
      })
    );
  };

  // Remove Item Line
  const handleRemoveItem = (itemId: string) => {
    if (items.length <= 1) {
      showToast('Une facture doit contenir au moins une ligne d\'article.', 'error');
      return;
    }
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  // Calculate Total
  const totalAmount = items.reduce((acc, item) => acc + (Number(item.amount) || 0), 0);
  const amountInWords = numberToFrenchWords(totalAmount);

  // Quick Client Save
  const handleCreateQuickClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim()) {
      showToast('Le nom du client est requis.', 'error');
      return;
    }
    const created = addClient({
      name: newClientName.trim(),
      phone: newClientPhone.trim(),
      address: newClientAddress.trim() || 'Antananarivo, Madagascar',
      email: newClientEmail.trim(),
    });
    setSelectedClientId(created.id);
    setShowQuickClientModal(false);
    setNewClientName('');
    setNewClientPhone('');
    setNewClientAddress('');
    setNewClientEmail('');
  };

  // Build the current invoice object for live preview or saving
  const currentInvoiceDraft: Invoice = {
    id: initialInvoice?.id || 'temp-id',
    type: docType,
    number: docNumber,
    date,
    location,
    clientId: selectedClientId,
    clientName: currentClient?.name || 'Client',
    clientAddress: currentClient?.address || '',
    clientPhone: currentClient?.phone || '',
    clientEmail: currentClient?.email || '',
    clientNif: currentClient?.nif,
    clientStat: currentClient?.stat,
    items,
    totalAmount,
    amountInWords,
    status,
    notes,
    paymentTerms,
    orderConfirmationTerms: paymentTerms,
    bankDetails,
    chequeDetails,
    showStamp,
    createdAt: initialInvoice?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const handleSave = (andPrint: boolean = false) => {
    if (!docNumber.trim()) {
      showToast('Le numéro de facture est obligatoire.', 'error');
      return;
    }
    if (!selectedClientId) {
      showToast('Veuillez sélectionner un client.', 'error');
      return;
    }
    if (items.length === 0) {
      showToast('Veuillez ajouter au moins un article.', 'error');
      return;
    }

    if (isEditing && initialInvoice) {
      updateInvoice(initialInvoice.id, currentInvoiceDraft);
    } else {
      createInvoice(currentInvoiceDraft);
    }

    if (andPrint) {
      setTimeout(() => {
        printInvoiceDocument(currentInvoiceDraft.number);
      }, 300);
    } else {
      onClose();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Toolbar */}
      <div className="no-print bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Retour à la liste"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" />
              {isEditing ? `Modifier : ${docNumber}` : 'Créer un nouveau document'}
            </h1>
            <p className="text-xs text-slate-400">
              {docType === 'PROFORMA' ? 'Facture Proforma' : 'Facture Définitive'} pour HINI MADAGASCAR
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Mobile Tab Toggle */}
          <div className="lg:hidden flex bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setActiveTab('form')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeTab === 'form'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-400'
              }`}
            >
              Éditeur
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1 ${
                activeTab === 'preview'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-400'
              }`}
            >
              <Eye className="w-3.5 h-3.5" /> Aperçu ({formatAriary(totalAmount)})
            </button>
          </div>

          <button
            onClick={() => handleSave(true)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-2 border border-slate-700 transition-colors shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Imprimer / PDF
          </button>

          <button
            onClick={() => handleSave(false)}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-2 transition-all shadow-sm cursor-pointer"
          >
            <Save className="w-4 h-4" />
            {isEditing ? 'Enregistrer les modifications' : 'Créer le document'}
          </button>
        </div>
      </div>

      {/* Main Grid: Form on Left, Live Preview on Right (Desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: FORM */}
        <div
          className={`lg:col-span-6 space-y-6 ${
            activeTab === 'preview' ? 'hidden lg:block' : 'block'
          } no-print`}
        >
          {/* 1. Type & Document Info Card */}
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200 pb-2 border-b border-slate-800 flex items-center justify-between">
              <span>1. Type & Références</span>
              <span className="text-xs font-normal text-slate-400 lowercase">
                convention officielle
              </span>
            </h2>

            {/* Document Type Selector */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleTypeChange('PROFORMA')}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                  docType === 'PROFORMA'
                    ? 'border-blue-500 bg-blue-950/40 text-blue-300 font-bold ring-2 ring-blue-500/20'
                    : 'border-slate-800 bg-slate-950 hover:bg-slate-800/60 text-slate-300'
                }`}
              >
                <div className="text-xs font-bold uppercase">Facture Proforma</div>
                <div className="text-[11px] text-slate-400 font-normal">
                  Devis & estimation de budget
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleTypeChange('FACTURE')}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                  docType === 'FACTURE'
                    ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300 font-bold ring-2 ring-emerald-500/20'
                    : 'border-slate-800 bg-slate-950 hover:bg-slate-800/60 text-slate-300'
                }`}
              >
                <div className="text-xs font-bold uppercase">Facture Définitive</div>
                <div className="text-[11px] text-slate-400 font-normal">
                  Titre exécutoire de paiement
                </div>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Numéro de {docType === 'PROFORMA' ? 'Proforma' : 'Facture'} *
                </label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={docNumber}
                    onChange={(e) => setDocNumber(e.target.value)}
                    className="w-full text-xs font-mono font-semibold px-3 py-2 bg-slate-950 border border-slate-700 text-slate-100 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                    placeholder="ex: 020926/FP/20264901"
                    required
                  />
                  <button
                    type="button"
                    onClick={regenerateNumber}
                    title="Générer un nouveau numéro selon la date du jour"
                    className="p-2 border border-slate-700 bg-slate-950 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Date du document *
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-950 border border-slate-700 text-slate-100 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Lieu d'émission
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-950 border border-slate-700 text-slate-100 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                  placeholder="Antananarivo"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Statut de suivi
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as DocumentStatus)}
                  className="w-full text-xs px-3 py-2 bg-slate-950 border border-slate-700 text-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                >
                  <option value="BROUILLON">Brouillon</option>
                  <option value="ENVOYEE">Envoyée au client</option>
                  <option value="VALIDEE">Validée / Confirmée</option>
                  <option value="PAYEE">Payée / Acquittée</option>
                  <option value="ANNULEE">Annulée</option>
                </select>
              </div>
            </div>
          </div>

          {/* 2. Client Selection Card */}
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                2. Client (Mention « Doit: »)
              </h2>
              <button
                type="button"
                onClick={() => setShowQuickClientModal(true)}
                className="text-xs text-blue-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" /> + Nouveau client
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Sélectionner une Société ou un Client existant *
              </label>
              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="w-full text-xs font-medium px-3 py-2 bg-slate-950 border border-slate-700 text-slate-100 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
                required
              >
                {clients.length === 0 ? (
                  <option value="">Aucun client - Créez-en un</option>
                ) : (
                  clients.map((cli) => (
                    <option key={cli.id} value={cli.id}>
                      {cli.name} {cli.phone ? `(${cli.phone})` : ''}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Client preview box */}
            {currentClient && (
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs space-y-1">
                <p className="font-bold text-slate-100">{currentClient.name}</p>
                <p className="text-slate-400">{currentClient.address}</p>
                <div className="flex flex-wrap gap-x-4 text-[11px] text-slate-400 pt-1">
                  {currentClient.phone && <span>Tél: {currentClient.phone}</span>}
                  {currentClient.email && <span>Email: {currentClient.email}</span>}
                  {currentClient.nif && <span>NIF: {currentClient.nif}</span>}
                </div>
              </div>
            )}
          </div>

          {/* 3. Items Table / Articles Card */}
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                  3. Tableau des Articles & Prestations
                </h2>
                <p className="text-xs text-slate-400">
                  Réf, Produit, Désignation, Quantité, P.U et Montant
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddItem}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Ajouter une ligne
              </button>
            </div>

            {/* Items list rows */}
            <div className="space-y-4">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg space-y-3 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700/60">
                      Ligne #{index + 1}
                    </span>

                    {/* Pre-fill from catalog dropdown */}
                    {products.length > 0 && (
                      <div className="flex items-center gap-1 text-xs">
                        <span className="text-slate-400 text-[11px]">Remplir depuis catalogue:</span>
                        <select
                          className="text-xs py-1 px-2 bg-slate-900 border border-slate-700 text-slate-200 rounded focus:outline-none"
                          value={item.productId || ''}
                          onChange={(e) => handleSelectProduct(item.id, e.target.value)}
                        >
                          <option value="">Sélectionner un produit...</option>
                          {products.map((p) => (
                            <option key={p.id} value={p.id}>
                              [{p.ref}] {p.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-rose-400 hover:text-rose-300 p-1 cursor-pointer"
                        title="Supprimer la ligne"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                    {/* Réf */}
                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-semibold text-slate-400 mb-0.5">
                        Réf
                      </label>
                      <input
                        type="text"
                        value={item.ref}
                        onChange={(e) => handleItemChange(item.id, 'ref', e.target.value)}
                        className="w-full text-xs font-mono px-2 py-1.5 bg-slate-900 border border-slate-700 text-slate-100 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        placeholder="BAN-440"
                      />
                    </div>

                    {/* Produit */}
                    <div className="sm:col-span-9">
                      <label className="block text-[11px] font-semibold text-slate-400 mb-0.5">
                        Produit *
                      </label>
                      <input
                        type="text"
                        value={item.product}
                        onChange={(e) => handleItemChange(item.id, 'product', e.target.value)}
                        className="w-full text-xs font-semibold px-2 py-1.5 bg-slate-900 border border-slate-700 text-slate-100 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        placeholder="Nom du produit ou support..."
                        required
                      />
                    </div>

                    {/* Désignation technique */}
                    <div className="sm:col-span-12">
                      <label className="block text-[11px] font-semibold text-slate-400 mb-0.5">
                        Désignation technique détaillée
                      </label>
                      <textarea
                        value={item.designation}
                        onChange={(e) => handleItemChange(item.id, 'designation', e.target.value)}
                        rows={2}
                        className="w-full text-xs px-2 py-1.5 bg-slate-900 border border-slate-700 text-slate-100 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        placeholder="Détails techniques, dimensions, finitions, œillets, grammage..."
                      />
                    </div>

                    {/* Quantité */}
                    <div className="sm:col-span-4">
                      <label className="block text-[11px] font-semibold text-slate-400 mb-0.5">
                        Quantité *
                      </label>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(item.id, 'quantity', parseInt(e.target.value) || 0)}
                        className="w-full text-xs font-semibold text-center px-2 py-1.5 bg-slate-900 border border-slate-700 text-slate-100 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        required
                      />
                    </div>

                    {/* Prix Unitaire Ar */}
                    <div className="sm:col-span-4">
                      <label className="block text-[11px] font-semibold text-slate-400 mb-0.5">
                        P.U (Ar) *
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="500"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                        className="w-full text-xs font-mono text-right px-2 py-1.5 bg-slate-900 border border-slate-700 text-slate-100 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        required
                      />
                    </div>

                    {/* Montant Ar */}
                    <div className="sm:col-span-4">
                      <label className="block text-[11px] font-semibold text-slate-400 mb-0.5">
                        Montant (Ar)
                      </label>
                      <div className="w-full text-xs font-mono font-bold text-right px-2 py-1.5 bg-slate-950 border border-slate-800 rounded text-emerald-400">
                        {formatAriary(item.amount)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Summary Footer */}
            <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-end sm:items-center justify-between gap-3 bg-slate-950 p-3 rounded-lg border border-slate-800/80">
              <div className="text-xs text-slate-400 max-w-sm">
                <span className="font-semibold text-slate-300">Montant en lettres : </span>
                <p className="italic text-[11px] text-slate-300 mt-0.5 font-medium">
                  {amountInWords}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs uppercase tracking-wider text-slate-400 font-bold block">
                  Montant TOTAL (Ar)
                </span>
                <span className="text-xl font-black font-mono text-emerald-400">
                  {formatAriary(totalAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* 4. Terms, Cheque, Bank & Stamp Card */}
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200 pb-2 border-b border-slate-800">
              4. Modalités de Paiement & Signatures
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Conditions de règlement
                </label>
                <input
                  type="text"
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-950 border border-slate-700 text-slate-100 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  placeholder="Paiement 100% à la confirmation de la commande"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Ordre du chèque
                  </label>
                  <input
                    type="text"
                    value={chequeDetails}
                    onChange={(e) => setChequeDetails(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-950 border border-slate-700 text-slate-100 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    placeholder="Chèque: à l'ordre de..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    RIB Bancaire (Virement)
                  </label>
                  <input
                    type="text"
                    value={bankDetails}
                    onChange={(e) => setBankDetails(e.target.value)}
                    className="w-full text-xs font-mono px-3 py-2 bg-slate-950 border border-slate-700 text-slate-100 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    placeholder="RIB BFVSG / 00008 00001..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Notes internes ou remarques particulières (facultatif)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-950 border border-slate-700 text-slate-100 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  placeholder="Délai de livraison, lieu de pose, etc."
                />
              </div>

              {/* Cachet Toggle */}
              <div className="pt-2 flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showStamp}
                    onChange={(e) => setShowStamp(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  <span className="ml-3 text-xs font-semibold text-slate-300">
                    Apposer le cachet officiel & signature du Prestataire
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: LIVE OFFICIAL PREVIEW */}
        <div
          className={`lg:col-span-6 sticky top-6 ${
            activeTab === 'form' ? 'hidden lg:block' : 'block'
          }`}
        >
          <div className="no-print bg-slate-900 border border-slate-800 text-white p-3 rounded-t-xl flex items-center justify-between text-xs">
            <span className="font-semibold flex items-center gap-1.5 text-slate-200">
              <Eye className="w-4 h-4 text-emerald-400" />
              Rendu officiel A4 en temps réel
            </span>
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-block font-mono text-[10px] text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800/40">
                {formatInvoiceFileName(currentInvoiceDraft.number)}.pdf
              </span>
              <button
                onClick={() => printInvoiceDocument(currentInvoiceDraft.number)}
                className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 rounded font-semibold text-[11px] transition-colors flex items-center gap-1 cursor-pointer text-white shadow-xs"
                title={`Imprimer / Enregistrer sous ${formatInvoiceFileName(currentInvoiceDraft.number)}.pdf`}
              >
                <Printer className="w-3.5 h-3.5" /> Lancer Impression / PDF
              </button>
            </div>
          </div>

          <div className="border border-slate-800 rounded-b-xl overflow-hidden shadow-2xl bg-slate-950 p-2 sm:p-4 ring-1 ring-slate-800">
            <OfficialDocument
              invoice={currentInvoiceDraft}
              settings={settings}
            />
          </div>
        </div>
      </div>

      {/* QUICK NEW CLIENT MODAL */}
      {showQuickClientModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-800 text-slate-100">
            <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-blue-400" />
              Ajouter rapidement un Client
            </h3>

            <form onSubmit={handleCreateQuickClient} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Nom ou Raison Sociale *
                </label>
                <input
                  type="text"
                  required
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  placeholder="ex: AIR MADAGASCAR S.A."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 text-slate-100 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Téléphone / Contact *
                </label>
                <input
                  type="text"
                  required
                  value={newClientPhone}
                  onChange={(e) => setNewClientPhone(e.target.value)}
                  placeholder="ex: +261 34 00 000 00"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 text-slate-100 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Adresse physique
                </label>
                <input
                  type="text"
                  value={newClientAddress}
                  onChange={(e) => setNewClientAddress(e.target.value)}
                  placeholder="ex: Ankorondrano, Antananarivo"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 text-slate-100 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Email de contact
                </label>
                <input
                  type="email"
                  value={newClientEmail}
                  onChange={(e) => setNewClientEmail(e.target.value)}
                  placeholder="ex: contact@client.mg"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 text-slate-100 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowQuickClientModal(false)}
                  className="px-4 py-2 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-800 font-semibold cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold cursor-pointer"
                >
                  Enregistrer et Sélectionner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
