

export const createNodeInput = {
  schema: `
  input CreateNodeInput {
    name: String!
    state: String!
    isExit: Boolean!
    ui: NodeUIInput!
    connections: [NodeReferenceInput]
  }
`
};
export const nodeReferenceInput = {
  schema: `
  input NodeReferenceInput {
    name: String!
    id: String
    direction: String!
  }
`
};
export const updateNodeInput = {
  schema: `
  input UpdateNodeInput {
    id: ID
    name: String!
    state: String
    isExit: Boolean
    ui: NodeUIInput
    connections: [NodeReferenceInput]
    operation: String
  }
`
  // I need operation so I can know what to do with the node
  // Default is create
};
