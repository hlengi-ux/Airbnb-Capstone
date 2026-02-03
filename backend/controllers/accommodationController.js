const Accommodation = require('../models/Accommodation');

// GET all accommodations
const getAccommodations = async (req, res) => {
  try {
    const accommodations = await Accommodation.find().populate('host', 'username');
    res.json({
      success: true,
      count: accommodations.length,
      data: accommodations
    });
  } catch (error) {
    console.error('Get accommodations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching accommodations'
    });
  }
};

// GET single accommodation
const getAccommodation = async (req, res) => {
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
    console.error('Get accommodation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching accommodation'
    });
  }
};

// POST create new accommodation
const createAccommodation = async (req, res) => {
  try {
    const accommodation = new Accommodation({
      ...req.body,
      host: req.user.userId
    });
    
    await accommodation.save();
    await accommodation.populate('host', 'username');
    
    res.status(201).json({
      success: true,
      message: 'Accommodation created successfully',
      data: accommodation
    });
  } catch (error) {
    console.error('Create accommodation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating accommodation'
    });
  }
};

// DELETE accommodation
const deleteAccommodation = async (req, res) => {
  try {
    const accommodation = await Accommodation.findById(req.params.id);
    
    if (!accommodation) {
      return res.status(404).json({
        success: false,
        message: 'Accommodation not found'
      });
    }
    
    await Accommodation.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Accommodation deleted successfully'
    });
  } catch (error) {
    console.error('Delete accommodation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting accommodation'
    });
  }
};

module.exports = {
  getAccommodations,
  getAccommodation,
  createAccommodation,
  deleteAccommodation
};