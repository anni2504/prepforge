const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Progress = require('../models/Progress');

const interviewQuestions = [
  {
    id: 0,
    type: "HR",
    question: "Tell me about yourself. Describe your background, skills, and what makes you a good fit for this role.",
    minWords: 80,
    maxWords: 200
  },
  {
    id: 1,
    type: "HR",
    question: "What are your greatest strengths and weaknesses? Give examples from your academic or project experience.",
    minWords: 80,
    maxWords: 200
  },
  {
    id: 2,
    type: "GD",
    question: "Social media is doing more harm than good to society. Discuss both sides and give your opinion.",
    minWords: 100,
    maxWords: 250
  },
  {
    id: 3,
    type: "GD",
    question: "Work from home should be made permanent for all IT professionals. Argue for or against this statement.",
    minWords: 100,
    maxWords: 250
  },
  {
    id: 4,
    type: "HR",
    question: "Describe a situation where you faced a major challenge. How did you overcome it? What did you learn?",
    minWords: 80,
    maxWords: 200
  },
  {
    id: 5,
    type: "Technical",
    question: "Explain the concept of Object-Oriented Programming and its four pillars with examples.",
    minWords: 80,
    maxWords: 200
  },
  {
    id: 6,
    type: "GD",
    question: "Artificial Intelligence will replace most jobs in the next decade. Present your viewpoint with reasoning.",
    minWords: 100,
    maxWords: 250
  },
  {
    id: 7,
    type: "HR",
    question: "Where do you see yourself in 5 years? How does this role fit your career goals?",
    minWords: 60,
    maxWords: 150
  },
  {
    id: 8,
    type: "Technical",
    question: "What is the difference between SQL and NoSQL databases? When would you use each one?",
    minWords: 80,
    maxWords: 200
  },
  {
    id: 9,
    type: "GD",
    question: "Online education vs traditional classroom education — which is better for the future of learning?",
    minWords: 100,
    maxWords: 250
  }
];

// Basic grammar scoring function
function scoreGrammar(text) {
  let score = 100;
  const feedback = [];

  // 1. Check minimum length
  const words = text.trim().split(/\s+/);
  const wordCount = words.length;

  if (wordCount < 30) {
    score -= 30;
    feedback.push("Answer is too short. Try to elaborate more.");
  }

  // 2. Check for sentence-starting capitals
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  let uncapitalized = 0;
  sentences.forEach(s => {
    const trimmed = s.trim();
    if (trimmed.length > 0 && trimmed[0] !== trimmed[0].toUpperCase()) {
      uncapitalized++;
    }
  });
  if (uncapitalized > 0) {
    score -= Math.min(uncapitalized * 5, 20);
    feedback.push(`${uncapitalized} sentence(s) don't start with a capital letter.`);
  }

  // 3. Check for repeated words (consecutive)
  let repeatedWords = 0;
  for (let i = 0; i < words.length - 1; i++) {
    if (words[i].toLowerCase() === words[i + 1].toLowerCase()) {
      repeatedWords++;
    }
  }
  if (repeatedWords > 0) {
    score -= Math.min(repeatedWords * 5, 15);
    feedback.push(`Found ${repeatedWords} repeated consecutive word(s).`);
  }

  // 4. Check for very long sentences (over 50 words)
  const longSentences = sentences.filter(s => s.trim().split(/\s+/).length > 50);
  if (longSentences.length > 0) {
    score -= 10;
    feedback.push("Some sentences are too long. Break them into smaller sentences.");
  }

  // 5. Check ending punctuation
  const trimmedText = text.trim();
  if (!/[.!?]$/.test(trimmedText)) {
    score -= 5;
    feedback.push("Your response should end with proper punctuation (., !, ?).");
  }

  // 6. Common grammar issues
  const commonErrors = [
    { pattern: /\bi am\b/gi, suggestion: "Use 'I am' (capital I)" },
    { pattern: /\s{2,}/g, suggestion: "Avoid extra spaces between words" },
    { pattern: /[,]{2,}/g, suggestion: "Avoid repeated commas" }
  ];

  commonErrors.forEach(({ pattern, suggestion }) => {
    const matches = text.match(pattern);
    if (matches && matches.length > 1) {
      score -= 5;
      feedback.push(suggestion);
    }
  });

  score = Math.max(0, Math.min(100, score));

  return {
    score: Math.round(score),
    wordCount,
    sentenceCount: sentences.length,
    feedback: feedback.length > 0 ? feedback : ["Great answer! No major grammar issues detected."]
  };
}

// @route GET /api/interview/questions
router.get('/questions', protect, (req, res) => {
  res.json(interviewQuestions);
});

// @route POST /api/interview/submit
router.post('/submit', protect, async (req, res) => {
  const { questionId, answer } = req.body;

  if (questionId === undefined || !answer)
    return res.status(400).json({ message: 'questionId and answer are required' });

  const question = interviewQuestions[questionId];
  if (!question)
    return res.status(404).json({ message: 'Question not found' });

  const grammarResult = scoreGrammar(answer);
  const normalizedScore = grammarResult.score / 100; // 0 to 1

  try {
    let progress = await Progress.findOne({ userId: req.user._id });
    if (!progress) progress = await Progress.create({ userId: req.user._id });

    // Remove previous submission for this question if exists
    progress.interview.submissions = progress.interview.submissions.filter(
      s => s.questionIndex !== questionId
    );

    // Add new submission
    progress.interview.submissions.push({
      questionIndex: questionId,
      answer,
      score: grammarResult.score,
      feedback: grammarResult.feedback.join(' | ')
    });

    // Update completed
    if (!progress.interview.completed.includes(questionId)) {
      progress.interview.completed.push(questionId);
    }

    // Calculate average interview score
    const totalScore = progress.interview.submissions.reduce((sum, s) => sum + s.score, 0);
    progress.interview.score = Math.round(totalScore / progress.interview.submissions.length) / 10; // normalize to /10

    await progress.save();

    res.json({
      grammarScore: grammarResult.score,
      wordCount: grammarResult.wordCount,
      sentenceCount: grammarResult.sentenceCount,
      feedback: grammarResult.feedback,
      completed: progress.interview.completed
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
