const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    require: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  resetToken: String,
  resetTokenExpDate: Date,
  firstName: String,
  lastName: String,
  phone: String,
  isInterviewed: {
    type: Boolean,
    required: true,
    default: false,
  },
  isApproved: {
    type: Boolean,
    required: true,
    default: false,
  },
  adminNotes: String,
  skills: [
    {
      skillId: { type: Schema.Types.ObjectId, ref: 'Skill' },
      name: { type: String, required: true },
      skillLevel: { type: String, default: '' },
      test_link: { type: String, default: null },
      session_url: { type: String, default: null },
      report_link: { type: String, default: null },
      pdf_report_url: { type: String, default: null },
      cancel_url: { type: String, default: null },
      isVerified: { type: Boolean, default: false },
      isTested: { type: Boolean, default: false },
      result: { type: Number, default: null },
      max_result: { type: Number, default: null },
    },
  ],
  education: [
    {
      level: String,
      schoolName: String,
      courseName: String,
      startDate: String,
      endDate: String,
      isCurrent: Boolean,
    },
  ],
  work: [
    {
      companyName: String,
      jobRole: String,
      jobDescription: String,
      startDate: String,
      endDate: String,
      isCurrent: Boolean,
      country: String,
      city: String,
    },
  ],
});

module.exports = mongoose.model('User', userSchema);
