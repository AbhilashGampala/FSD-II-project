import mongoose from 'mongoose';

export const OFFER_STATUS_ENUM = ['pending', 'accepted', 'declined', 'expired'];

const offerSchema = new mongoose.Schema(
  {
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      required: [true, 'Application reference is required']
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student reference is required']
    },
    drive: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Drive',
      required: [true, 'Drive reference is required']
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company reference is required']
    },
    jobRole: {
      type: String,
      required: [true, 'Job role is required'],
      trim: true
    },
    packageLPA: {
      type: Number,
      required: [true, 'Package (LPA) is required'],
      min: [0, 'Package cannot be negative']
    },
    location: {
      type: String,
      trim: true,
      default: 'Hyderabad'
    },
    joiningDate: {
      type: Date,
      default: null
    },
    offerLetterLink: {
      type: String,
      trim: true,
      default: ''
    },
    acceptDeadline: {
      type: Date,
      required: [true, 'Acceptance deadline is required']
    },
    status: {
      type: String,
      enum: OFFER_STATUS_ENUM,
      default: 'pending'
    },
    respondedAt: {
      type: Date,
      default: null
    },
    isSample: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

offerSchema.index({ student: 1, status: 1 });
offerSchema.index({ drive: 1 });
offerSchema.index({ company: 1 });

const Offer = mongoose.model('Offer', offerSchema);

export default Offer;
