const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchemaNew = new Schema({
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
  phone: Number,
  skills: [
    {
      skillId: { type: Schema.Types.ObjectId, ref: 'Skill' },
      name: String,
      skillLevel: { type: Number, default: 0 },
      test_link: String,
      session_url: String,
    },
  ],
});

module.exports = mongoose.model('User', userSchemaNew);
