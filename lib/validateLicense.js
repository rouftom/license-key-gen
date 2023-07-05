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

  if (!serial || typeof serial !== 'string') {
    throw errors('WNOT_STRING')
  }

  // Validity date of the license
  let validity = ''
  // Splitted license parts
  let serialTab = serial.split('-')

  let extractedSerial = Array.from(serialTab)
  extractedSerial.splice(2, 1)
  extractedSerial = extractedSerial.join('-')

  if (serialTab.length !== 5) {
    throw errors('INVALID_LICENSE_LENGTH')
  }

  function removeByIndex(str,index) {
    return str.slice(0, index) + str.slice(index+1)
  }

  validity += serialTab[0].charAt(4)
  serialTab[0] = removeByIndex(serialTab[0], 4)
  validity += serialTab[1].charAt(0)
  serialTab[1] = removeByIndex(serialTab[1], 0)
  validity += serialTab[3].charAt(0)
  serialTab[2] = removeByIndex(serialTab[3], 0)
  validity += serialTab[4].charAt(4)
  serialTab[3] = removeByIndex(serialTab[4], 4)

  validity += '-'

  validity += serialTab[0].charAt(4)
  serialTab[0] = removeByIndex(serialTab[0], 4)
  validity += serialTab[1].charAt(4)
  serialTab[1] = removeByIndex(serialTab[1], 4)

  validity += '-'

  validity += serialTab[2].charAt(0)
  serialTab[2] = removeByIndex(serialTab[3], 0)
  validity += serialTab[4].charAt(5)
  serialTab[4] = removeByIndex(serialTab[4], 4)
  
  const license = new License({ ...licenseData, validity })

  let calculedLicense = license.serial.split('-')
  calculedLicense.splice(2, 1)
  calculedLicense = calculedLicense.join('-')

  if (calculedLicense === extractedSerial) {
    let errros = errors()

    return { ...errros, validity, ...license }
  }
  
  throw errors('NOT_VALID')
}
