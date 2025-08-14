import type { Request, Response } from 'express'
import type { Controller } from '../controller'
import type { HttpResponse } from '../http-response'
import { logs } from '../logs'

type CallbackInterceptRoute = (
  httpResponse: HttpResponse,
  response: Response
) => unknown | Promise<unknown>

export const adaptRoute = (
  controller: Controller,
  callback?: CallbackInterceptRoute
) => {
  return async (
    { originalUrl, ip, method, ...request }: Request,
    response: Response
  ) => {
    const requestData = {
      ...request.body,
      ...request.params,
      ...request.query,
      currentUserId: request.userId
    }

    const httpResponse = await controller.handle(requestData)

    if (method !== 'GET') {
      logs(
        {
          originalUrl,
          ip,
          method,
          request: {
            ...request
          }
        },
        { httpResponse }
      )
    }

    if (callback) {
      /** Callback to intercept the response */
      return await callback(httpResponse, response)
    }

    return response.status(httpResponse.statusCode).json(httpResponse.body)
  }
}
