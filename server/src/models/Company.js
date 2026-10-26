import mongoose from 'mongoose';

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      unique: true
    },
    industry: {
      type: String,
      required: [true, 'Industry is required'],
      trim: true
    },
    website: {
      type: String,
      trim: true,
      default: ''
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    logoUrl: {
      type: String,
      trim: true,
      default: ''
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

companySchema.index({ industry: 1 });

const Company = mongoose.model('Company', companySchema);

export default Company;
