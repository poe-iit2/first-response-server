export const schema = `
  type Log {
    id: String!
    type: String!
    message: String!
    buildings: [Building]
    floors: [Floor]!
    nodes: [Node]!
    priority: Float
    updatedAt: String!
    createdAt: String!
  }
`;