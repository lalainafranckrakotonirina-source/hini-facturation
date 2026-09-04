import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Client } from '../types';
import {
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  FileText,
  Phone,
  Mail,
  MapPin,
  X
} from 'lucide-react';

interface ClientsManagerProps {
  onNewInvoiceForClient?: (client: Client) => void;
}

export const ClientsManager: React.FC<ClientsManagerProps> = ({
  onNewInvoiceForClient,
}) => {
  const { clients, invoices, addClient, updateClient, deleteClient, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    phone: '',
    address: '',
    email: '',
    nif: '',
    stat: '',
    notes: '',
  });

  const openCreateModal = () => {
    setEditingClient(null);
    setFormData({
      name: '',
      contactPerson: '',
      phone: '',
      address: 'Antananarivo, Madagascar',
      email: '',
      nif: '',
      stat: '',
      notes: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      contactPerson: client.contactPerson || '',
      phone: client.phone || '',
      address: client.address || '',
      email: client.email || '',
      nif: client.nif || '',
      stat: client.stat || '',
      notes: client.notes || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Le nom du client ou de la société est obligatoire.', 'error');
      return;
    }

    if (editingClient) {
      updateClient(editingClient.id, formData);
    } else {
      addClient(formData);
    }
    setIsModalOpen(false);
  };

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.contactPerson && c.contactPerson.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.phone && c.phone.includes(searchQuery)) ||
      (c.address && c.address.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" />
            Gestion des Clients & Sociétés
          </h1>
          <p className="text-xs text-slate-400">
            {clients.length} client{clients.length > 1 ? 's' : ''} enregistrés dans la base
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Nouveau Client
        </button>
      </div>

      {/* Search Input */}
      <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher un client par nom, interlocuteur, téléphone ou adresse..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-500 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Clients Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.map((client) => {
          const clientInvoices = invoices.filter((inv) => inv.clientId === client.id);
          return (
            <div
              key={client.id}
              className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="font-bold text-slate-100 text-sm">{client.name}</h2>
                    {client.contactPerson && (
                      <p className="text-xs text-slate-400 font-medium mt-0.5">
                        {client.contactPerson}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(client)}
                      className="p-1 text-slate-400 hover:text-slate-200 rounded hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Modifier"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            `Voulez-vous vraiment supprimer le client "${client.name}" ?`
                          )
                        ) {
                          deleteClient(client.id);
                        }
                      }}
                      className="p-1 text-rose-400 hover:text-rose-300 rounded hover:bg-rose-950/40 transition-colors cursor-pointer"
                      title="Supprimer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="mt-3 space-y-1.5 text-xs text-slate-400">
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300">{client.address || 'Adresse non renseignée'}</span>
                  </div>
                  {client.phone && (
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                      <span className="font-medium text-slate-200">{client.phone}</span>
                    </div>
                  )}
                  {client.email && (
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                      <span className="text-slate-300">{client.email}</span>
                    </div>
                  )}
                  {(client.nif || client.stat) && (
                    <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-800 flex gap-2">
                      {client.nif && <span>NIF: {client.nif}</span>}
                      {client.stat && <span>STAT: {client.stat}</span>}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">
                  {clientInvoices.length} document{clientInvoices.length > 1 ? 's' : ''}
                </span>

                {onNewInvoiceForClient && (
                  <button
                    onClick={() => onNewInvoiceForClient(client)}
                    className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" /> Créer Facture / Proforma
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Create / Edit Client */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-xl max-w-lg w-full p-6 shadow-2xl border border-slate-800 text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-400" />
                {editingClient ? 'Modifier le Client' : 'Ajouter un Nouveau Client'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Nom du Client ou Entreprise *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="ex: SOCIETE TROPICALE EVENTS S.A."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 text-slate-100 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Interlocuteur / Contact
                  </label>
                  <input
                    type="text"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    placeholder="ex: M. Rakoto (Dir. Comm)"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 text-slate-100 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Téléphone *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="ex: +261 34 12 345 67"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 text-slate-100 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Adresse complète
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="ex: Rue Ratsimilaho, Antaninarenina, Antananarivo"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 text-slate-100 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="ex: contact@entreprise.mg"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 text-slate-100 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    NIF (optionnel)
                  </label>
                  <input
                    type="text"
                    value={formData.nif}
                    onChange={(e) => setFormData({ ...formData, nif: e.target.value })}
                    placeholder="ex: 1000123456"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 text-slate-100 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    STAT (optionnel)
                  </label>
                  <input
                    type="text"
                    value={formData.stat}
                    onChange={(e) => setFormData({ ...formData, stat: e.target.value })}
                    placeholder="ex: 74201 11..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 text-slate-100 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Notes internes
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Informations particulières sur le client..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 text-slate-100 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-800 font-semibold cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold cursor-pointer"
                >
                  {editingClient ? 'Enregistrer les modifications' : 'Créer le client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
