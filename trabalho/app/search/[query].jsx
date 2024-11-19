import { FlatList, Text, View, Image, RefreshControl, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import { images } from '../../constants'
import SearchInput from '../../components/SearchInput'
import Grupos from '../../components/Grupos'
import EmptyState from '../../components/EmptyState'
import { searchPosts } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import PostCard from '../../components/PostCard'
import { useLocalSearchParams } from 'expo-router'

const Search = () => {
  const { query } = useLocalSearchParams()
  const { data: posts, refetch } = useAppwrite(() => searchPosts(query))

  useEffect(() => {
    refetch()
  }, [query])

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <PostCard
            post={item}
          />
        )}
        ListHeaderComponent={() => (
          <View className="my-6 px-4">
            <Text className="font-medium text-sm text-gray-100">
              Resultados Encontrados para
            </Text>
            <Text className="text-2xl font-psemibold text-gray-100">
              {query}
            </Text>

            <View className='mt-6 mb-8'>
              <SearchInput initialQuery={query} />
            </View>

          </View>
        )}

        ListEmptyComponent={() => (
          <EmptyState
            title="Nenhum Grupo Encontrado"
            subtitle="Nenhum grupo encontrado com essas palavras"
          />
        )}
      />
    </SafeAreaView>
  )
}

export default Search