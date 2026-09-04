import React from 'react';
import { Invoice, CompanySettings } from '../types';
import { formatAriary, formatDateFrench } from '../utils/formatters';
import { OfficialStamp } from './OfficialStamp';
import { HiniLogo } from './HiniLogo';

interface OfficialDocumentProps {
  invoice: Invoice;
  settings: CompanySettings;
  className?: string;
  hideSignatures?: boolean;
}

export const OfficialDocument: React.FC<OfficialDocumentProps> = ({
  invoice,
  settings,
  className = '',
  hideSignatures = false,
}) => {
  const isProforma = invoice.type === 'PROFORMA';
  const titleText = isProforma
    ? `Facture Proforma N°: ${invoice.number}`
    : `Facture N°: ${invoice.number}`;

  return (
    <div
      id="printable-official-invoice"
      className={`bg-white text-slate-900 mx-auto w-full max-w-[210mm] min-h-[297mm] p-8 md:p-12 flex flex-col justify-between shadow-lg print:shadow-none print:m-0 print:p-0 print:min-h-0 print:w-full ${className}`}
      style={{ boxSizing: 'border-box' }}
    >
      <div>
        {/* --- 1. EN-TÊTE OFFICIEL --- */}
        <div className="border-b-2 border-slate-900 pb-4 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* Official Logo "HINI Make Your Mark" & Company Subtitle */}
            <div className="flex items-center gap-4">
              <HiniLogo size="lg" />
              <div className="border-l border-slate-300 pl-3.5 my-0.5">
                <h1 className="text-sm font-bold tracking-tight text-slate-950 uppercase leading-none">
                  {settings.name}
                </h1>
                <p className="text-[11px] font-medium text-slate-600 leading-tight mt-1 max-w-xs">
                  {settings.slogan}
                </p>
              </div>
            </div>

            {/* Date & Lieu */}
            <div className="text-right sm:text-right w-full sm:w-auto">
              <p className="text-xs sm:text-sm font-semibold text-slate-700">
                {settings.location} le {formatDateFrench(invoice.date)}
              </p>
              <div className="inline-block mt-1 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded border border-slate-800 bg-slate-100 print:bg-transparent">
                {isProforma ? 'Facture Proforma' : 'Facture Définitive'}
              </div>
            </div>
          </div>
        </div>

        {/* --- 2. TITRE DU DOCUMENT ET CADRE CLIENT --- */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
          {/* Numérotation Document */}
          <div className="md:col-span-7 flex items-center">
            <div className="bg-slate-900 text-white px-4 py-2.5 rounded-sm w-full print:bg-slate-900 print:text-white">
              <h2 className="text-sm md:text-base font-bold tracking-wide uppercase">
                {titleText}
              </h2>
            </div>
          </div>

          {/* Doit: Nom du client */}
          <div className="md:col-span-5">
            <div className="border border-slate-800 rounded-sm p-3 bg-slate-50/50 print:bg-transparent">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                  Doit:
                </span>
                <span className="text-sm font-bold text-slate-950">
                  {invoice.clientName || 'Client non spécifié'}
                </span>
              </div>
              {invoice.clientAddress && (
                <p className="text-xs text-slate-700 leading-tight">
                  {invoice.clientAddress}
                </p>
              )}
              {invoice.clientPhone && (
                <p className="text-xs text-slate-600 mt-0.5">
                  Contact: <span className="font-medium text-slate-800">{invoice.clientPhone}</span>
                </p>
              )}
              {(invoice.clientNif || invoice.clientStat) && (
                <p className="text-[11px] text-slate-500 mt-1 pt-1 border-t border-slate-200">
                  {invoice.clientNif && <span>NIF: {invoice.clientNif} </span>}
                  {invoice.clientStat && <span>| STAT: {invoice.clientStat}</span>}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* --- 3. TABLEAU DES ARTICLES --- */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse border border-slate-900 text-xs">
            <thead>
              <tr className="bg-slate-900 text-white font-bold uppercase tracking-wider print:bg-slate-900 print:text-white">
                <th className="border border-slate-900 px-2 py-2 text-center w-16">Réf</th>
                <th className="border border-slate-900 px-3 py-2 text-left w-36">Produit</th>
                <th className="border border-slate-900 px-3 py-2 text-left">Désignation</th>
                <th className="border border-slate-900 px-2 py-2 text-center w-16">Quantité</th>
                <th className="border border-slate-900 px-3 py-2 text-right w-24">P.U (Ar)</th>
                <th className="border border-slate-900 px-3 py-2 text-right w-28">Montant (Ar)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-300">
              {invoice.items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400 italic">
                    Aucun article ajouté à cette facture.
                  </td>
                </tr>
              ) : (
                invoice.items.map((item, idx) => (
                  <tr
                    key={item.id || idx}
                    className="hover:bg-slate-50/50 print:hover:bg-transparent"
                  >
                    <td className="border border-slate-400 px-2 py-2.5 text-center font-mono font-semibold text-slate-700">
                      {item.ref || '-'}
                    </td>
                    <td className="border border-slate-400 px-3 py-2.5 font-bold text-slate-900 align-top">
                      {item.product}
                    </td>
                    <td className="border border-slate-400 px-3 py-2.5 text-slate-700 whitespace-pre-line leading-relaxed align-top">
                      {item.designation}
                    </td>
                    <td className="border border-slate-400 px-2 py-2.5 text-center font-bold text-slate-900 align-top">
                      {item.quantity}
                    </td>
                    <td className="border border-slate-400 px-3 py-2.5 text-right font-mono text-slate-800 align-top whitespace-nowrap">
                      {formatAriary(item.unitPrice).replace(' Ar', '')}
                    </td>
                    <td className="border border-slate-400 px-3 py-2.5 text-right font-mono font-bold text-slate-950 align-top whitespace-nowrap">
                      {formatAriary(item.amount).replace(' Ar', '')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot>
              {/* Ligne Total Général */}
              <tr className="border-t-2 border-slate-900 bg-slate-100 font-bold print:bg-transparent">
                <td
                  colSpan={5}
                  className="border border-slate-900 px-4 py-2.5 text-right uppercase tracking-wider text-xs md:text-sm text-slate-900"
                >
                  Montant TOTAL (Ar) :
                </td>
                <td className="border border-slate-900 px-3 py-2.5 text-right font-mono text-sm md:text-base font-extrabold text-slate-950 bg-slate-200/60 print:bg-transparent whitespace-nowrap">
                  {formatAriary(invoice.totalAmount)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* --- 4. MENTIONS LÉGALES ET DE PAIEMENT --- */}
        <div className="space-y-2 mb-6 text-xs text-slate-800">
          {/* Montant en lettres */}
          <div className="p-2.5 bg-slate-50 border border-slate-300 rounded-sm print:bg-transparent print:border-slate-800">
            <p className="font-semibold">
              <span className="font-bold text-slate-900">Arrêté à la somme de : </span>
              <span className="italic uppercase text-slate-950 font-bold">
                {invoice.amountInWords || 'Zéro Ariary'}
              </span>
            </p>
          </div>

          {/* Conditions & Modalités bancaires */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] pt-1 text-slate-700">
            <div className="space-y-1">
              <p className="flex items-start gap-1">
                <span className="font-bold text-slate-900 min-w-[55px]">• Chèque:</span>
                <span>{invoice.chequeDetails || settings.chequeOrder}</span>
              </p>
              <p className="flex items-start gap-1">
                <span className="font-bold text-slate-900 min-w-[55px]">• Virement:</span>
                <span className="font-mono text-slate-900">{invoice.bankDetails || settings.bankRib}</span>
              </p>
            </div>
            <div>
              <p className="flex items-start gap-1 font-semibold text-slate-900">
                <span>• Conditions:</span>
                <span className="text-red-700 font-bold">
                  {invoice.paymentTerms || settings.paymentTerms}
                </span>
              </p>
              {invoice.notes && (
                <p className="text-[10px] text-slate-600 italic mt-1 bg-amber-50/50 p-1 border-l-2 border-amber-400 print:bg-transparent">
                  Note: {invoice.notes}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* --- 5. BLOCS DE SIGNATURE --- */}
        {!hideSignatures && (
          <div className="grid grid-cols-2 gap-8 my-6 pt-4 border-t border-slate-300 print:border-slate-400 print:break-inside-avoid">
            {/* Prestataire */}
            <div className="text-center">
              <p className="font-bold text-xs uppercase tracking-wider text-slate-900 mb-2">
                Le Prestataire
              </p>
              <div className="min-h-[145px] flex flex-col items-center justify-center relative">
                {invoice.showStamp ? (
                  <OfficialStamp
                    signatory={settings.prestataireSignatory}
                    title={settings.prestataireTitle}
                    nif={settings.nif}
                    showSignature={true}
                  />
                ) : (
                  <div className="w-48 h-28 border border-dashed border-slate-300 rounded flex items-center justify-center text-slate-400 text-[10px] italic">
                    (Cachet Officiel & Signature)
                  </div>
                )}
              </div>
            </div>

            {/* Client */}
            <div className="text-center">
              <p className="font-bold text-xs uppercase tracking-wider text-slate-900 mb-2">
                Le Client
              </p>
              <div className="min-h-[110px] border border-dashed border-slate-300 rounded p-2 flex flex-col justify-between items-center text-slate-400 text-[10px]">
                <span className="italic mt-1">« Lu et approuvé - Bon pour accord »</span>
                <span className="text-[9px] mb-1">Date, signature et cachet</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* --- 6. PIED DE PAGE OFFICIEL CENTRÉ --- */}
      <div className="border-t-2 border-slate-900 pt-3 mt-4 text-center text-[10px] text-slate-700 leading-normal print:break-inside-avoid">
        <p className="font-medium text-slate-900 mb-0.5">
          <span className="font-bold">GSM:</span> {settings.gsm} &nbsp;|&nbsp;{' '}
          <span className="font-bold">E-mail:</span> {settings.email}
        </p>
        <p className="font-mono text-slate-800 text-[9.5px]">
          <span className="font-semibold">NIF:</span> {settings.nif} &nbsp;|&nbsp;{' '}
          <span className="font-semibold">CIS N°:</span> {settings.cis} &nbsp;|&nbsp;{' '}
          <span className="font-semibold">STAT:</span> {settings.stat}
        </p>
      </div>
    </div>
  );
};
