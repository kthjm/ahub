export const throws = (err) => {
  throw typeof err === 'string'
  ? new Error(err)
  : err
}

export const asserts = (condition, message) =>
  !condition && throws(message)

export const num2arr = (num) => {
  const arr = []
  for (let i = 0; i < num; i++) arr.push(i)
  return arr
}

export const arr2nesty = (array, length) => array.reduce((a, c) =>
  (a[a.length - 1].length === length ? a.push([c]) : a[a.length - 1].push(c)) && a,
  [[]]
)