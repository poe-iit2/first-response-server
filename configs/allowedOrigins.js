const allowedOrigins = []

export function getAllowedOrigins() {
  if (allowedOrigins.length !== 0) return allowedOrigins

  if (process.env.NODE_ENV === 'production') {
    allowedOrigins.push('https://first-response-website.onrender.com')
  }

  if (process.env.NODE_ENV === 'development') {
    allowedOrigins.push('http://localhost:5173')
  }

  return allowedOrigins
}