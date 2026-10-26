import mongoose from 'mongoose';

export const APPLICATION_STATUS_ENUM = [
  'applied',
  'shortlisted',
  'aptitude',
  'technical',
  'hr',
  'selected',
  'rejected',
  'withdrawn'
];

const applicationHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: APPLICATION_STATUS_ENUM,
      required: true
    },
    note: {
      type: String,
      trim: true,
      default: ''
    },
    at: {
      type: Date,
      default: Date.now
    },
    by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  { _id: false }
);

const applicationSchema = new mongoose.Schema(
  {
    drive: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Drive',
      required: [true, 'Drive reference is required']
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student reference is required']
    },
    status: {
      type: String,
      enum: APPLICATION_STATUS_ENUM,
      default: 'applied'
    },
    history: [applicationHistorySchema],
    isSample: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Prevent duplicate applications: one application per student per drive
applicationSchema.index({ drive: 1, student: 1 }, { unique: true });
applicationSchema.index({ student: 1 });
applicationSchema.index({ drive: 1, status: 1 });

const Application = mongoose.model('Application', applicationSchema);

export default Application;
