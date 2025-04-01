const SensorReading = require('../../models/sensorReading');

module.exports = {
  createSensorReading: async (_, { sensorId, value }) => {
    const newReading = new SensorReading({
      sensorId,
      value,
      timestamp: new Date(),
      status: 'active',  // Can modify the status logic if needed
    });

    return await newReading.save();
  }
};
