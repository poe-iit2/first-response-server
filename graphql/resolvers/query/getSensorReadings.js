const SensorReading = require('../../models/sensorReading');

module.exports = {
  getSensorReadings: async (_, { sensorId }) => {
    return await SensorReading.find({ sensorId });
  }
};
