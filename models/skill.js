const mongoose = require('mongoose');

const { Schema } = mongoose;

const skillSchema = new Schema({
  url: String,
  codility_test_id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  invite_url: {
    type: String,
    required: true,
  },
  sessions_url: {
    type: String,
    required: true,
  },
  public_test_link: String,
  icon: String,
});

module.exports = mongoose.model('Skill', skillSchema);
