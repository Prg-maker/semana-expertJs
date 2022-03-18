import {jest , expect , describe , test , beforeEach} from '@jest/globals'
import config from '../../../server/config.js'
import { Controller } from '../../../server/controller.js'

const {
  pages,
  location,
  constants:{
    CONTENT_TYPE
  }
} = config

import {handler} from '../../../server/routes.js'
import TestUtil from '../_util/testUtil.js'

describe("#Routes - test site for api response", ()=> {

  beforeEach(()=> {
    jest.restoreAllMocks()
    jest.clearAllMocks()
  })



  test('GET / - should redirect to home page' , async  ()=> {


    const parms = TestUtil.defautlHandleParms()
    parms.request.method = "GET"
    parms.request.url = "/"


    await handler(...parms.values())

    expect(parms.response.writeHead).toBeCalledWith(
      302,
      {
        "Location": location.home
      }
    )
    expect(parms.response.end).toHaveBeenCalled()

  })
  test(`GET /home - should response with ${pages.homeHTML} file stream`, async  ()=> {


    const parms = TestUtil.defautlHandleParms()
    parms.request.method = "GET"
    parms.request.url = "/home"

    const mockFileStream = TestUtil.generateReadableStream(['data'])

    jest.spyOn(
      Controller.prototype,
      Controller.prototype.getFileStream.name,

    ).mockResolvedValue({
      stream:mockFileStream
    })

    jest.spyOn(
      mockFileStream,
      'pipe',

    ).mockReturnValue()



    await handler(...parms.values())

    expect(Controller.prototype.getFileStream).toBeCalledWith(pages.homeHTML)
    expect(mockFileStream.pipe).toHaveBeenCalledWith(parms.response)


  })


  test(`GET /controller - should response with ${pages.controllerTML} file stream`, async  ()=> {


    const parms = TestUtil.defautlHandleParms()
    parms.request.method = "GET"
    parms.request.url = "/controller"

    const mockFileStream = TestUtil.generateReadableStream(['data'])

    jest.spyOn(
      Controller.prototype,
      Controller.prototype.getFileStream.name,

    ).mockResolvedValue({
      stream:mockFileStream
    })

    jest.spyOn(
      mockFileStream,
      'pipe',

    ).mockReturnValue()



    await handler(...parms.values())

    expect(Controller.prototype.getFileStream).toBeCalledWith(pages.controllerTML)
    expect(mockFileStream.pipe).toHaveBeenCalledWith(parms.response)


  })

  test(`GET /index.html - should response with file stream` , async  ()=> {

    const parms = TestUtil.defautlHandleParms()
    const fileName = 'index.html'

    parms.request.method = "GET"
    parms.request.url = fileName
    const expectType = '.html'

    const mockFileStream = TestUtil.generateReadableStream(['data'])

    jest.spyOn(
      Controller.prototype,
      Controller.prototype.getFileStream.name,

    ).mockResolvedValue({
      stream:mockFileStream,
      type:expectType
    })

    jest.spyOn(
      mockFileStream,
      'pipe',

    ).mockReturnValue()



    await handler(...parms.values())

    expect(Controller.prototype.getFileStream).toBeCalledWith(fileName)
    expect(mockFileStream.pipe).toHaveBeenCalledWith(parms.response)
    expect(parms.response.writeHead).toHaveBeenCalledWith(
      200,
      {
        'Content-type': CONTENT_TYPE[expectType]
      }
    )


  })


  test(`GET /file.ext - should response with file stream` , async  ()=> {

    const parms = TestUtil.defautlHandleParms()
    const fileName = 'file.ext'

    parms.request.method = "GET"
    parms.request.url = fileName
    const expectType = '.ext'

    const mockFileStream = TestUtil.generateReadableStream(['data'])

    jest.spyOn(
      Controller.prototype,
      Controller.prototype.getFileStream.name,

    ).mockResolvedValue({
      stream:mockFileStream,
      type:expectType
    })

    jest.spyOn(
      mockFileStream,
      'pipe',

    ).mockReturnValue()



    await handler(...parms.values())

    expect(Controller.prototype.getFileStream).toBeCalledWith(fileName)
    expect(mockFileStream.pipe).toHaveBeenCalledWith(parms.response)
    expect(parms.response.writeHead).not.toHaveBeenCalled()


  })



  test(`POST /unknow -  goven an inexist route it should response with 500`, async  ()=> {

    const parms = TestUtil.defautlHandleParms()

    parms.request.method = "GET"
    parms.request.url = '/unknow'




    await handler(...parms.values())


  
    expect(parms.response.writeHead).toHaveBeenCalledWith(500)
    expect(parms.response.end).toHaveBeenCalledWith()

  })


  describe('exceptions' ,() =>{
    test('given inexisten file it should respond with 404', async ()=> {
      const parms = TestUtil.defautlHandleParms()

      parms.request.method = "GET"
      parms.request.url = '/index.png'


      jest.spyOn(
        Controller.prototype,
        Controller.prototype.getFileStream.name
      ).mockRejectedValue(new Error('Error: ENOENT: no such file or directy'))
  
  
  
  
      await handler(...parms.values())
  
  
    
      expect(parms.response.writeHead).toHaveBeenCalledWith(500)
      expect(parms.response.end).toHaveBeenCalledWith()
  
    })
    test('given an error it should respond with 500' ,  async ()=> {
      const parms = TestUtil.defautlHandleParms()

      parms.request.method = "GET"
      parms.request.url = '/index.png'


      jest.spyOn(
        Controller.prototype,
        Controller.prototype.getFileStream.name
      ).mockRejectedValue(new Error('Error'))
  
  
  
  
      await handler(...parms.values())
  
  
    
      expect(parms.response.writeHead).toHaveBeenCalledWith(500)
      expect(parms.response.end).toHaveBeenCalledWith()
  
    })
  })


} )