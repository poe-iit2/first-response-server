export const schema = `
  type Node {
    id: String!
    name: String!
    state: String!
    isExit: Boolean!
    connections: [Node]!
    floor: Floor
    ui: NodeUI
    updatedAt: String!
    createdAt: String!
    direction: String
  }
`;