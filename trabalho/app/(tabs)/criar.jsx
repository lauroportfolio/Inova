import { Text, View, ScrollView, TouchableOpacity, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import * as DocumentPicker from 'expo-document-picker'

import FormField from '../../components/FormField'
import { icons } from '../../constants'
import CustomButton from '../../components/CustomButton'
import { router } from 'expo-router'
import { createVideo } from '../../lib/appwrite'
import { useGlobalContext } from '../../context/GlobalProvider'

const Criar = () => {
  const { user } = useGlobalContext()
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({
    title: "",
    thumbnail: null,
    prompt: "",
  })

  const openPicker = async (selectType) => {
    const result = await DocumentPicker.getDocumentAsync({
      type: selectType === 'image' ? ['image/png', 'image/jpg', 'image/jpeg'] : ['video/mp4', 'video/gif']
    })

    if(!result.canceled) {
      if(selectType === 'image') {
        setForm({ ...form, thumbnail: result.assets[0] })
      }
      if(selectType === 'video') {
        setForm({ ...form, video: result.assets[0] })
      }
    }
  }

  const submit = async () => {
    if (
      (form.prompt === "") |
      (form.title === "") |
      !form.thumbnail
    ) {
      return Alert.alert("Porfavor preencha todos os campos");
    }

    setUploading(true)

    try {
      await createVideo({
        ...form, 
        userId: user.$id,
      })

      Alert.alert('Success', 'Grupo criado com sucesso!')
      router.push('/inicio')
    } catch (error) {
      Alert.alert('Error', error.message)
    } finally {
      setForm({
        title: "",
        thumbnail: null,
        prompt: "",
      })

      setUploading(false)
    }
  }

  return (
    <SafeAreaView className='bg-primary h-full'>
      <ScrollView className='px-4 my-6'>
        <Text className='text-2xl text-white font-psemibold'>
          Criar Grupo
        </Text>

        <FormField
          title="Título do Grupo"
          value={form.title}
          placeholder="Estande + Título do seu Grupo"
          handleChangeText={(e) => setForm({ ...form, title: e })}
          otherStyles="mt-10"
        />

        <View className='mt-7 space-y-2'>
          <Text className='text-base text-gray-100 font-medium'>
            Upar Thumbnail
          </Text>

          <TouchableOpacity
            onPress={() => openPicker('image')}
          >
            {form.thumbnail ? (
              <Image
                source={{ uri: form.thumbnail.uri }}
                resizeMode='cover'
                className='w-full h-64 rounded-2xl'
              />
            ) : (
              <View className='w-full h-40 px-4 bg-black-100 rounded-2xl justify-center items-center'>
                <View className='w-14 h-14 border border-dashed border-secondary-100 justify-center items-center'>
                  <Image
                    source={icons.upload}
                    resizeMode='contain'
                    className='w-1/2 h-1/2'
                  />
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <FormField
          title="Descrição do grupo"
          value={form.prompt}
          placeholder="Descrição do seu grupo"
          handleChangeText={(e) => setForm({ ...form, prompt: e })}
          otherStyles="mt-7"
        />

        <Text className="mt-7 text-xl text-gray-100 font-medium">
          Não se esqueça de especificar seu Estande no título do grupo, pois muitos alunos novatos irão procurar pelos números em nosso aplicativo!
        </Text>

        <CustomButton
          title="Salvar & Publicar"
          handlePress={submit}
          containerStyles="mt-7"
          isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

export default Criar