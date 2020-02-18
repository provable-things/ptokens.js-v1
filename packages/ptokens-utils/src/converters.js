const UINT32_MAX = Math.pow(2, 32)

/**
 * @param {Buffer} _buffer
 */
const decodeUint64le = _buffer => {
  const rem = _buffer.readUInt32LE(0)
  const top = _buffer.readUInt32LE(4)

  return top * UINT32_MAX + rem
}

/**
 * @param {Number} _number
 */
const encodeUint64le = _number => {
  const buffer = Buffer.alloc(8)

  const top = Math.floor(_number / UINT32_MAX)
  const rem = _number - top * UINT32_MAX

  buffer.writeUInt32LE(rem, 0)
  buffer.writeUInt32LE(top, 4)

  return buffer
}

export { decodeUint64le, encodeUint64le }
