export const schema = `
  type User {
    id: ID!
    username: String
    email: String!
    roles: [String]!
    buildings: [Building]!
    createdAt: String!
    updatedAt: String!
    accountStatus: String!
  }
`;