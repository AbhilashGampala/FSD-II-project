import mongoose from 'mongoose';

const statSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: [true, 'Stat label is required'],
      trim: true
    },
    value: {
      type: String,
      trim: true,
      default: '' // Intentionally empty per Data Honesty rules until official report is added
    },
    year: {
      type: Number,
      default: 2024
    },
    sourceUrl: {
      type: String,
      trim: true,
      default: ''
    },
    sourceNote: {
      type: String,
      trim: true,
      default: 'Awaiting official published college placement report'
    },
    verified: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

statSchema.index({ label: 1 });
statSchema.index({ verified: 1 });

const Stat = mongoose.model('Stat', statSchema);

export default Stat;
