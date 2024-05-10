'use strict'

/**
 * @param {string} err error description
 * @returns {{errorCode: number, message: string}} returns error object
 */
module.exports = (err = 0) =>
{
  let message
  let errNum = 0

  if (err)
  {
    // find err
    const errorTypes = {
      OK: 0,
      WINFO_MISSING: 1000,
      WPRODCODE_MISSING: 1002,
      WNOT_STRING: 1004,
      NOT_VALID: 1006,
      WLICENSE_FAILED: 1008,
      WUNKNOWN: 1010,
      ENCRYPT_ERROR: 1012,
      DECRYPT_ERROR: 1014,
      EXPIRED_LICENSE: 1016,
      VALIDITY_MISSING: 1018,
      QUANTITY_MISSING: 1019,
      INVALID_LICENSE_LENGTH: 1020,
    }
    errNum = errorTypes[err]
  }

  const errorObject = { errorCode: errNum, message: '' }

  switch (errNum)
  {
  case 0:
    message = 'ok'
    break
  case 1000:
    message = 'user info missing'
    break
  case 1002:
    message = 'product code missing'
    break
  case 1004:
    message = 'license must be a string'
    break
  case 1006:
    message = 'license not valid'
    break
  case 1008:
    message = 'no encryption key provided'
    break
  case 1010:
    message = 'license generation failed'
    break
  case 1012:
    message = 'encryption error'
    break
  case 1014:
    message = 'decryption error'
    break
  case 1016:
    message = 'license has expired'
    break
  case 1018:
    message = 'no validity detected'
    break
  case 1019:
    message = 'no quantity detected'
    break
  case 1020:
    message = 'license length is invalid'
    break
  default:
    message = 'no idea'
  }
  errorObject.message = message
  return errorObject
}
