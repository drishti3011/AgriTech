import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.js';
import { useAuth } from '../context/AuthContext.js';
import { api } from '../services/api.js';
import { 
  GraduationCap, 
  Calendar, 
  Clock, 
  PhoneCall, 
  Video, 
  MapPin, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Plus,
  X,
  Stethoscope
} from 'lucide-react';

export const ConsultationSection: React.FC = () => {
  const { t, showToast } = useApp();
  const { user } = useAuth();
  const [consultations, setConsultations] = useState<any[]>([]);
  const [showBookingModal, setShowBookingModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const [bookingForm, setBookingForm] = useState({
    farmerName: user?.name || 'Ramesh Patel',
    farmerPhone: user?.phone || '+91 94231 88921',
    expertName: 'Dr. Anita Roy',
    expertSpecialty: 'Soil Pathologist & Micronutrient Specialist',
    topic: '',
    cropAffected: 'Wheat (गेहूं)',
    symptomsDescription: '',
    urgency: 'normal',
    scheduledDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    scheduledTime: '11:00 AM',
    meetingType: 'phone',
  });

  const fetchConsultations = async () => {
    setLoading(true);
    try {
      const res = await api.getConsultations();
      if (res.data.success) {
        setConsultations(res.data.data);
      }
    } catch (e) {
      console.warn('Consultations fallback');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, []);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.cropAffected || !bookingForm.symptomsDescription) {
      showToast('Crop affected and symptoms description are required', 'error');
      return;
    }

    try {
      const res = await api.bookConsultation(bookingForm);
      if (res.data.success) {
        showToast('Consultation appointment registered. SMS confirmation sent!', 'success');
        setShowBookingModal(false);
        fetchConsultations();
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Error booking consultation', 'error');
    }
  };

  const expertsList = [
    {
      name: 'Dr. Anita Roy',
      title: 'Senior Agronomist & Soil Pathologist',
      experience: '16+ yrs ICAR Research',
      avatar: '/src/assets/images/agritech_expert_agronomist_1793120954897.jpg',
      specialty: 'Nutrient deficiencies, pH remediation, cereal crops',
    },
    {
      name: 'Dr. S. K. Narayanan',
      title: 'Integrated Pest Management (IPM) Specialist',
      experience: '12+ yrs State Agri University',
      avatar: '/src/assets/images/agritech_expert_agronomist_1793120954897.jpg',
      specialty: 'Stem borer, leaf blast, organic bio-control',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
            {t.consult.title}
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {t.consult.subtitle}
          </p>
        </div>
        <button
          onClick={() => setShowBookingModal(true)}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t.consult.bookSession}</span>
        </button>
      </div>

      {/* Featured Agronomists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {expertsList.map((exp, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm flex items-start gap-4"
          >
            <img
              src={exp.avatar}
              alt={exp.name}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-2xl object-cover border border-emerald-500/40 shrink-0"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                  {exp.name}
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Certified
                </span>
              </div>
              <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                {exp.title}
              </p>
              <p className="text-[11px] text-neutral-500 mt-1">
                {exp.specialty} · {exp.experience}
              </p>
              <button
                onClick={() => {
                  setBookingForm(prev => ({
                    ...prev,
                    expertName: exp.name,
                    expertSpecialty: exp.title,
                  }));
                  setShowBookingModal(true);
                }}
                className="mt-3 text-xs text-emerald-600 hover:text-emerald-700 font-bold flex items-center gap-1"
              >
                <span>Book Direct Consultation →</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bookings & Prescriptions List */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm">
        <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-4">
          {t.consult.upcoming} ({consultations.length})
        </h3>

        <div className="space-y-4">
          {consultations.map((c) => (
            <div
              key={c._id}
              className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 flex flex-col justify-between"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-200/60 dark:border-neutral-700/60 mb-3">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                    c.urgency === 'urgent' ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300' : 'bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300'
                  }`}>
                    {c.urgency} priority
                  </span>
                  <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                    {c.topic || `Advisory on ${c.cropAffected}`}
                  </h4>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1 text-neutral-500">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{c.scheduledDate} at {c.scheduledTime}</span>
                  </span>
                  <span className={`font-semibold capitalize px-2 py-0.5 rounded ${
                    c.status === 'completed' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                    c.status === 'confirmed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                    'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}>
                    {c.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mb-3">
                <div>
                  <span className="text-neutral-400 block font-medium text-[11px]">Doctor & Agronomist</span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">{c.expertName}</span>
                  <span className="text-neutral-500 block text-[11px]">{c.expertSpecialty}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block font-medium text-[11px]">Reported Crop Symptoms</span>
                  <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed italic">
                    "{c.symptomsDescription}"
                  </p>
                </div>
              </div>

              {/* Prescription / Recommendations if provided */}
              {c.prescription && (
                <div className="p-3.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/50 mt-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 dark:text-emerald-200 mb-1.5">
                    <Stethoscope className="w-4 h-4 text-emerald-600" />
                    <span>{t.consult.prescription}: {c.prescription.diagnosis}</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-xs text-emerald-950 dark:text-emerald-300 mb-2">
                    {c.prescription.treatmentSteps?.map((step: string, sIdx: number) => (
                      <li key={sIdx}>{step}</li>
                    ))}
                  </ul>
                  {c.prescription.recommendedProducts?.length > 0 && (
                    <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 dark:text-emerald-300">
                      <span className="font-semibold">Recommended Farm Inputs:</span>
                      <span>{c.prescription.recommendedProducts.join(', ')}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800 mb-4">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                {t.consult.bookSession}
              </h3>
              <button onClick={() => setShowBookingModal(false)} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBook} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                    Farmer Name
                  </label>
                  <input
                    type="text"
                    required
                    value={bookingForm.farmerName}
                    onChange={(e) => setBookingForm({ ...bookingForm, farmerName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    required
                    value={bookingForm.farmerPhone}
                    onChange={(e) => setBookingForm({ ...bookingForm, farmerPhone: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                    Select Expert
                  </label>
                  <select
                    value={bookingForm.expertName}
                    onChange={(e) => setBookingForm({ ...bookingForm, expertName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  >
                    <option value="Dr. Anita Roy">Dr. Anita Roy (Soil Pathologist)</option>
                    <option value="Dr. S. K. Narayanan">Dr. S. K. Narayanan (IPM Specialist)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                    Affected Crop
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Wheat, Paddy, Cotton"
                    value={bookingForm.cropAffected}
                    onChange={(e) => setBookingForm({ ...bookingForm, cropAffected: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                  Observed Crop Symptoms / Problem Description *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe leaf yellowing, pest spots, stunted growth, or wilting pattern observed in field..."
                  value={bookingForm.symptomsDescription}
                  onChange={(e) => setBookingForm({ ...bookingForm, symptomsDescription: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                    Priority
                  </label>
                  <select
                    value={bookingForm.urgency}
                    onChange={(e) => setBookingForm({ ...bookingForm, urgency: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  >
                    <option value="normal">Normal</option>
                    <option value="urgent">Urgent Outbreak</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    value={bookingForm.scheduledDate}
                    onChange={(e) => setBookingForm({ ...bookingForm, scheduledDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                    Meeting Mode
                  </label>
                  <select
                    value={bookingForm.meetingType}
                    onChange={(e) => setBookingForm({ ...bookingForm, meetingType: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  >
                    <option value="phone">Phone Call</option>
                    <option value="video">Video Call</option>
                    <option value="field_visit">Field Visit</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="px-4 py-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                >
                  Confirm Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
