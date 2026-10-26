import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge, StatusPill, SampleBadge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Input, Select } from '../../components/common/Input';
import { Spinner, EmptyState } from '../../components/common/Feedback';
import {
  Award,
  Building2,
  Clock,
  MapPin,
  ExternalLink,
  PlusCircle,
  FileCheck2,
  AlertCircle
} from 'lucide-react';

export const OffersPage = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Create Offer Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [eligibleApplications, setEligibleApplications] = useState([]);

  const [formData, setFormData] = useState({
    applicationId: '',
    jobRole: '',
    packageLPA: '',
    location: 'Hyderabad',
    joiningDate: '',
    offerLetterLink: '',
    acceptDeadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10)
  });

  const fetchOffers = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;

      const res = await api.getOffers(params);
      if (res.success) {
        setOffers(res.offers);
      }
    } catch (err) {
      setError(err.message || 'Failed to load offers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, [statusFilter]);

  const handleOpenCreate = async () => {
    setIsModalOpen(true);
    setFormError('');
    try {
      // Find candidate applications eligible for offer (selected or hr or interview)
      const drivesRes = await api.getDrives();
      if (drivesRes.success && drivesRes.drives.length > 0) {
        const appsPromises = drivesRes.drives.map((d) => api.getApplicationsByDrive(d._id));
        const appsResponses = await Promise.all(appsPromises);
        const allApps = appsResponses.flatMap((r) => r.applications || []);
        // Prefer selected, but allow any active candidate
        setEligibleApplications(allApps);
      }
    } catch (err) {
      console.warn('Could not load candidate list for modal');
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.applicationId) {
      setFormError('Please select a student candidate');
      return;
    }
    if (!formData.packageLPA || Number(formData.packageLPA) <= 0) {
      setFormError('Please enter a valid package in LPA');
      return;
    }
    if (!formData.acceptDeadline) {
      setFormError('Please choose an acceptance deadline');
      return;
    }

    setFormLoading(true);
    try {
      await api.createOffer(formData);
      setSuccessMsg('Job offer successfully recorded and dispatched to student portal.');
      setIsModalOpen(false);
      fetchOffers();
    } catch (err) {
      setFormError(err.message || 'Failed to record offer');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Student Placement Offers</span>
            <span className="text-xs font-normal text-slate-500">({offers.length})</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Track official employment letters, package compensation, and candidate responses.
          </p>
        </div>

        <Button variant="primary" onClick={handleOpenCreate} className="gap-2">
          <PlusCircle className="w-4 h-4" />
          <span>Record New Offer</span>
        </Button>
      </div>

      {successMsg && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs border border-emerald-200 flex items-center justify-between">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg('')} className="text-slate-500 hover:text-slate-700">✕</button>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs border border-red-200">
          {error}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold w-max">
        {['all', 'pending', 'accepted', 'declined', 'expired'].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setStatusFilter(tab)}
            className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
              statusFilter === tab
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Offers Grid */}
      {loading ? (
        <Spinner size="lg" className="py-20" />
      ) : offers.length === 0 ? (
        <EmptyState
          icon={<Award className="w-10 h-10 text-slate-400" />}
          title="No job offers found"
          description="Use 'Record New Offer' to award a placement package to a selected candidate."
          action={
            <Button variant="primary" size="sm" onClick={handleOpenCreate}>
              Record Offer
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {offers.map((off) => (
            <Card key={off._id} className="flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      {off.company?.name}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {off.jobRole}
                    </h3>
                  </div>
                  <StatusPill status={off.status} />
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 my-2 text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
                    <span>{off.student?.name}</span>
                    <span className="font-mono text-slate-500">{off.student?.rollNo || off.student?.branch}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Drive: <span className="text-slate-600 dark:text-slate-300">{off.drive?.title}</span>
                  </p>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Package CTC</span>
                    <span className="font-bold text-brand-orange text-sm">₹ {off.packageLPA} LPA</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Location</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{off.location}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Accept By</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {new Date(off.acceptDeadline).toLocaleDateString()}
                    </span>
                  </div>

                  {off.joiningDate && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Joining Date</span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {new Date(off.joiningDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  {off.offerLetterLink && (
                    <div className="pt-2">
                      <a
                        href={off.offerLetterLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-brand-purple hover:underline font-semibold"
                      >
                        <span>View Offer Letter PDF</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {off.respondedAt && (
                <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800">
                  Responded: {new Date(off.respondedAt).toLocaleString()}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Record Offer Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Record Student Placement Offer"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-3">
          {formError && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <Select
            label="Candidate Application"
            value={formData.applicationId}
            onChange={(e) => {
              const selectedApp = eligibleApplications.find((a) => a._id === e.target.value);
              setFormData({
                ...formData,
                applicationId: e.target.value,
                jobRole: selectedApp?.drive?.jobRole || formData.jobRole,
                packageLPA: selectedApp?.drive?.packageLPA || formData.packageLPA
              });
            }}
            options={eligibleApplications.map((a) => ({
              value: a._id,
              label: `${a.student?.name} (${a.student?.rollNo || a.student?.branch}) - ${a.drive?.title} [${a.status}]`
            }))}
            placeholder="-- Choose Student Candidate --"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Designated Job Role"
              placeholder="e.g. Software Engineer"
              value={formData.jobRole}
              onChange={(e) => setFormData({ ...formData, jobRole: e.target.value })}
            />
            <Input
              label="Package (LPA in ₹)"
              type="number"
              step="0.1"
              placeholder="e.g. 9.5"
              value={formData.packageLPA}
              onChange={(e) => setFormData({ ...formData, packageLPA: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Work Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
            <Input
              label="Acceptance Deadline"
              type="date"
              value={formData.acceptDeadline}
              onChange={(e) => setFormData({ ...formData, acceptDeadline: e.target.value })}
              required
            />
          </div>

          <Input
            label="Tentative Joining Date"
            type="date"
            value={formData.joiningDate}
            onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
          />

          <Input
            label="Offer Letter Document Link (URL)"
            type="url"
            placeholder="https://example.com/sample-letter.pdf"
            value={formData.offerLetterLink}
            onChange={(e) => setFormData({ ...formData, offerLetterLink: e.target.value })}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button size="sm" variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" variant="primary" type="submit" loading={formLoading}>
              Record & Notify Student
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
