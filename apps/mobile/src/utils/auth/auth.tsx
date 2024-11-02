import { useCombinedStore } from '@repo/store/mobile'
import { useRouter } from 'expo-router'

import { api } from '../api'

export const useUser = () => {
  const { data: session, isLoading } = api.auth.getSession.useQuery(undefined, {
    staleTime: Infinity,
    gcTime: Infinity,
  })

  return { user: session?.user ?? null, isLoading }
}

export const useSignOut = () => {
  const signOut = api.auth.signOut.useMutation()
  const deleteToken = useCombinedStore((s) => s.deleteToken)
  const utils = api.useUtils()
  const router = useRouter()

  return async () => {
    const res = await signOut.mutateAsync()
    if (!res.success) return
    if (deleteToken) deleteToken()
    await utils.invalidate()
    router.replace('/')
  }
}
