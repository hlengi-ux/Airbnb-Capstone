const express = require('express');
const router = express.Router();
const Accommodation = require('../models/Accommodation');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const accommodations = await Accommodation.find().populate('host', 'username');
    res.json({
      success: true,
      count: accommodations.length,
      data: accommodations
    });
  } catch (error) {
    console.error('Error fetching accommodations:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const accommodation = await Accommodation.findById(req.params.id).populate('host', 'username');
    
    if (!accommodation) {
      return res.status(404).json({ 
        success: false,
        message: 'Accommodation not found' 
      });
    }
    
    res.json({
      success: true,
      data: accommodation
    });
  } catch (error) {
    console.error('Error fetching accommodation:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const accommodationData = {
      ...req.body,
      host: req.user.userId
    };
    
    const accommodation = new Accommodation(accommodationData);
    await accommodation.save();
    
    res.status(201).json({
      success: true,
      data: accommodation
    });
  } catch (error) {
    console.error('Error creating accommodation:', error);
    res.status(400).json({ 
      success: false,
      message: 'Error creating accommodation' 
    });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const accommodation = await Accommodation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!accommodation) {
      return res.status(404).json({ 
        success: false,
        message: 'Accommodation not found' 
      });
    }
    
    res.json({
      success: true,
      data: accommodation,
      message: 'Accommodation updated successfully'
    });
  } catch (error) {
    console.error('Update error:', error);
    res.status(400).json({ 
      success: false,
      message: 'Error updating accommodation'
    });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const accommodation = await Accommodation.findByIdAndDelete(req.params.id);
    
    if (!accommodation) {
      return res.status(404).json({ 
        success: false,
        message: 'Accommodation not found' 
      });
    }
    
    res.json({
      success: true,
      message: 'Accommodation deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting accommodation:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});

module.exports = router;