const mongoose = require('mongoose');

const accommodationSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  location: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  bedrooms: { 
    type: Number, 
    required: true 
  },
  bathrooms: { 
    type: Number, 
    required: true 
  },
  guests: { 
    type: Number, 
    required: true 
  },
  type: { 
    type: String, 
    required: true 
  },
  amenities: [{ 
    type: String 
  }],
  images: [{ 
    type: String 
  }],
  host: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  rating: { 
    type: Number, 
    default: 0 
  },
  reviews: { 
    type: Number, 
    default: 0 
  },
  weeklyDiscount: { 
    type: Number, 
    default: 0 
  },
  cleaningFee: { 
    type: Number, 
    default: 0 
  },
  serviceFee: { 
    type: Number, 
    default: 0 
  },
  occupancyTaxes: { 
    type: Number, 
    default: 0 
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Accommodation', accommodationSchema);