const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type SensorReading {
    id: ID!
    sensorId: ID!
    value: Float!
    timestamp: String!
    status: String
  }

  input CreateSensorReadingInput {
    sensorId: ID!
    value: Float!
  }

  type Query {
    getSensorReadings(sensorId: ID!): [SensorReading]
  }

  type Mutation {
    createSensorReading(sensorId: ID!, value: Float!): SensorReading
  }
`;

module.exports = typeDefs;
