import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Invoice, DocumentType, DocumentStatus } from '../types';
import { formatAriary, formatDateShort, printInvoiceDocument, formatInvoiceFileName } from '../utils/formatters';
import {
  FileText,
  Search,
  Plus,
  Printer,
  Edit2,
  Copy,
  Trash2,
  ArrowRightCircle,
  CheckCircle2,
  Clock,
  Filter,
  Eye
} from 'lucide-react';

interface InvoicesListProps {
  onCreateNew: () => void;
  onEdit: (invoice: Invoice) => void;
  onView: (invoice: Invoice) => void;
}

export const InvoicesList: React.FC<InvoicesListProps> = ({
  onCreateNew,
  onEdit,
  onView,
}) => {
  const {
    invoices,
    deleteInvoice,
    duplicateInvoice,
    convertProformaToFacture,
    updateInvoice,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Filter logic
  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.items.some(
        (it) =>
          it.ref.toLowerCase().includes(searchQuery.toLowerCase()) ||
          it.product.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesType =
      filterType === 'ALL' || inv.type === filterType;

    const matchesStatus =
      filterStatus === 'ALL' || inv.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Financial Stats
  const totalFacturesPaid = invoices
    .filter((inv) => inv.type === 'FACTURE' && inv.status === 'PAYEE')
    .reduce((sum, inv) => sum + inv.totalAmount, 0);

  const totalProformasActive = invoices
    .filter((inv) => inv.type === 'PROFORMA' && inv.status !== 'ANNULEE')
    .reduce((sum, inv) => sum + inv.totalAmount, 0);

  const totalFacturesPending = invoices
    .filter((inv) => inv.type === 'FACTURE' && inv.status !== 'PAYEE' && inv.status !== 'ANNULEE')
    .reduce((sum, inv) => sum + inv.totalAmount, 0);

  // Status Badge Helper
  const renderStatusBadge = (invoice: Invoice) => {
    switch (invoice.status) {
      case 'PAYEE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
            <CheckCircle2 className="w-3 h-3" /> Payée
          </span>
        );
      case 'VALIDEE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-950/80 text-blue-300 border border-blue-800/60">
            Validée
          </span>
        );
      case 'ENVOYEE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-950/80 text-purple-300 border border-purple-800/60">
            <Clock className="w-3 h-3" /> Envoyée
          </span>
        );
      case 'ANNULEE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-950/80 text-rose-300 border border-rose-800/60">
            Annulée
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
            Brouillon
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Factures Encaissées
          </div>
          <div className="mt-2 text-xl md:text-2xl font-black font-mono text-emerald-400">
            {formatAriary(totalFacturesPaid)}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Règlements reçus et acquittés
          </div>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Factures en Attente
          </div>
          <div className="mt-2 text-xl md:text-2xl font-black font-mono text-amber-400">
            {formatAriary(totalFacturesPending)}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Factures à recouvrer
          </div>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Proformas en Cours
          </div>
          <div className="mt-2 text-xl md:text-2xl font-black font-mono text-blue-400">
            {formatAriary(totalProformasActive)}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Devis & estimations transmises
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par n° de facture, client, réf, article..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-500 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Dropdowns Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="text-xs font-semibold px-3 py-2 bg-slate-950 border border-slate-700 text-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">Tous les types</option>
            <option value="PROFORMA">Proformas uniquement</option>
            <option value="FACTURE">Factures uniquement</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs font-semibold px-3 py-2 bg-slate-950 border border-slate-700 text-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">Tous statuts</option>
            <option value="BROUILLON">Brouillon</option>
            <option value="ENVOYEE">Envoyée</option>
            <option value="VALIDEE">Validée</option>
            <option value="PAYEE">Payée</option>
            <option value="ANNULEE">Annulée</option>
          </select>

          {/* Create Button */}
          <button
            onClick={onCreateNew}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Nouveau document
          </button>
        </div>
      </div>

      {/* Documents List / Table */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm overflow-hidden">
        {filteredInvoices.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-base font-semibold text-slate-200">Aucun document commercial trouvé</p>
            <p className="text-xs text-slate-500 mt-1">
              Essayez de modifier votre recherche ou créez une nouvelle Facture / Proforma.
            </p>
            <button
              onClick={onCreateNew}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" /> Créer un document
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950/70 border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider font-bold">
                  <th className="py-3 px-4">Type & Numéro</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Articles</th>
                  <th className="py-3 px-4 text-right">Montant Total</th>
                  <th className="py-3 px-4 text-center">Statut</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredInvoices.map((invoice) => {
                  const isProforma = invoice.type === 'PROFORMA';
                  return (
                    <tr
                      key={invoice.id}
                      className="hover:bg-slate-800/60 transition-colors group"
                    >
                      {/* Type & Numéro */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase border ${
                              isProforma
                                ? 'bg-blue-950/80 text-blue-300 border-blue-800/60'
                                : 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60'
                            }`}
                          >
                            {isProforma ? 'PROFORMA' : 'FACTURE'}
                          </span>
                          <span className="font-mono font-bold text-slate-100">
                            {invoice.number}
                          </span>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                        {formatDateShort(invoice.date)}
                      </td>

                      {/* Client */}
                      <td className="py-3.5 px-4 font-semibold text-slate-200">
                        <div>{invoice.clientName}</div>
                        {invoice.clientPhone && (
                          <div className="text-[11px] font-normal text-slate-400">
                            {invoice.clientPhone}
                          </div>
                        )}
                      </td>

                      {/* Articles Count */}
                      <td className="py-3.5 px-4 text-slate-400">
                        <span className="inline-block bg-slate-800 px-2 py-0.5 rounded text-[11px] font-medium text-slate-300 border border-slate-700/60">
                          {invoice.items.length} article{invoice.items.length > 1 ? 's' : ''}
                        </span>
                      </td>

                      {/* Montant Total */}
                      <td className="py-3.5 px-4 text-right font-mono font-extrabold text-white text-sm whitespace-nowrap">
                        {formatAriary(invoice.totalAmount)}
                      </td>

                      {/* Statut */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        {renderStatusBadge(invoice)}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* Convert Proforma to Facture */}
                          {isProforma && (
                            <button
                              onClick={() => convertProformaToFacture(invoice.id)}
                              className="p-1.5 hover:bg-emerald-950/60 text-emerald-400 rounded transition-colors"
                              title="Convertir cette Proforma en Facture Définitive"
                            >
                              <ArrowRightCircle className="w-4 h-4" />
                            </button>
                          )}

                          {/* Preview / Print */}
                          <button
                            onClick={() => onView(invoice)}
                            className="p-1.5 hover:bg-slate-800 text-slate-300 rounded transition-colors"
                            title="Aperçu officiel & Imprimer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Quick Print */}
                          <button
                            onClick={() => {
                              onView(invoice);
                              setTimeout(() => printInvoiceDocument(invoice.number), 350);
                            }}
                            className="p-1.5 hover:bg-slate-800 text-slate-300 rounded transition-colors"
                            title={`Imprimer / Enregistrer sous ${formatInvoiceFileName(invoice.number)}.pdf`}
                          >
                            <Printer className="w-4 h-4" />
                          </button>

                          {/* Edit */}
                          <button
                            onClick={() => onEdit(invoice)}
                            className="p-1.5 hover:bg-slate-800 text-slate-300 rounded transition-colors"
                            title="Modifier"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Duplicate */}
                          <button
                            onClick={() => duplicateInvoice(invoice.id)}
                            className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded transition-colors"
                            title="Dupliquer le document"
                          >
                            <Copy className="w-4 h-4" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => {
                              if (
                                window.confirm(
                                  `Êtes-vous sûr de vouloir supprimer le document ${invoice.number} ?`
                                )
                              ) {
                                deleteInvoice(invoice.id);
                              }
                            }}
                            className="p-1.5 hover:bg-rose-950/60 text-rose-400 rounded transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
