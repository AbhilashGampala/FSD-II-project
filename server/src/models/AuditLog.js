import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Actor reference is required']
    },
    action: {
      type: String,
      required: [true, 'Action name is required'],
      trim: true
    },
    targetType: {
      type: String,
      required: [true, 'Target type is required'],
      trim: true
    },
    targetId: {
      type: String,
      trim: true,
      default: ''
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

auditLogSchema.index({ actor: 1, createdAt: -1 });
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ targetType: 1 });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

export default AuditLog;
