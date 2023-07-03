'use strict'

const License = require('./License')
const errors = require('./errors')

/**
 * @param {object} licenseData User data
 * @param {string} serial serial to validate
 * @returns {{errorCode: number, message: string}|object} validated object
 */
module.exports = (licenseData, serial) => {
  /* error if missing user info */
  if (!licenseData) throw errors('WINFO_MISSING')
  if (!serial || typeof serial !== 'string') throw errors('WNOT_STRING')

  let extractedSerial = ''
  let validity = ''

  //extract validity from serial
  extractedSerial = serial.split('-')

  if (extractedSerial.length !== 4) {
    throw errors('INVALID_LICENSE_LENGTH')
  }

  function removeByIndex(str,index) {
    return str.slice(0,index) + str.slice(index+1)
  }

  validity += extractedSerial[0].charAt(4)
  extractedSerial[0] = removeByIndex(extractedSerial[0], 4)
  validity += extractedSerial[1].charAt(0)
  extractedSerial[1] = removeByIndex(extractedSerial[1], 0)
  validity += extractedSerial[2].charAt(0)
  extractedSerial[2] = removeByIndex(extractedSerial[2], 0)
  validity += extractedSerial[3].charAt(4)
  extractedSerial[3] = removeByIndex(extractedSerial[3], 4)

  validity += '-'

  validity += extractedSerial[0].charAt(4)
  extractedSerial[0] = removeByIndex(extractedSerial[0], 4)
  validity += extractedSerial[1].charAt(4)
  extractedSerial[1] = removeByIndex(extractedSerial[1], 4)

  validity += '-'

  validity += extractedSerial[2].charAt(0)
  extractedSerial[2] = removeByIndex(extractedSerial[2], 0)
  validity += extractedSerial[3].charAt(4)
  extractedSerial[3] = removeByIndex(extractedSerial[3], 4)
  
  const license = new License({ ...licenseData, validity })

  if (license.serial === serial)
  {
    let errros = errors()
    return { ...errros, validity, ...license }
  }
  throw errors('NOT_VALID')
}
