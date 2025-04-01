const mongoose = require('mongoose');

const sensorReadingSchema = new mongoose.Schema({
  sensorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Sensor',
    required: true 
  },
  value: { 
    type: Number, 
    required: true 
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  },
  status: { 
    type: String, 
    default: 'active'
  }
});

module.exports = mongoose.model('SensorReading', sensorReadingSchema);
