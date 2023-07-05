'use strict'

/* Dev libs */
const chai = require('chai')
const expect = chai.expect

/* source */
const LicenseGen = require('../lib')

var license
const userInfo = {
  name: '3MLogics',
  country: 'Cameroon',
  town: 'Douala',
  zip: '8388',
  address: 'Akwa',
  // other infos
}

describe('createLicense', () =>
{
  console.time('createLicense')
  it('return proper license', () =>
  {
    const userData = { 
      info: userInfo, 
      validity: "2028-01-01",
      prodCode: 'LEN100120',
      appVersion: '1.5',
      osType: 'IOS8'
    }
    license = LicenseGen.createLicense(userData)

    expect(license).to.be.an('object')
    expect(license).to.have.property('message', 'ok')
    expect(license).to.have.property('errorCode', 0)
    //expect(license).to.have.property('license').that.length(33)
    console.log(license)
  })
  console.timeEnd('createLicense')
})


describe('validateLicense', () =>
{
  console.time('validateLicense')
  it('validate license', () =>
  {
    const userData = { 
      info: userInfo, 
      prodCode: 'LEN100120',
      appVersion: '1.5',
      osType: 'IOS8'
    }
    const validity = LicenseGen.validateLicense(userData, license?.license)

    expect(validity).to.be.an('object')
    expect(validity).to.have.property('message', 'ok')
    expect(validity).to.have.property('errorCode', 0)
    //console.log(validity)
  })
  console.timeEnd('validateLicense')
})