// We have not yet strictly defined roles
// So in the meantime I'll create a function that checks if a user role is allowed before continuing

import { $$asyncIterator } from "iterall"

export function withAuthorisation(
  asyncIteratorFn,
  allowedRoles
) {
  return (args, context, info) => {
    allowedRoles = new Set(allowedRoles)

    if (context?.user) for (const role of context.user.roles) {
      if (allowedRoles.has(role)) {
        return asyncIteratorFn(args, context, info)
      }
    }

    // If we get here, the user is not allowed
    const asyncIterator2 = {
      next() {
        return Promise.resolve({ done: true })
      },
      return() {
        return Promise.resolve({ done: true })
      },
      throw(error) {
        return Promise.resolve({ done: true })
      },
      [$$asyncIterator]() {
        return this
      }
    }
    return asyncIterator2
  }
}