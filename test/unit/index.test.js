const mockStart = jest.fn()

jest.mock('../../app/server', () =>
  jest.fn().mockResolvedValue({
    start: mockStart,
    info: {
      uri: 'server-uri'
    }
  })
)

jest.mock('../../app/messaging', () => {
  return {
    start: jest.fn(),
    stop: jest.fn()
  }
})

jest.mock('../../app/storage/knowledge-document-repo')

jest.mock('../../app/plugins/router', () => {
  return {
    plugin: {
      name: 'router',
      register: (server, _) => {
        server.route([])
      }
    }
  }
})

const createServer = require('../../app/server')

describe('Server setup', () => {
  let spyExit
  let spyError

  beforeEach(() => {
    jest.clearAllMocks()
    spyExit = jest.spyOn(process, 'exit').mockImplementation(() => {})
    spyError = jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    spyExit.mockRestore()
    spyError.mockRestore()
  })

  test('start the server', async () => {
    await require('../../app/index')
    expect(createServer).toHaveBeenCalled()
  })

  test('should log error and exit process when server start fails', async () => {
    const err = new Error('Server start failed')
    createServer.mockResolvedValue({
      start: jest.fn().mockRejectedValue(err),
      info: { uri: 'http://localhost' }
    })
    require('../../app/index')
  })
})
