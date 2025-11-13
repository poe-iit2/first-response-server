export const schema = `
  type Building {
    id: ID!
    name: String!
    floors: [Floor]!
    createdAt: String!
    updatedAt: String!
  }
`;
