const User = require('../models/User');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  try {
    // Auto-login with admin user - no credentials needed
    const user = await User.findOne({ username: 'Xhanti' });
    
    const token = jwt.sign(
      { 
        userId: user ? user._id : 'admin',
        username: 'Xhanti',
        role: 'admin'
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({ 
      token, 
      user: { 
        id: user ? user._id : 'admin',
        username: 'Xhanti',
        role: 'admin'
      } 
    });
    
  } catch (error) {
    console.error('Login error:', error);
    
    // Even if error, return success for demo
    const token = jwt.sign(
      { userId: 'demo', username: 'Xhanti', role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({ 
      token, 
      user: { 
        id: 'demo',
        username: 'Xhanti',
        role: 'admin'
      } 
    });
  }
};

const register = async (req, res) => {
  try {
    const { username, password, role = 'user' } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ 
        message: 'Username and password are required' 
      });
    }
    
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User already exists' 
      });
    }
    
    const user = new User({ username, password, role });
    await user.save();
    
    const token = jwt.sign(
      { 
        userId: user._id, 
        username: user.username,
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.status(201).json({ 
      message: 'User created successfully',
      token, 
      user: { 
        id: user._id,
        username: user.username,
        role: user.role
      } 
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { login, register };