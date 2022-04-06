import type { RequestResult } from '../../types/server'

export default async function resultAssert<T>(resPromise: Promise<RequestResult<T>>): Promise<RequestResult<T>['data']> {
  const result = await resPromise
  if (result.code !== 0) {
    throw new Error(result.message);
  }
  return result.data
}
