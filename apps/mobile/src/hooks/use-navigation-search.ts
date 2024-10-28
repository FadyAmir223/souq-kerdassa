import { useNavigation } from 'expo-router'
import { useLayoutEffect, useState } from 'react'
import type { SearchBarProps } from 'react-native-screens'

const defaultSearchOptions: SearchBarProps = {
  tintColor: '#c82d2d',
  hideWhenScrolling: false,
  cancelButtonText: 'إلغاء',
}

export default function useNavigationSearch({
  searchBarOptions,
}: {
  searchBarOptions?: SearchBarProps
}) {
  const navigation = useNavigation()
  const [search, setSearch] = useState('')

  const handleOnChangeText: SearchBarProps['onChangeText'] = ({
    nativeEvent: { text },
  }) => setSearch(text)

  useLayoutEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        ...defaultSearchOptions,
        ...searchBarOptions,
        onChangeText: handleOnChangeText,
      },
    })
  }, [navigation, searchBarOptions])

  return search
}
