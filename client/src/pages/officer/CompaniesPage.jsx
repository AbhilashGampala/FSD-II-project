import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { SampleBadge } from '../../components/common/Badge';
import { Spinner, EmptyState } from '../../components/common/Feedback';
import {
  Building2,
  Plus,
  Search,
  ExternalLink,
  Edit2,
  Trash2,
  Globe,
  AlertCircle
} from 'lucide-react';

export const CompaniesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    website: '',
    description: '',
    logoUrl: ''
  });

  const fetchCompanies = async (query = '') => {
    try {
      setLoading(true);
      setError('');
      const res = await api.getCompanies(query);
      if (res.success) {
        setCompanies(res.companies);
      }
    } catch (err) {
      setError(err.message || 'Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies(search);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCompanies(search);
  };

  const handleOpenAdd = () => {
    setEditingCompany(null);
    setFormData({ name: '', industry: '', website: '', description: '', logoUrl: '' });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (comp) => {
    setEditingCompany(comp);
    setFormData({
      name: comp.name,
      industry: comp.industry,
      website: comp.website || '',
      description: comp.description || '',
      logoUrl: comp.logoUrl || ''
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);

    try {
      if (editingCompany) {
        await api.updateCompany(editingCompany._id, formData);
        setActionSuccess(`Company '${formData.name}' updated successfully.`);
      } else {
        await api.createCompany(formData);
        setActionSuccess(`Company '${formData.name}' added successfully.`);
      }
      setIsModalOpen(false);
      fetchCompanies(search);
    } catch (err) {
      setFormError(err.message || 'Operation failed');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (comp) => {
    if (!window.confirm(`Are you sure you want to delete '${comp.name}'?`)) {
      return;
    }

    try {
      await api.deleteCompany(comp._id);
      setActionSuccess(`Company '${comp.name}' deleted.`);
      fetchCompanies(search);
    } catch (err) {
      alert(`Cannot delete: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Title & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Partner Companies</span>
            <span className="text-xs font-normal text-slate-500">({companies.length})</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Recruiting partners and corporate organizations visiting Vishnu Institute of Technology.
          </p>
        </div>

        <Button variant="primary" onClick={handleOpenAdd} className="gap-2">
          <Plus className="w-4 h-4" />
          <span>Add Company</span>
        </Button>
      </div>

      {/* Notifications */}
      {actionSuccess && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs border border-emerald-200 flex items-center justify-between">
          <span>{actionSuccess}</span>
          <button onClick={() => setActionSuccess('')} className="text-slate-500 hover:text-slate-700">✕</button>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs border border-red-200">
          {error}
        </div>
      )}

      {/* Search Input */}
      <Card className="p-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search companies by name or industry sector..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-xs focus:outline-none focus:ring-2 focus:ring-brand-orange"
            />
          </div>
          <Button type="submit" variant="outline" size="sm">
            Search
          </Button>
        </form>
      </Card>

      {/* Companies Grid */}
      {loading ? (
        <Spinner size="lg" className="py-16" />
      ) : companies.length === 0 ? (
        <EmptyState
          icon={<Building2 className="w-10 h-10 text-slate-400" />}
          title="No companies found"
          description="Try modifying your search or click 'Add Company' to register a corporate partner."
          action={
            <Button variant="primary" size="sm" onClick={handleOpenAdd}>
              Add Company
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {companies.map((comp) => (
            <Card key={comp._id} className="flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-sm">
                      {comp.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {comp.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {comp.industry}
                      </p>
                    </div>
                  </div>
                  {comp.isSample && <SampleBadge />}
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {comp.description || 'No description provided.'}
                </p>

                {comp.website && (
                  <a
                    href={comp.website}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-brand-orange hover:underline font-medium"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Website</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(comp)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs flex items-center gap-1"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(comp)}
                  className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add / Edit Company Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCompany ? `Edit Company: ${editingCompany.name}` : 'Add New Partner Company'}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <Input
            label="Company Name"
            placeholder="e.g. Apex Tech Innovations"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <Input
            label="Industry Sector"
            placeholder="e.g. Information Technology / Cloud / Core Engineering"
            value={formData.industry}
            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
            required
          />

          <Input
            label="Official Website URL"
            type="url"
            placeholder="https://example.com"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 tracking-wide uppercase">
              Company Overview
            </label>
            <textarea
              rows={3}
              placeholder="Brief description of organization and job domains..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-brand-orange"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={formLoading}
            >
              {editingCompany ? 'Save Changes' : 'Create Company'}
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
