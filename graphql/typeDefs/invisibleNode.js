export const schema = `
  type InvisibleNode {
    id: ID!
    connectedNodes: [Node]!
    createdAt: String!
    updatedAt: String!
  }
`;