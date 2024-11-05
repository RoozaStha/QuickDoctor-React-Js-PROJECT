import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    docId: { type: String, required: true },
    slotDate: { type: String, required: true },
    slotTime: { type: String, required: true },
    docData: { type: Object, required: true },
    userData: { type: Object, required: true },
    amount: { type: Number, required: true },
    date: { type: Number, required: true },
    cancelled: { type: Boolean, default: false },
    paymentStatus: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false }
});

// Use 'appointments' as the collection name
const appointmentModel = mongoose.models.appointment || mongoose.model('appointment', appointmentSchema);

export default appointmentModel;
