const contentful = require('../node_modules/contentful')

const client = contentful.createClient({
  space: 'Ltrcse0noMvfu2VRf0xOt',
  environment: 'master', // defaults to 'master' if not set
  accessToken: 'CFPAT-rcEb7TOXipMS7xLRYlW2ScaYBasuOg7Db9z_YNXMJ1o'
})

client.getContentTypes()
.then((response) => console.log(response.items))
.catch(console.error)