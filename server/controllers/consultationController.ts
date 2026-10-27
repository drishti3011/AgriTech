import { Response } from 'express';
import { dataStore, StoreConsultation } from '../data/store.js';
import { AuthRequest } from '../middleware/auth.js';

export const getConsultations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;

    let list: StoreConsultation[];
    if (role === 'admin' || role === 'expert') {
      list = [...dataStore.consultations];
    } else if (userId) {
      list = dataStore.consultations.filter(c => c.user === userId);
    } else {
      list = [...dataStore.consultations];
    }

    res.json({ success: true, count: list.length, data: list });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const bookConsultation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { farmerName, farmerPhone, expertName, expertSpecialty, topic, cropAffected, symptomsDescription, urgency, scheduledDate, scheduledTime, meetingType } = req.body;
    const userId = req.user?.id || 'usr-farmer-01';

    if (!farmerName || !farmerPhone || !cropAffected || !symptomsDescription) {
      res.status(400).json({ success: false, message: 'Farmer name, phone, crop affected, and symptoms are required.' });
      return;
    }

    const newBooking: StoreConsultation = {
      _id: `cns-${Date.now()}`,
      user: userId,
      farmerName,
      farmerPhone,
      expertName: expertName || 'Dr. Anita Roy',
      expertSpecialty: expertSpecialty || 'Senior Crop Pathologist',
      topic: topic || `Advisory on ${cropAffected}`,
      cropAffected,
      symptomsDescription,
      urgency: urgency || 'normal',
      status: 'pending',
      scheduledDate: scheduledDate || new Date(Date.now() + 86400000).toISOString().split('T')[0],
      scheduledTime: scheduledTime || '11:30 AM',
      meetingType: meetingType || 'phone',
      createdAt: new Date().toISOString(),
    };

    dataStore.consultations.unshift(newBooking);
    dataStore.logActivity(farmerName, 'CONSULTATION_BOOKED', 'Expert Consultation', `Booked session for ${cropAffected} with ${newBooking.expertName}`, userId);

    res.status(201).json({
      success: true,
      message: 'Consultation session booked. You will receive an SMS reminder.',
      data: newBooking,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateConsultation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, expertNotes, prescription } = req.body;

    const session = dataStore.consultations.find(c => c._id === id);
    if (!session) {
      res.status(404).json({ success: false, message: 'Consultation session not found.' });
      return;
    }

    if (status) session.status = status;
    if (expertNotes !== undefined) session.expertNotes = expertNotes;
    if (prescription) session.prescription = prescription;

    dataStore.logActivity(req.user?.name || 'Expert', 'CONSULTATION_UPDATED', 'Expert Consultation', `Updated session for ${session.farmerName} (${session.cropAffected})`, req.user?.id);

    res.json({ success: true, message: 'Consultation record updated.', data: session });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
