export const schema = `
  type Floor {
    id: ID!
    name: String!
    building: Building!
    nodes: [Node]!
    image: FloorImage
    createdAt: String!
    updatedAt: String!
  }
`;