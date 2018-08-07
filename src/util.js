export const throws = (err) => {
  throw typeof err === 'string'
  ? new Error(err)
  : err
}

export const asserts = (condition, message) =>
  !condition && throws(message)