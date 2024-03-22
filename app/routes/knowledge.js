const { processPayloadFile } = require("../lib/file")
const { saveDocument } = require("../storage/knowledge-document-repo")

module.exports = [{
  method: 'POST',
  path: '/knowledge',
  options: {
    payload: {
      parse: false,
      output: 'stream',
      allow: [
        'application/msword',
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ],
      maxBytes: 5 * 1000 * 1000
    }
  },
  handler: async (request, h) => {
    const doc = await processPayloadFile(request.payload)

    const id = await saveDocument(doc)

    return h.response({ id }).code(201)
  }
},
{
  method: 'PUT',
  path: '/knowledge/{id}',
  handler: (request, h) => {
    return h.response().code(200)
  }
}]
