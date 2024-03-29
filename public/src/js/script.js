// TO DO:
// I have response.items visible on local and remote repositories. Now I have to figure out how to get the data itself

const contentful = require('contentful')
const addContent = require('./addContent.js')

const client = contentful.createClient({
  space: '321b739feokm',
  environment: 'master', // defaults to 'master' if not set
  accessToken: 'vjvHhmdNkUZVDfDDWDErJmqHBa4JEVRUtNb2Yekry5U'
})

client.getContentTypes()
.then((response) => {addContent(response.items)})
.catch(console.error)