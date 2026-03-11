const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Progress = require('../models/Progress');

const aptitudeQuestions = [
  {
    id: 0,
    question: "If a train travels 60 km in 45 minutes, what is its speed in km/h?",
    options: ["75 km/h", "80 km/h", "90 km/h", "100 km/h"],
    correct: 1,
    explanation: "Speed = Distance/Time = 60 / (45/60) = 60 × (60/45) = 80 km/h"
  },
  {
    id: 1,
    question: "A shopkeeper buys an item for ₹200 and sells it for ₹250. What is the profit percentage?",
    options: ["20%", "25%", "30%", "15%"],
    correct: 1,
    explanation: "Profit % = ((250-200)/200) × 100 = (50/200) × 100 = 25%"
  },
  {
    id: 2,
    question: "What is the next number in the series: 2, 6, 12, 20, 30, ?",
    options: ["40", "42", "44", "46"],
    correct: 1,
    explanation: "Pattern: n(n+1) → 1×2=2, 2×3=6, 3×4=12, 4×5=20, 5×6=30, 6×7=42"
  },
  {
    id: 3,
    question: "Three persons A, B, C can do a work in 10, 12, and 15 days respectively. In how many days will they finish the work together?",
    options: ["4 days", "5 days", "3 days", "6 days"],
    correct: 0,
    explanation: "Combined rate = 1/10 + 1/12 + 1/15 = 6/60 + 5/60 + 4/60 = 15/60 = 1/4. So 4 days."
  },
  {
    id: 4,
    question: "If the simple interest on ₹5000 for 2 years is ₹500, what is the rate of interest per annum?",
    options: ["4%", "5%", "6%", "8%"],
    correct: 1,
    explanation: "Rate = (SI × 100) / (P × T) = (500 × 100) / (5000 × 2) = 50000/10000 = 5%"
  },
  {
    id: 5,
    question: "In a class of 40 students, 25% scored above 90%. How many students scored above 90%?",
    options: ["8", "10", "12", "15"],
    correct: 1,
    explanation: "25% of 40 = (25/100) × 40 = 10 students"
  },
  {
    id: 6,
    question: "Find the odd one out: 121, 144, 169, 196, 225, 256, 290",
    options: ["225", "256", "290", "196"],
    correct: 2,
    explanation: "All others are perfect squares (11², 12², 13², 14², 15², 16²). 290 is not a perfect square."
  },
  {
    id: 7,
    question: "A pipe fills a tank in 6 hours and another empties it in 8 hours. If both are open, how long to fill the tank?",
    options: ["20 hours", "24 hours", "18 hours", "12 hours"],
    correct: 1,
    explanation: "Net rate = 1/6 - 1/8 = 4/24 - 3/24 = 1/24. So tank fills in 24 hours."
  },
  {
    id: 8,
    question: "What is the LCM of 12, 18, and 24?",
    options: ["48", "72", "36", "96"],
    correct: 1,
    explanation: "LCM(12,18,24): 12=2²×3, 18=2×3², 24=2³×3. LCM = 2³×3² = 8×9 = 72"
  },
  {
    id: 9,
    question: "If 5 machines make 5 parts in 5 minutes, how many minutes does it take 100 machines to make 100 parts?",
    options: ["100", "50", "5", "20"],
    correct: 2,
    explanation: "Each machine makes 1 part in 5 minutes. 100 machines make 100 parts simultaneously in 5 minutes."
  }
];

// @route GET /api/aptitude/questions
router.get('/questions', protect, (req, res) => {
  // Return questions without the correct answer
  const safeQuestions = aptitudeQuestions.map(({ correct, explanation, ...q }) => q);
  res.json(safeQuestions);
});

// @route POST /api/aptitude/submit
router.post('/submit', protect, async (req, res) => {
  const { questionId, selectedOption } = req.body;

  if (questionId === undefined || selectedOption === undefined)
    return res.status(400).json({ message: 'questionId and selectedOption are required' });

  const question = aptitudeQuestions[questionId];
  if (!question)
    return res.status(404).json({ message: 'Question not found' });

  const isCorrect = selectedOption === question.correct;

  try {
    let progress = await Progress.findOne({ userId: req.user._id });
    if (!progress) progress = await Progress.create({ userId: req.user._id });

    if (isCorrect && !progress.aptitude.completed.includes(questionId)) {
      progress.aptitude.completed.push(questionId);
      progress.aptitude.score = progress.aptitude.completed.length;
    }
    progress.aptitude.attempts += 1;
    await progress.save();

    res.json({
      isCorrect,
      explanation: question.explanation,
      correctOption: question.correct,
      aptitudeScore: progress.aptitude.score,
      completed: progress.aptitude.completed
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
