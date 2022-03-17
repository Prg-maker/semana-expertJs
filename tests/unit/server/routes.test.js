import {jest , expect , describe , test , beforeEach} from '@jest/globals'
import config from '../../../server/config.js'
import { Controller } from '../../../server/controller.js'

const {
  pages,
  location
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



  test.todo(`GET /file.ext - should response with file stream`)
  test.todo(`GET /unknow -  goven an inexist route it should response with 404`)


  describe('exceptions' ,() =>{
    test.todo('given inexisten file it should respond with 404')
    test.todo('given an error it should respond with 500')
  })


} )