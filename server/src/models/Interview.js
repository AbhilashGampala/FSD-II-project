import mongoose from 'mongoose';

export const INTERVIEW_MODE_ENUM = ['online', 'offline'];
export const INTERVIEW_STATUS_ENUM = ['scheduled', 'completed', 'cancelled'];

const interviewSchema = new mongoose.Schema(
  {
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      required: [true, 'Application reference is required']
    },
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
    roundName: {
      type: String,
      required: [true, 'Round name is required'],
      trim: true
    },
    date: {
      type: Date,
      required: [true, 'Interview date is required']
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
      trim: true
    },
    mode: {
      type: String,
      enum: INTERVIEW_MODE_ENUM,
      default: 'offline'
    },
    venue: {
      type: String,
      trim: true,
      default: 'Placement Cell Seminar Hall, Block A'
    },
    meetingLink: {
      type: String,
      trim: true,
      default: ''
    },
    panel: {
      type: String,
      trim: true,
      default: 'Panel 1'
    },
    instructions: {
      type: String,
      trim: true,
      default: 'Bring updated resume, college ID card, and academic credentials.'
    },
    status: {
      type: String,
      enum: INTERVIEW_STATUS_ENUM,
      default: 'scheduled'
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

interviewSchema.index({ student: 1, date: 1 });
interviewSchema.index({ drive: 1 });
interviewSchema.index({ application: 1 });

const Interview = mongoose.model('Interview', interviewSchema);

export default Interview;
