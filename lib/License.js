'use strict'

const md5 = require('md5')
const crypt = require('./encrypt-decrypt')
const errors = require('./errors')
const os = require('./supported')
const moment = require('moment')

/**
 * @class License
 * @type {module.License}
 */
module.exports = class License
{
  /**
   * @constructor
   * @param {object} info User details
   * @param {string} prodCode Product code
   * @param {string} appVersion Application version
   * @param {string} osType Operating System type
   */
  constructor ({ info, prodCode, appVersion = '1.0', osType, validity } = {})
  {
    //
    if (!info || typeof info !== 'object') {
      throw errors('WINFO_MISSING')
    }

    if (!prodCode) {
      throw errors('WPRODCODE_MISSING')
    }

    if (!moment(validity).isValid()) {
      throw errors('VALIDITY_MISSING')
    }

    if (moment(moment.now()).isAfter(validity)) {
      throw errors('EXPIRED_LICENSE')
    }

    // setters
    this._info = info
    this._prodCode = prodCode
    this._appVersion = appVersion
    this._osType = os[osType]
    this.id = null
    this.serial = null
    this._validity = validity?.replace(/\/|-/gim, '')
    this.updateSerial()
  }

  /**
   * @param {object} info User details
   */
  set info (info)
  {
    if (info)
    {
      this._info = info
      this.updateSerial()
    }
  }

  /**
   * @param {string} prodCode Product code
   */
  set prodCode (prodCode)
  {
    if (prodCode)
    {
      this._prodCode = prodCode
      this.updateSerial()
    }
  }

  /**
   * @param {string} appVersion Application version
   */
  set appVersion (appVersion)
  {
    if (appVersion)
    {
      this._appVersion = appVersion
      this.updateSerial()
    }
  }

  /**
   * @param {string} osType Operating System type
   */
  set osType (osType)
  {
    if (osType)
    {
      this._osType = osType
      this.updateSerial()
    }
  }

  /**
   * @param {string} validity License validity
   */
  set validity (validity)
  {
    if (!moment(validity).isValid()) {
      throw errors('VALIDITY_MISSING')
    }

    if (moment(moment.now()).isAfter(validity)) {
      throw errors('EXPIRED_LICENSE')
    }

    this._validity = validity
    this.updateSerial()
  }

  /**
   * update serial number
   */
  updateSerial ()
  {
    const infoData = (
      this._info.name 
      + this._info.country
      + this._info.town
      + this._info.poBox
      + this._info.address
    )

    this.id = generateHash(
      infoData, 
      this._prodCode, 
      this._appVersion, 
      this._osType
    )

    this.serial = createSerial(this.id, this._validity, this._info.secret)
  }

  /**
   * @returns {string} returns serial generated serial number
   */
  getSerial ()
  {
    return this.serial
  }
}

/**
 * @param {string} id id
 * @returns {*} returns generated serial
 */
const createSerial = (id, validity, secret) =>
{
  return generateSerial(id, validity, secret)
}

/**
 * @param {object} info User details
 * @param {string} prodCode Product code
 * @param {string} appVersion Application version
 * @param {string} osType Operating System type
 * @returns {*} returns generated serial
 */
const generateHash = (info, prodCode, appVersion, osType) =>
{
  //
  const userInfo = []
  //
  Object.keys(info).forEach((key) =>
  {
    const val = info[key]
    userInfo.push(val)
  })
  //
  const str = userInfo.join()
  const reg = new RegExp('[^0-9a-zA-Z]+', 'g')
  info = str.replace(reg, '')
  //
  const infoClean = info.toUpperCase()
  //
  const regVr = new RegExp('\\.+', 'g')
  const appVr = appVersion.replace(regVr, '')
  //
  const uniqueOSID = generateOSHash(osType)
  //
  const userInfoStr = infoClean + prodCode + appVr + uniqueOSID
  return (md5(userInfoStr)).toUpperCase()
}

/**
 * create encrypted string
 * @param {string} id id
 * @returns {*} return chunk serial
 */
const generateSerial = (id, validity, secret) =>
{
  if (!validity) {
    throw errors('VALIDITY_MISSING')
  }

  const regKey = crypt.encryptString(id).toString()
  return chunkString(regKey, 4, validity, secret)
}

/**
 * @param {string} str string value
 * @param {int} length length to chunck
 * @returns {string} chunk serial
 */
const chunkString = (str, length, validity, secret) =>
{
  let regEx = new RegExp('.{1,' + length + '}', 'g')
  let newStr = str.match(regEx)
  let validityStr = validity?.replace(/-/gim, '')

  // trim extra
  if (newStr.length > 4) {
    newStr = [
      newStr[0],
      newStr[1],
      generateString(length+2),
      newStr[2],
      newStr[3],
    ]
  }
  //if (newStr.length > 4) newStr.pop()

  //validity mixing string
  newStr[0] = newStr[0] + validityStr[0] + validityStr[4]

  newStr[1] = validityStr[1] + newStr[1] + validityStr[5]

  newStr[3] = validityStr[2] + validityStr[6] + newStr[3]

  newStr[4] = newStr[4] + validityStr[3] + validityStr[7]


  return newStr.join('-').toUpperCase()
}

/**
 * Create merge system params
 * @param {string} osType Operating System type
 * @returns {string} returns merged string
 */
const generateOSHash = (osType) =>
{
  let osHash = ''
  if (osType)
  {
    const strObj = osType.os + osType.type + osType.version
    osHash = strObj.replace('.', '').replace('-', '').toUpperCase()
  }
  return osHash
}

/**
 * Generate random string based on specified length
 * @param {string} length String length
 * @returns {string} returns random string with the specified length
 */
const generateString = (length) => 
{
  const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

  let result = ''
  const charactersLength = characters.length

  for ( let i = 0; i < length; i++ ) {
      result += characters.charAt(
        Math.floor(Math.random() * charactersLength)
      )
  }

  return result
}