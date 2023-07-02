[![Build Status](https://travis-ci.org/rouftom/license-keygen-next.svg?branch=main)](https://travis-ci.org/rouftom/license-keygen-next)

# This project is a fork of [license-key-gen](https://www.webisto.tech)

## The particularity of this library compared to license-key-gen is that the latter incorporates the concept of validity which allows the license to have an expiration date without being checked by a remote server.

# license-keygen-next
- Generate license keys for given company details
- The [license-keygen-next](https://www.webisto.tech) library exported as [Node.js](https:nodejs.org/) modules.

## Source
This project has been imported from [license-keygen-next](https://www.npmjs.com/package/license-keygen-next) in npm.org.

## Docs

Generate a License Key and validate the license. This is typically used for software licensing (serial number).

## Installation
```
npm install license-keygen-next
```

## Data Structure
To create a license key - Enter the users information that your are able to recieve

This object can be any data you wish to tie the license to - format Object
```
var userInfo = {
  company: '3MLogics',
  country: 'Cameroon',
  region: 'Littoral',
  division: 'Wouri',
  subDivision: 'Douala 1er',
  town: 'Douala',
  zip: '54875'
}
```
Must include:
1) ProductCode (string) - product abbr name, can be any size
2) AppVersion (string) - optional if you want to tie the license to a version number
3) osType (string) - lock the license to a specific operating system
   supported:
   Windows: WIN, WIN7, WIN8,WIN10
   Macintosh: OSX, OSX1, OSX2, OSX3, OSX4, OSX5, OSX6, OSX7, OSX8, OSX9, OSX10, OSX11, OSX12
   Apple Mobile: IOS, IOS5, IOS6, IOS7, IOS8, IOS9,IOS10
   Google Mobile: ANDROID, ANDROID2, ANDROID3, ANDROID4, ANDROID43, ANDROID44, ANDROID5, ANDROID6, ANDROID7
   OTHER
4) validity (string) - license expiration date   

```
var userLicense = {
  info: userInfo, 
  validity: '2027-01-01',
  prodCode:"LEN100120", 
  appVersion:"1.5", 
  osType:'IOS8'
} 
```

## Init
```
var licenseKey = require('license-keygen-next');
```

## Create a License Key
Then run the following code to recieve the License for the client
This function to be run ONLY for you to generate the license code for the client
```
var licenseKey = require('license-keygen-next');

var userInfo = {
  company: '3MLogics',
  country: 'Cameroon',
  region: 'Littoral',
  division: 'Wouri',
  subDivision: 'Douala 1er',
  town: 'Douala',
  zip: '54875'
}

var licenseData = {
  info: userInfo, 
  validity: '2027-01-01',
  prodCode:"LEN100120", 
  appVersion:"1.5", 
  osType:'IOS8'
}

try{
    var license = licenseKey.createLicense(licenseData)
    console.log(license);
}catch(err){
    console.log(err);
}
```

if success returns
```
{ errorCode: 0,  message: 'ok',  license: '671S20-0F10Y7-23T6Y3-CI4D30' }
```

if error, returns
```
{ errorCode: 1002, message: 'product code missing' }
```

## Validate a License Key
On client side your application will pass the user information (Data Structure) and License Key:
```
var licenseKey = require('license-keygen-next');

var userInfo = {
  company: '3MLogics',
  country: 'Cameroon',
  region: 'Littoral',
  division: 'Wouri',
  subDivision: 'Douala 1er',
  town: 'Douala',
  zip: '54875'
}

var licenseData = {
  info: userInfo, 
  prodCode: "LEN100120", 
  appVersion: "1.5", 
  osType: 'IOS8'
}

try{
    var license = 
      licenseKey
      .validateLicense(licenseData, "671S20-0F10Y7-23T6Y3-CI4D30");
      
    console.log(license);
}catch(err){
    console.log(err);
}
```
if success returns
```
{ errorCode: 0, message: 'ok' }
```

if error, returns
```
{ errorCode: 1006, message: 'license not valid' }
```

## TODO
- maintain (save, delete, update, read) licenses and user registration information

## Support
Tested in Chrome 53-54, Firefox 48-49, IE 11, Edge 14, Safari 9-10, Node.js 6-7, & PhantomJS 2.1.1.<br>
Automated test runs are available.
