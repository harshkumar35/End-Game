// This utility provides a way to work with cookies that's compatible with both
// the app directory and pages directory

// For client-side cookie access
export function getClientCookies() {
  if (typeof document === "undefined") {
    return {}
  }

  return document.cookie.split(";").reduce(
    (cookies, cookie) => {
      const [name, value] = cookie.split("=").map((c) => c.trim())
      if (name && value) {
        cookies[name] = decodeURIComponent(value)
      }
      return cookies
    },
    {} as Record<string, string>,
  )
}

// For server-side cookie access in getServerSideProps
export function getServerCookies(req: any) {
  return req.cookies || {}
}

// For setting cookies that works in both client and server
export function setCookie(
  name: string,
  value: string,
  options: {
    expires?: Date
    path?: string
    secure?: boolean
    httpOnly?: boolean
  } = {},
) {
  if (typeof document === "undefined") {
    // We're on the server, can't set cookies directly
    return
  }

  const cookieOptions = [
    `${name}=${encodeURIComponent(value)}`,
    options.path ? `path=${options.path}` : "path=/",
    options.expires ? `expires=${options.expires.toUTCString()}` : "",
    options.secure ? "secure" : "",
    options.httpOnly ? "httpOnly" : "",
  ]
    .filter(Boolean)
    .join("; ")

  document.cookie = cookieOptions
}
