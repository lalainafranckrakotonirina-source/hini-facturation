import React from 'react';
import { Invoice, CompanySettings } from '../types';
import { OfficialDocument } from './OfficialDocument';
import { Printer, X, Edit2, ArrowRightCircle, FileDown } from 'lucide-react';
import { formatInvoiceFileName } from '../utils/formatters';

interface DocumentPreviewModalProps {
  invoice: Invoice;
  settings: CompanySettings;
  onClose: () => void;
  onEdit: (invoice: Invoice) => void;
  onConvert?: (invoiceId: string) => void;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  invoice,
  settings,
  onClose,
  onEdit,
  onConvert,
}) => {
  const isProforma = invoice.type === 'PROFORMA';
  const pdfFileName = `${formatInvoiceFileName(invoice.number)}.pdf`;

  const handlePrint = () => {
    // Force dynamiquement le titre de la page pour que la boîte d'impression propose le bon nom de fichier PDF
    const oldTitle = document.title;
    document.title = formatInvoiceFileName(invoice.number);
    
    window.print();
    
    // Restaure le titre initial après l'impression
    setTimeout(() => {
      document.title = oldTitle;
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-start overflow-y-auto p-2 sm:p-6 print:p-0 print:bg-white print:static">
      {/* Top Toolbar (hidden when printing) */}
      <div className="no-print bg-slate-900 rounded-xl shadow-xl border border-slate-800 p-3 mb-4 w-full max-w-[210mm] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-0.5 rounded text-xs font-bold uppercase border ${
              isProforma
                ? 'bg-blue-950/80 text-blue-300 border-blue-800/60'
                : 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60'
            }`}
          >
            {isProforma ? 'Proforma' : 'Facture'}
          </span>
          <span className="font-mono font-bold text-xs sm:text-sm text-slate-100">
            {invoice.number}
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50" title="Nommage automatique du fichier PDF">
            <FileDown className="w-3 h-3" />
            {pdfFileName}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isProforma && onConvert && (
            <button
              onClick={() => {
                onConvert(invoice.id);
                onClose();
              }}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowRightCircle className="w-3.5 h-3.5" />
              Convertir en Facture
            </button>
          )}

          <button
            onClick={() => {
              onEdit(invoice);
              onClose();
            }}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" />
            Modifier
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            title={`Imprimer / Enregistrer sous ${pdfFileName}`}
          >
            <Printer className="w-3.5 h-3.5" />
            Imprimer / PDF
          </button>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            title="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Official A4 Document Card */}
      <div className="w-full max-w-[210mm] print:max-w-full shadow-2xl rounded-sm overflow-hidden mb-8 print:m-0 print:shadow-none ring-1 ring-slate-800">
        <OfficialDocument invoice={invoice} settings={settings} />
      </div>
    </div>
  );
};
