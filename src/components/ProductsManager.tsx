import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import { formatAriary } from '../utils/formatters';
import {
  Package,
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
  Tag,
  DollarSign
} from 'lucide-react';

export const ProductsManager: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    ref: '',
    name: '',
    designation: '',
    unitPrice: 0,
    category: 'Impression Grand Format',
  });

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      ref: 'REF-' + Math.floor(100 + Math.random() * 900),
      name: '',
      designation: '',
      unitPrice: 50000,
      category: 'Supports Publicitaires',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      ref: product.ref,
      name: product.name,
      designation: product.designation,
      unitPrice: product.unitPrice,
      category: product.category || 'Supports Publicitaires',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.ref.trim()) {
      showToast('La référence produit est requise.', 'error');
      return;
    }
    if (!formData.name.trim()) {
      showToast('Le nom du produit est requis.', 'error');
      return;
    }
    if (formData.unitPrice < 0) {
      showToast('Le prix unitaire ne peut pas être négatif.', 'error');
      return;
    }

    if (editingProduct) {
      updateProduct(editingProduct.id, formData);
    } else {
      addProduct(formData);
    }
    setIsModalOpen(false);
  };

  const filteredProducts = products.filter(
    (p) =>
      p.ref.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-400" />
            Catalogue Produits, Supports & Prestations
          </h1>
          <p className="text-xs text-slate-400">
            {products.length} référence{products.length > 1 ? 's' : ''} pré-configurées pour facturation rapide
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Ajouter un Produit / Réf
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par référence, nom du produit ou description technique..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-500 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider font-bold">
                <th className="py-3 px-4 w-28">Réf</th>
                <th className="py-3 px-4 w-48">Produit</th>
                <th className="py-3 px-4">Désignation Technique</th>
                <th className="py-3 px-4 w-32">Catégorie</th>
                <th className="py-3 px-4 text-right w-32">Prix Unitaire (Ar)</th>
                <th className="py-3 px-4 text-right w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-500 italic">
                    Aucun produit ne correspond à votre recherche.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-slate-800/40 transition-colors group"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-200">
                      <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-blue-400">
                        {product.ref}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-100">
                      {product.name}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 whitespace-pre-line leading-relaxed">
                      {product.designation}
                    </td>
                    <td className="py-3.5 px-4">
                      {product.category && (
                        <span className="inline-block text-[11px] bg-slate-800/80 text-slate-300 border border-slate-700/60 px-2 py-0.5 rounded">
                          {product.category}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-extrabold text-emerald-400 text-sm whitespace-nowrap">
                      {formatAriary(product.unitPrice)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded transition-colors cursor-pointer"
                          title="Modifier"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (
                              window.confirm(
                                `Voulez-vous supprimer le produit "${product.ref} - ${product.name}" ?`
                              )
                            ) {
                              deleteProduct(product.id);
                            }
                          }}
                          className="p-1.5 hover:bg-rose-950/40 text-rose-400 hover:text-rose-300 rounded transition-colors cursor-pointer"
                          title="Supprimer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit Product */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-xl max-w-lg w-full p-6 shadow-2xl border border-slate-800 text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Package className="w-4 h-4 text-blue-400" />
                {editingProduct ? 'Modifier le Produit' : 'Ajouter un Produit / Support'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Référence (Réf) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.ref}
                    onChange={(e) => setFormData({ ...formData, ref: e.target.value.toUpperCase() })}
                    placeholder="ex: BAN-440"
                    className="w-full font-mono font-bold px-3 py-2 bg-slate-950 border border-slate-700 text-slate-100 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Catégorie
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="ex: Impression Grand Format"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 text-slate-100 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Nom du Produit *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="ex: Banderole Bâche Frontlit 440g"
                  className="w-full font-semibold px-3 py-2 bg-slate-950 border border-slate-700 text-slate-100 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Désignation Technique (Détails & finitions)
                </label>
                <textarea
                  rows={3}
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  placeholder="ex: Impression quadri haute définition, avec œillets métalliques et ourlet renforcé tous les 50cm..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 text-slate-100 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Prix Unitaire en Ariary (P.U en Ar) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="500"
                    required
                    value={formData.unitPrice}
                    onChange={(e) =>
                      setFormData({ ...formData, unitPrice: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full font-mono font-bold text-sm px-3 py-2 bg-slate-950 border border-slate-700 text-slate-100 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 font-bold text-slate-500 text-xs">
                    Ar
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Soit : <span className="font-semibold text-emerald-400">{formatAriary(formData.unitPrice)}</span>
                </p>
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
                  {editingProduct ? 'Enregistrer les modifications' : 'Ajouter au catalogue'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
