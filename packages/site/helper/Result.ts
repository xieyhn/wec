import Code from './Code'
import { RequestResult } from '../types/server'

class Result {
  static success<T>(data: T): RequestResult<T> {
    return {
      code: Code.Success,
      data,
    }
  }

  static fail(error: Error): RequestResult<null> {
    return {
      code: Code.Fail,
      data: null,
      message: error.message
    }
  }
}

export default Result