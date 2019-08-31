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
      name: String,
      skillLevel: { type: String, default: '' },
      test_link: String,
      isVerified: Boolean,
      isTested: Boolean,
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
