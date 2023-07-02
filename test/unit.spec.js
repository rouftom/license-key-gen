'use strict'

/* Dev libs */
const chai = require('chai')
const expect = chai.expect

/* source */
const LicenseGen = require('../lib')

var license
const userInfo = {
  company: '3MLogics',
  country: 'Cameroon',
  region: 'Littoral',
  division: 'Wouri',
  subDivision: 'Douala 1er',
  town: 'Douala',
  zip: '54875'
}

describe('createLicense', () =>
{
  console.time('createLicense')
  it('return proper license', () =>
  {
    const userData = { 
      info: userInfo, 
      validity: "2023-07-30",
      prodCode: '3ML001', 
      //appVersion: '1.0'
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
      prodCode: '3ML001', 
      //appVersion: '1.0'
    }
    const validity = LicenseGen.validateLicense(userData, license?.license)

    expect(validity).to.be.an('object')
    expect(validity).to.have.property('message', 'ok')
    expect(validity).to.have.property('errorCode', 0)
  })
  console.timeEnd('validateLicense')
})