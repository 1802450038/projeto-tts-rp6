import { StatusCodes } from 'http-status-codes'

export type HttpResponse = {
  statusCode: number
  body: any
}

export type Response = {
  type?: 'info' | 'success' | 'warn' | 'error'
  message?: string
}

type DTO<T> = Response & T

export function ok<T>(dto?: DTO<T>): HttpResponse {
  return {
    statusCode: StatusCodes.OK,
    body: {
      type: dto?.type ?? 'success',
      message: dto?.message,
      ...dto
    }
  }
}

export function created(response?: Response): HttpResponse {
  return {
    statusCode: StatusCodes.CREATED,
    body: {
      type: response?.type ?? 'success',
      message: response?.message
    }
  }
}

export function clientError<T>(dto?: DTO<T>): HttpResponse {
  return {
    statusCode: StatusCodes.BAD_REQUEST,
    body: {
      type: dto?.type ?? 'error',
      message: dto?.message,
      ...dto
    }
  }
}

export function unauthorized(response?: Response): HttpResponse {
  return {
    statusCode: StatusCodes.UNAUTHORIZED,
    body: {
      type: response?.type ?? 'error',
      message: response?.message
    }
  }
}

export function forbidden(response?: Response): HttpResponse {
  return {
    statusCode: StatusCodes.FORBIDDEN,
    body: {
      type: response?.type ?? 'error',
      message: response?.message
    }
  }
}

export function notFound(response?: Response): HttpResponse {
  return {
    statusCode: StatusCodes.NOT_FOUND,
    body: {
      type: response?.type ?? 'error',
      message: response?.message
    }
  }
}

export function conflict(response?: Response): HttpResponse {
  return {
    statusCode: StatusCodes.CONFLICT,
    body: {
      type: response?.type ?? 'info',
      message: response?.message
    }
  }
}

export function tooMany(response?: Response): HttpResponse {
  return {
    statusCode: StatusCodes.TOO_MANY_REQUESTS,
    body: {
      type: response?.type ?? 'error',
      message: response?.message
    }
  }
}

export function fail(response?: Response) {
  return {
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    body: {
      type: response?.type ?? 'error',
      message: response?.message
    }
  }
}
