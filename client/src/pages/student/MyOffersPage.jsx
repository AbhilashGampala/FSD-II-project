import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge, SampleBadge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Spinner } from '../../components/common/Feedback';
import {
  Award,
  Building2,
  MapPin,
  Calendar,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ExternalLink,
  PartyPopper,
  Sparkles
} from 'lucide-react';

export const MyOffersPage = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [actionType, setActionType] = useState(null); // 'accepted' | 'declined'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchOffers = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.getMyOffers();
      if (res.success) {
        setOffers(res.offers || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch job offers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleOpenModal = (offer, type) => {
    setSelectedOffer(offer);
    setActionType(type);
  };

  const handleCloseModal = () => {
    setSelectedOffer(null);
    setActionType(null);
  };

  const handleConfirmResponse = async () => {
    if (!selectedOffer || !actionType) return;
    try {
      setIsSubmitting(true);
      const res = await api.respondToOffer(selectedOffer._id, actionType);
      if (res.success) {
        setSuccessMessage(res.message);
        handleCloseModal();
        await fetchOffers();
      }
    } catch (err) {
      alert(err.message || 'Failed to submit response');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDaysRemaining = (deadline) => {
    const diff = new Date(deadline).getTime() - new Date().getTime();
    if (diff <= 0) return 0;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const hasAcceptedOffer = offers.some((o) => o.status === 'accepted');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-6 h-6 text-brand-orange" />
            My Placement Offers
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Review employment letters, package details, and submit official response before deadline
          </p>
        </div>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-green-50 dark:bg-green-950/40 text-green-800 dark:text-green-200 text-sm border border-green-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button
            onClick={() => setSuccessMessage('')}
            className="text-xs text-green-700 font-semibold hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Accepted Celebration Banner */}
      {hasAcceptedOffer && (
        <div className="bg-gradient-to-r from-green-500/15 via-emerald-500/10 to-teal-500/15 border border-green-500/30 rounded-2xl p-5 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-500 text-white flex items-center justify-center flex-shrink-0 shadow-md">
            <PartyPopper className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-green-900 dark:text-green-100 flex items-center gap-2">
              Congratulations on securing your placement!
              <Sparkles className="w-4 h-4 text-amber-500" />
            </h3>
            <p className="text-xs sm:text-sm text-green-800 dark:text-green-300 mt-1">
              Vishnu Institute of Technology Placement Cell congratulates you. Your accepted offer has been recorded into the institutional placement registry. Please submit your signed copy to the Training & Placement Office.
            </p>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-sm border border-red-200">
          {error}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <Spinner size="lg" className="py-20" />
      ) : offers.length === 0 ? (
        <Card className="text-center py-16 space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <Award className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            No Placement Offers Received Yet
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Once companies complete their interview rounds and publish offer letters, your official compensation and designation details will appear here.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {offers.map((offer) => {
            const company = offer.company || {};
            const isPending = offer.status === 'pending';
            const isAccepted = offer.status === 'accepted';
            const isDeclined = offer.status === 'declined';
            const isExpired = offer.status === 'expired';
            const daysLeft = getDaysRemaining(offer.acceptDeadline);

            return (
              <Card
                key={offer._id}
                className={`flex flex-col justify-between border-2 transition-all ${
                  isAccepted
                    ? 'border-green-500/50 bg-green-50/20 dark:bg-green-950/10'
                    : isPending
                    ? 'border-orange-500/40'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="space-y-4">
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 font-bold text-lg shadow-sm">
                        {company.logoUrl ? (
                          <img
                            src={company.logoUrl}
                            alt={company.name}
                            className="w-8 h-8 object-contain"
                          />
                        ) : (
                          <Building2 className="w-6 h-6 text-slate-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                          {company.name || 'Company'}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {offer.jobRole}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <Badge
                        variant={
                          isAccepted
                            ? 'success'
                            : isDeclined
                            ? 'danger'
                            : isExpired
                            ? 'neutral'
                            : 'warning'
                        }
                        size="md"
                      >
                        {offer.status?.toUpperCase()}
                      </Badge>
                      {offer.isSample && <SampleBadge />}
                    </div>
                  </div>

                  {/* Compensation Highlight */}
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                        Annual CTC Package
                      </p>
                      <p className="text-2xl font-black text-brand-green">
                        ₹{offer.packageLPA} <span className="text-sm font-semibold text-slate-500">LPA</span>
                      </p>
                    </div>
                    {offer.location && (
                      <div className="text-right">
                        <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold flex items-center justify-end gap-1">
                          <MapPin className="w-3 h-3" /> Location
                        </p>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {offer.location}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Metadata fields */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="space-y-0.5">
                      <p className="text-slate-400">Expected Joining</p>
                      <p className="font-semibold text-slate-700 dark:text-slate-300">
                        {offer.joiningDate
                          ? new Date(offer.joiningDate).toLocaleDateString()
                          : 'Immediate / Upon Graduation'}
                      </p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-slate-400">Offer Received</p>
                      <p className="font-semibold text-slate-700 dark:text-slate-300">
                        {new Date(offer.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Offer Letter link if available */}
                  {offer.offerLetterLink && (
                    <a
                      href={offer.offerLetterLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2.5 rounded-lg bg-orange-50 dark:bg-orange-950/30 text-brand-orange hover:bg-orange-100 dark:hover:bg-orange-950/50 text-xs font-semibold transition-all border border-orange-200 dark:border-orange-900/50"
                    >
                      <FileText className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate flex-1">View / Download Official Offer Letter</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}

                  {/* Deadline countdown */}
                  {isPending && (
                    <div className="flex items-center gap-2 text-xs p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40">
                      <Clock className="w-4 h-4 flex-shrink-0" />
                      <span>
                        Respond within <strong>{daysLeft} days</strong> (Deadline:{' '}
                        {new Date(offer.acceptDeadline).toLocaleDateString()})
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Buttons for Pending Offer */}
                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
                  {isPending ? (
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant="secondary"
                        onClick={() => handleOpenModal(offer, 'declined')}
                        className="text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                      >
                        <XCircle className="w-3.5 h-3.5 mr-1 text-red-500" />
                        Decline
                      </Button>
                      <Button
                        variant="primary"
                        onClick={() => handleOpenModal(offer, 'accepted')}
                        className="text-xs bg-brand-green hover:bg-green-600 text-white"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        Accept Offer
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-1">
                      <span className="text-xs text-slate-400 font-medium">
                        Response recorded on {new Date(offer.respondedAt || offer.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Confirmation Modal */}
      {selectedOffer && (
        <Modal
          isOpen={true}
          onClose={handleCloseModal}
          title={
            actionType === 'accepted' ? 'Accept Placement Offer' : 'Decline Placement Offer'
          }
        >
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs space-y-1">
              <p className="font-bold text-slate-800 dark:text-white">
                {selectedOffer.company?.name || 'Company'} — {selectedOffer.jobRole}
              </p>
              <p className="text-brand-green font-semibold">
                Package: ₹{selectedOffer.packageLPA} LPA
              </p>
            </div>

            {actionType === 'accepted' ? (
              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <p>
                  By clicking <strong>Confirm Acceptance</strong>, you officially accept this placement offer. This status will be notified to the VIT Placement Office and the company recruiter.
                </p>
                <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-500" />
                  <span>
                    Note: As per VIT placement policy, accepting an offer may restrict eligibility for non-dream tier drives.
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <p>
                  Are you sure you want to <strong>decline</strong> this offer? This action cannot be undone once confirmed.
                </p>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button variant="secondary" onClick={handleCloseModal} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button
                variant={actionType === 'accepted' ? 'primary' : 'danger'}
                onClick={handleConfirmResponse}
                disabled={isSubmitting}
                className={actionType === 'accepted' ? 'bg-brand-green hover:bg-green-600 text-white' : ''}
              >
                {isSubmitting
                  ? 'Submitting...'
                  : actionType === 'accepted'
                  ? 'Confirm Acceptance'
                  : 'Confirm Decline'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
