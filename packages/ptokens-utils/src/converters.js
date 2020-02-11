const UINT32_MAX = Math.pow(2, 32)

/**
 * @param {Buffer} buffer
 */
const decodeUint64le = buffer => {
  const rem = buffer.readUInt32LE(0)
  const top = buffer.readUInt32LE(4)

  return top * UINT32_MAX + rem
}

/**
 * @param {Number} number
 */
const encodeUint64le = number => {
  const buffer = Buffer.alloc(8)

  const top = Math.floor(number / UINT32_MAX)
  const rem = number - top * UINT32_MAX

  buffer.writeUInt32LE(rem, 0)
  buffer.writeUInt32LE(top, 4)

  return buffer
}

export { decodeUint64le, encodeUint64le }
