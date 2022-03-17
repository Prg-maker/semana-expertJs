import {
  jest
} from '@jest/globals'
import {
  Readable,
  Writable
} from 'stream'


export default class TestUtil{


  static generateReadableStream(data){
    return new Readable({
      read(){


        for(const item of data){
          this.push(item)
        }
        
        this.push(null)

      }
    })
  }


  static generateWritableStream(onDate){
    return new Writable({
      write(chunk , enc , cb){
        
        onDate(chunk)

        cb(null , chunk)
      }
    })
  }


  static defautlHandleParms(){

    const requestStream = TestUtil.generateReadableStream(['body data requisiçao'])
    const response = TestUtil.generateWritableStream(()=> {})

    const data = {
      request: Object.assign(requestStream  , {
        headers:{},
        method:'',
        url:''
      }),
      response: Object.assign( response , {
        writeHead:jest.fn(),
        end: jest.fn()
      }),
    }



    return {
      values: ()=> Object.values(data),
      ...data,
    }

  }
}