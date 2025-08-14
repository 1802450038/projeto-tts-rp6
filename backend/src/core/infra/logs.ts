import { blue, gray, green, white, yellow } from 'console-log-colors'

type Request = {
  originalUrl?: string
  ip?: string
  method?: string
  request?: any
}

type Response = {
  httpResponse?: any
}

export const logs = (
  { originalUrl, ip, method, request }: Request,
  { httpResponse }: Response
) => {
  const body = request.body

  for (const [key, value] of Object.entries(body)) {
    if (
      key.toLowerCase().includes('password') ||
      key === 'password' ||
      key === 'confirmPassword'
    ) {
      body[key] = undefined
      continue
    }

    if (typeof value === 'string') {
      body[key] = value as string
    }
  }

  console.log(
    `[${ip}] ${green(
      `${method} ${originalUrl} ${yellow(`STATUS ${httpResponse.statusCode}`)} ${blue(`USER ${request.userId}`)} ${gray(`DATA ${JSON.stringify(body)}`)} ${white(`REQUESTED AT ${new Date().toLocaleString()}`)}`
    )}`
  )
}
