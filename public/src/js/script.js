const contentful = require('contentful')

const client = contentful.createClient({
  space: '321b739feokm',
  environment: 'master', // defaults to 'master' if not set
  accessToken: 'vjvHhmdNkUZVDfDDWDErJmqHBa4JEVRUtNb2Yekry5U'
})

client.getContentTypes()
.then((response) => {printData(response.items)})
.catch(console.error)

function printData(data) {
  console.log(data);
}