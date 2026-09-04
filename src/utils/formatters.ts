/**
 * Utility formatters for HINI MADAGASCAR
 */

export function formatAriary(amount: number): string {
  if (isNaN(amount)) return '0 Ar';
  // Malagasy Ariary convention uses space as thousands separator
  const formatted = Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${formatted} Ar`;
}

export function formatRawNumber(amount: number): string {
  if (isNaN(amount)) return '0';
  return Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export function formatDateFrench(dateString?: string): string {
  if (!dateString) {
    const today = new Date();
    dateString = today.toISOString().split('T')[0];
  }
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const day = String(date.getDate()).padStart(2, '0');
  const monthNames = [
    'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
    'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}

export function formatDateShort(dateString?: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Generates an official invoice number following company conventions:
 * ex: "020926/FP/20264901" for Proforma, "020926/FA/20264901" for Facture
 */
export function generateInvoiceNumber(type: 'PROFORMA' | 'FACTURE', sequenceNumber?: number): string {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const yearShort = String(now.getFullYear()).slice(-2);
  const datePrefix = `${day}${month}${yearShort}`; // e.g., 020926

  const typeCode = type === 'PROFORMA' ? 'FP' : 'FA';
  const yearFull = now.getFullYear();
  const seq = sequenceNumber ?? Math.floor(1000 + Math.random() * 9000);

  return `${datePrefix}/${typeCode}/${yearFull}${seq}`;
}

/**
 * Formats an invoice number for safe PDF file naming according to company guidelines:
 * Automatically replaces slashes and special characters with '_'
 * e.g., "020926/FP/20264901" -> "020926_FP_20264901"
 */
export function formatInvoiceFileName(invoiceNumber?: string): string {
  if (!invoiceNumber || !invoiceNumber.trim()) {
    return 'Facture_HINI_MADAGASCAR';
  }
  return invoiceNumber
    .trim()
    .replace(/[\/\\:\*\?"<>\|\s]+/g, '_');
}

/**
 * Triggers browser print/PDF export with document.title automatically set
 * to the exact formatted invoice number (e.g. "020926_FP_20264901"),
 * so that when the user chooses "Enregistrer au format PDF" / "Save as PDF",
 * the default downloaded filename is automatically "020926_FP_20264901.pdf".
 */
export function printInvoiceDocument(invoiceNumber?: string): void {
  const originalTitle = document.title;
  const fileName = formatInvoiceFileName(invoiceNumber);

  // Set page title to the invoice filename before printing
  document.title = fileName;

  const restoreTitle = () => {
    document.title = originalTitle;
    window.removeEventListener('afterprint', restoreTitle);
  };

  window.addEventListener('afterprint', restoreTitle);

  // Execute standard browser print
  window.print();

  // Safety fallback after print dialog closes
  setTimeout(() => {
    document.title = originalTitle;
  }, 2500);
}

