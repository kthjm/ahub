export const SRC = '.'
export const DEST = '.site'
export const CONFIG = 'tuft.json'
export const throws = (message) => { throw new Error(message) }
export const asserts = (condition, message) => !condition && throws(message)