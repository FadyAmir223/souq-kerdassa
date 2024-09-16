// TODO: shared package

export async function isAuthenticated(token: string | null) {
  if (!token) return false

  // @ts-expect-error Buffer.from accepts string
  const [username, password] = Buffer.from(token.split(' ')[1], 'base64')
    .toString()
    .split(':')

  if (!password) return false

  return (
    username === process.env.ADMIN_USERNAME &&
    (await encodePassword(password)) === process.env.ADMIN_PASSWORD
  )
}

async function encodePassword(password: string) {
  const arrayBuffer = await crypto.subtle.digest(
    'SHA-512',
    new TextEncoder().encode(password),
  )
  return Buffer.from(arrayBuffer).toString('base64')
}
