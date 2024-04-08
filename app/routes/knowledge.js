const Joi = require('joi')

const { processPayloadFile } = require('../lib/file')
const { listKnowledge, saveKnowledge, updateKnowledgeMetadata } = require('../storage/knowledge-document-repo')

module.exports = [{
  method: 'GET',
  path: '/knowledge',
  options: {
    tags: ['api', 'knowledge'],
    validate: {
      query: Joi.object({
        category: Joi.string().valid('', 'Farming', 'Fishing', 'Environment').default(''),
        orderBy: Joi.string().valid('lastModified', 'createdOn').default('lastModified'),
        orderByDirection: Joi.string().valid('Asc', 'Desc').default('Desc')
      })
    }
  },
  handler: async (request, h) => {
    const { category, orderBy, orderByDirection } = request.query
    const knowledge = await listKnowledge(category, orderBy, orderByDirection)

    return h.response(knowledge).code(200)
  }
},
{
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

    const id = await saveKnowledge(doc, request.headers['content-type'])

    return h.response({ id }).code(201)
  }
},
{
  method: 'PUT',
  path: '/knowledge/{id}',
  options: {
    validate: {
      payload: Joi.object({
        fileName: Joi.string().required(),
        title: Joi.string().required(),
        category: Joi.string().required(),
        source: Joi.string().required()
      })
    }
  },
  handler: async (request, h) => {
    try {
      await updateKnowledgeMetadata(request.params.id, request.payload)
    } catch (err) {
      if (err.code === 'NotFound') {
        return h.response().code(404).takeover()
      }

      throw err
    }

    return h.response().code(200)
  }
}]
