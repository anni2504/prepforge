const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Progress = require('../models/Progress');

const dsaQuestions = [
  {
    id: 0,
    title: "Two Sum",
    difficulty: "Easy",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    gfgLink: "https://www.geeksforgeeks.org/problems/key-pair5616/1",
    topic: "Arrays",
    hint: "Think about using a hash map to store visited elements."
  },
  {
    id: 1,
    title: "Reverse a Linked List",
    difficulty: "Easy",
    description: "Given the head of a singly linked list, reverse the list, and return the reversed list.",
    gfgLink: "https://www.geeksforgeeks.org/problems/reverse-a-linked-list/1",
    topic: "Linked List",
    hint: "Use three pointers: prev, curr, next."
  },
  {
    id: 2,
    title: "Valid Parentheses",
    difficulty: "Easy",
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    gfgLink: "https://www.geeksforgeeks.org/problems/parenthesis-checker2744/1",
    topic: "Stack",
    hint: "Use a stack to match opening brackets with closing brackets."
  },
  {
    id: 3,
    title: "Binary Search",
    difficulty: "Easy",
    description: "Given an array of integers nums sorted in ascending order, find the target value and return its index. Return -1 if not found.",
    gfgLink: "https://www.geeksforgeeks.org/problems/binary-search-1587115620/1",
    topic: "Searching",
    hint: "Keep track of low and high pointers and find the mid element."
  },
  {
    id: 4,
    title: "Maximum Subarray (Kadane's Algorithm)",
    difficulty: "Medium",
    description: "Given an integer array nums, find the subarray with the largest sum, and return its sum.",
    gfgLink: "https://www.geeksforgeeks.org/problems/kadanes-algorithm-1587115620/1",
    topic: "Dynamic Programming",
    hint: "Track current sum and max sum, reset current sum when it goes negative."
  },
  {
    id: 5,
    title: "Merge Two Sorted Arrays",
    difficulty: "Easy",
    description: "Given two sorted arrays, merge them into a single sorted array.",
    gfgLink: "https://www.geeksforgeeks.org/problems/merge-two-sorted-arrays5135/1",
    topic: "Arrays",
    hint: "Use two pointers, one for each array."
  },
  {
    id: 6,
    title: "Level Order Traversal of Binary Tree",
    difficulty: "Medium",
    description: "Given the root of a binary tree, return the level order traversal of its nodes' values.",
    gfgLink: "https://www.geeksforgeeks.org/problems/level-order-traversal/1",
    topic: "Trees",
    hint: "Use a queue (BFS). Enqueue children of each dequeued node."
  },
  {
    id: 7,
    title: "Detect Cycle in Undirected Graph",
    difficulty: "Medium",
    description: "Given an undirected graph, determine whether it contains a cycle.",
    gfgLink: "https://www.geeksforgeeks.org/problems/detect-cycle-in-an-undirected-graph/1",
    topic: "Graph",
    hint: "Use BFS/DFS and track visited nodes along with their parent."
  },
  {
    id: 8,
    title: "Fibonacci using Dynamic Programming",
    difficulty: "Easy",
    description: "Calculate the nth Fibonacci number efficiently using dynamic programming.",
    gfgLink: "https://www.geeksforgeeks.org/problems/introduction-to-dp/1",
    topic: "Dynamic Programming",
    hint: "Store previously computed values in an array (memoization)."
  },
  {
    id: 9,
    title: "Longest Common Subsequence",
    difficulty: "Medium",
    description: "Given two strings text1 and text2, return the length of their longest common subsequence.",
    gfgLink: "https://www.geeksforgeeks.org/problems/longest-common-subsequence-1587115620/1",
    topic: "Dynamic Programming",
    hint: "Build a 2D DP table comparing characters of both strings."
  }
];

// @route GET /api/dsa/questions
router.get('/questions', protect, (req, res) => {
  res.json(dsaQuestions);
});

// @route POST /api/dsa/complete
router.post('/complete', protect, async (req, res) => {
  const { questionId } = req.body;

  if (questionId === undefined)
    return res.status(400).json({ message: 'questionId is required' });

  try {
    let progress = await Progress.findOne({ userId: req.user._id });
    if (!progress) progress = await Progress.create({ userId: req.user._id });

    if (!progress.dsa.completed.includes(questionId)) {
      progress.dsa.completed.push(questionId);
      progress.dsa.score = progress.dsa.completed.length;
    }
    await progress.save();

    res.json({
      message: 'Question marked as complete!',
      dsaScore: progress.dsa.score,
      completed: progress.dsa.completed
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
