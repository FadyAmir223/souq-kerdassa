import { zodResolver } from '@hookform/resolvers/zod'
import { useCombinedStore } from '@repo/store/mobile'
import type { RegisterFormSchema } from '@repo/validators'
import { registerFormSchema } from '@repo/validators'
import { Link, useLocalSearchParams, useRouter } from 'expo-router'
import { Controller, useForm } from 'react-hook-form'
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from 'react-native'
import Toast from 'react-native-toast-message'

import { api } from '@/utils/api'
import { setToken } from '@/utils/auth/session-store'
import { PLACEHOLDER, SEARCH_PARAMS } from '@/utils/constants'

const inputs = [
  {
    label: 'الاسم بالكامل',
    name: 'name',
    placeholder: PLACEHOLDER.form.name,
  },
  {
    keyboardType: 'numeric',
    label: 'رقم التليفون',
    name: 'phone',
    placeholder: PLACEHOLDER.form.phone,
    autoComplete: 'off',
  },
  {
    secureTextEntry: true,
    label: 'كلمة السر',
    name: 'password',
    placeholder: PLACEHOLDER.form.password,
    autoComplete: 'new-password',
  },
  {
    secureTextEntry: true,
    label: 'تأكيد كلمة السر',
    name: 'confirmPassword',
    placeholder: PLACEHOLDER.form.password,
    autoComplete: 'new-password',
  },
] as const

export default function ProfileScreen() {
  const searchParams = useLocalSearchParams<{ redirectTo?: string }>()
  const utils = api.useUtils()
  const router = useRouter()
  const toggleLoggedIn = useCombinedStore((s) => s.toggleLoggedIn)

  const {
    control,
    getValues,
    trigger,
    formState: { errors },
  } = useForm<RegisterFormSchema>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  })

  const registerUser = api.auth.register.useMutation({
    onSuccess: async ({ success, sessionId }) => {
      if (!success || !sessionId) return
      setToken(sessionId)
      toggleLoggedIn()

      try {
        await utils.auth.getSession.refetch()

        // @ts-expect-error redirectTo is valid route
        // searchParams.redirectTo ??
        router.replace('/(account)/')
      } catch {
        Toast.show({
          type: 'error',
          text1: 'حدث خطأ',
          text1Style: { fontSize: 18 },
          position: 'bottom',
        })
      }
    },
    onError: ({ message }) => {
      Toast.show({
        type: 'error',
        text1: message,
        text1Style: { fontSize: 18 },
        position: 'bottom',
      })
    },
    trpc: {
      context: {
        skipStream: true,
      },
    },
  })

  const handleSubmit = async () => {
    const result = await trigger()
    if (!result) return

    registerUser.mutate(getValues())
  }

  return (
    <SafeAreaView>
      <KeyboardAvoidingView
        behavior='padding'
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <ScrollView
          className='mx-4'
          style={Platform.select({
            android: {
              marginTop: StatusBar.currentHeight,
            },
          })}
        >
          <Text className='mb-5 self-start text-3xl font-bold'>إنشاء حساب</Text>

          <View className='gap-y-2.5'>
            {inputs.map(({ name, label, ...props }) => (
              <Controller
                key={name}
                control={control}
                name={name}
                render={({ field: { value, onChange, onBlur } }) => (
                  <View>
                    <Text className='mb-2 self-start text-2xl font-semibold'>
                      {label}
                    </Text>
                    <TextInput
                      className='mb-1 w-full rounded-md border border-black px-4 py-1.5 text-right text-2xl'
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      autoCorrect={false}
                      autoCapitalize='none'
                      {...props}
                    />
                    <Text className='h-6 self-start text-xl font-semibold text-destructive'>
                      {errors[name]?.message}
                    </Text>
                  </View>
                )}
              />
            ))}

            <Pressable
              className='self-start rounded-md bg-primary px-4 py-2 shadow-md disabled:opacity-60'
              onPress={handleSubmit}
              disabled={registerUser.isPending}
            >
              <Text className='text-2xl text-white'>إنشاء حساب</Text>
            </Pressable>
          </View>

          <View className='mt-6 flex-row items-center gap-x-3'>
            <Text className='me-4 text-[1.375rem] font-semibold'>
              لديك حساب بالفعل؟
            </Text>
            <Link
              href={`/login?${SEARCH_PARAMS.redirectTo}=${searchParams.redirectTo}`}
              className='text-[1.375rem] text-primary'
            >
              تسجيل الدخول
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
