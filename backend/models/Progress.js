const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  aptitude: {
    score: { type: Number, default: 0 },
    total: { type: Number, default: 10 },
    completed: { type: [Number], default: [] }, // indices of completed questions
    attempts: { type: Number, default: 0 }
  },
  dsa: {
    score: { type: Number, default: 0 },
    total: { type: Number, default: 10 },
    completed: { type: [Number], default: [] },
    attempts: { type: Number, default: 0 }
  },
  interview: {
    score: { type: Number, default: 0 },
    total: { type: Number, default: 10 },
    completed: { type: [Number], default: [] },
    submissions: [{
      questionIndex: Number,
      answer: String,
      score: Number,
      feedback: String,
      submittedAt: { type: Date, default: Date.now }
    }]
  },
  overallScore: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now }
});

// Calculate overall score before save
progressSchema.pre('save', function (next) {
  const apt = this.aptitude.total > 0 ? (this.aptitude.score / this.aptitude.total) * 100 : 0;
  const dsa = this.dsa.total > 0 ? (this.dsa.score / this.dsa.total) * 100 : 0;
  const int = this.interview.total > 0 ? (this.interview.score / this.interview.total) * 100 : 0;
  this.overallScore = Math.round((apt + dsa + int) / 3);
  this.lastUpdated = new Date();
  next();
});

module.exports = mongoose.model('Progress', progressSchema);
