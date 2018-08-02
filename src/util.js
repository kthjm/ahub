export const throws = (message) => { throw new Error(message) }
export const asserts = (condition, message) => !condition && throws(message)