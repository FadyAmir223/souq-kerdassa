import { zodResolver } from '@hookform/resolvers/zod'
import type { EditProfileSchema } from '@repo/validators'
import { editProfileSchema } from '@repo/validators'
import { Controller, useForm } from 'react-hook-form'
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native'
import Toast from 'react-native-toast-message'

import { api } from '@/utils/api'
import { useSignOut, useUser } from '@/utils/auth/auth'
import { PLACEHOLDER } from '@/utils/constants'

const inputs = [
  {
    label: 'الاسم بالكامل',
    name: 'name',
    placeholder: PLACEHOLDER.form.name,
  },
  {
    label: 'رقم التليفون',
    name: 'phone',
    placeholder: PLACEHOLDER.form.phone,
  },
] as const

export default function ProfileScreen() {
  const { user } = useUser()
  const logout = useSignOut()

  const {
    control,
    trigger,
    getValues,
    watch,
    formState: { errors },
  } = useForm<EditProfileSchema>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: '',
      phone: '',
    },
    values: {
      name: user?.name ?? '',
      phone: user?.phone ?? '',
    },
  })

  const watchFields = watch()

  const isInitData =
    user?.name === watchFields.name && user.phone === watchFields.phone

  const editProfile = api.user.editProfile.useMutation({
    onSuccess: () => {
      Toast.show({
        text1: 'تم تحديث البيانات',
        text1Style: { fontSize: 18 },
        position: 'bottom',
      })
    },
    onError: ({ message }) => {
      Toast.show({
        type: 'error',
        text1: message,
        text1Style: { fontSize: 18 },
        position: 'bottom',
      })
    },
  })

  const handleSubmit = async () => {
    const result = await trigger()
    if (!result) return

    editProfile.mutate(getValues())
  }

  return (
    <KeyboardAvoidingView
      behavior='padding'
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <View className='px-4 pb-2 pt-6'>
        <View className='gap-y-2.5'>
          {inputs.map(({ name, label, ...props }) => (
            <Controller
              key={name}
              control={control}
              name={name}
              render={({ field: { value, onChange, onBlur } }) => (
                <View>
                  <Text className='mb-2 text-2xl font-semibold'>{label}</Text>
                  <TextInput
                    className='mb-1 w-full rounded-md border border-black px-4 py-1.5 text-right text-2xl'
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    autoCorrect={false}
                    autoCapitalize='none'
                    {...props}
                  />
                  <Text className='h-6 text-xl font-semibold text-destructive'>
                    {errors[name]?.message}
                  </Text>
                </View>
              )}
            />
          ))}

          <Pressable
            className='self-start rounded-md bg-primary px-4 py-2 shadow-md disabled:opacity-60'
            onPress={handleSubmit}
            disabled={
              watchFields.name === '' ||
              watchFields.phone === '' ||
              isInitData ||
              editProfile.isPending
            }
          >
            <Text className='text-2xl text-white'>تعديل البيانات</Text>
          </Pressable>
        </View>

        <Pressable
          className='mt-24 self-end rounded-md bg-primary px-4 py-2 shadow-md active:scale-[0.98]'
          onPress={() => logout()}
        >
          <Text className='text-xl text-white'>تسجيل الخروج</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  )
}
