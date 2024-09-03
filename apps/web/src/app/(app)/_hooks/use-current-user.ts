import { useSession } from 'next-auth/react'

export function useCurrentUser() {
  const { data } = useSession()

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (data?.user === null)
    throw new Error('useCurrentUser must be used within SessionProvider')

  return data?.user
}
