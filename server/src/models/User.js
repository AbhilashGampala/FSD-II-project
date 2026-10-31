import mongoose from 'mongoose';

export const BRANCH_ENUM = [
  'CSE',
  'IT',
  'ECE',
  'EEE',
  'MECH',
  'CIVIL',
  'AI&DS',
  'CSE-AIML'
];

export const ROLE_ENUM = ['student', 'officer', 'admin'];

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (v) {
          return v.endsWith('@vishnu.edu.in');
        },
        message: 'Only official college emails ending with @vishnu.edu.in are allowed'
      }
    },
    password: {
      type: String,
      default: ''
    },
    rollNo: {
      type: String,
      trim: true,
      uppercase: true,
      default: ''
    },
    role: {
      type: String,
      enum: ROLE_ENUM,
      default: 'student'
    },
    branch: {
      type: String,
      enum: {
        values: [...BRANCH_ENUM, ''],
        message: 'Invalid branch selection'
      },
      default: ''
    },
    admissionYear: {
      type: Number,
      default: null
    },
    graduationYear: {
      type: Number,
      default: null
    },
    cgpa: {
      type: Number,
      min: [0, 'CGPA cannot be negative'],
      max: [10, 'CGPA cannot exceed 10'],
      default: null
    },
    tenthPct: {
      type: Number,
      min: [0, '10th percentage cannot be negative'],
      max: [100, '10th percentage cannot exceed 100'],
      default: null
    },
    twelfthPct: {
      type: Number,
      min: [0, '12th percentage cannot be negative'],
      max: [100, '12th percentage cannot exceed 100'],
      default: null
    },
    activeBacklogs: {
      type: Number,
      min: [0, 'Active backlogs cannot be negative'],
      default: 0
    },
    phone: {
      type: String,
      trim: true,
      default: ''
    },
    isActive: {
      type: Boolean,
      default: true
    },
    isSample: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Index on role for fast admin lookups
userSchema.index({ role: 1 });

const User = mongoose.model('User', userSchema);

export default User;
