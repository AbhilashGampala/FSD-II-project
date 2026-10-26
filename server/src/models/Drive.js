import mongoose from 'mongoose';
import { BRANCH_ENUM } from './User.js';

export const DRIVE_TYPE_ENUM = ['on-campus', 'off-campus', 'pool'];
export const DRIVE_STATUS_ENUM = ['draft', 'published', 'closed'];

const driveSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company reference is required']
    },
    title: {
      type: String,
      required: [true, 'Drive title is required'],
      trim: true
    },
    jobRole: {
      type: String,
      required: [true, 'Job role is required'],
      trim: true
    },
    driveType: {
      type: String,
      enum: DRIVE_TYPE_ENUM,
      default: 'on-campus'
    },
    packageLPA: {
      type: Number,
      required: [true, 'Package (LPA) is required'],
      min: [0, 'Package cannot be negative']
    },
    locations: {
      type: [String],
      default: ['Bhimavaram', 'Hyderabad', 'Bangalore']
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    rounds: {
      type: [String],
      default: ['Online Aptitude Test', 'Technical Interview', 'HR Interview']
    },
    deadline: {
      type: Date,
      required: [true, 'Application deadline is required']
    },
    driveDate: {
      type: Date,
      required: [true, 'Drive event date is required']
    },
    status: {
      type: String,
      enum: DRIVE_STATUS_ENUM,
      default: 'draft'
    },
    isSample: {
      type: Boolean,
      default: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    eligibility: {
      branches: {
        type: [String],
        enum: BRANCH_ENUM,
        default: [] // Empty array means open to all branches
      },
      minCgpa: {
        type: Number,
        min: 0,
        max: 10,
        default: 0
      },
      min10thPct: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
      },
      min12thPct: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
      },
      maxActiveBacklogs: {
        type: Number,
        min: 0,
        default: 0
      },
      graduationYear: {
        type: Number,
        default: null
      }
    }
  },
  {
    timestamps: true
  }
);

driveSchema.index({ status: 1 });
driveSchema.index({ deadline: 1 });
driveSchema.index({ company: 1 });
driveSchema.index({ packageLPA: 1 });
driveSchema.index({ 'eligibility.branches': 1 });

const Drive = mongoose.model('Drive', driveSchema);

export default Drive;
