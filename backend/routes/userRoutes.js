const express = require('express');
const router = express.Router();
const { login, register } = require('../controllers/userController');
const auth = require('../middleware/auth');
const User = require('../models/User');

// Debug middleware to see which routes are hit
router.use((req, res, next) => {
  console.log(`📨 [${new Date().toISOString()}] User Route: ${req.method} ${req.path}`);
  next();
});

// ✅ PUBLIC ROUTES - No authentication required
router.post('/register', register);
router.post('/login', login);

// ✅ TEMPORARY TEST ROUTE - Debug login without auth
router.post('/test-login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    console.log('🔧 Testing login with:', { username });
    
    // Simple test without auth middleware
    const user = await User.findOne({ username });
    
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    
    // Check if comparePassword method exists, otherwise use direct comparison
    let isPasswordValid;
    if (typeof user.comparePassword === 'function') {
      isPasswordValid = await user.comparePassword(password);
    } else {
      isPasswordValid = user.password === password;
    }
    
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid password' });
    }
    
    res.json({ 
      message: 'Login successful (test route)',
      user: { id: user._id, username: user.username }
    });
    
  } catch (error) {
    console.error('Test login error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// ✅ HEALTH CHECK for users route
router.get('/health', (req, res) => {
  res.json({ 
    status: 'Users route is working',
    timestamp: new Date().toISOString()
  });
});

// ✅ PROTECTED ROUTES - Authentication required
router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;