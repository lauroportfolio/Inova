import { Text, View, ScrollView, Image, Alert } from 'react-native'
import { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import { images } from '../../constants'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { useGlobalContext } from "../../context/GlobalProvider"

import { Link, router } from 'expo-router'
import { createUser } from '../../lib/appwrite'

const SignUp = () => {
  const { setUser, setIsLogged } = useGlobalContext();
  const [isSubmiting, setIsSubmiting] = useState(false)

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
  })

  const submit = async () => {
    if(!form.username === "" || !form.email === "" || !form.password === "") {
      Alert.alert('Error', 'Por favor preencha todos os campos')
    }

    setIsSubmiting(true);

    try {
      const result = await createUser(form.email, form.password, form.username);
      setUser(result);
      setIsLogged(true);

      router.replace('/inicio')
    } catch (error) {
      Alert.alert('Error', error.message)
    } finally {
      setIsSubmiting(false)
    }
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[83vh] px-4 my-6">
          <Image
            source={images.inova}
            resizeMode='contain'
            className="w-[115px] h-[35px]"
          />

          <Text className="text-2xl text-white text-semibold mt-10 font-psemibold">Cadastre-se agora!</Text>

          <FormField
            title="Username"
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles="mt-10"
          />
          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-adress"
          />
          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
          />

          <CustomButton
            title="Cadastrar"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmiting}
          />

          <View className='justify-center pt-5 flex-row gap-2'>
            <Text className="text-lg text-gray-100 font-pregular">
              Já possui uma conta?
            </Text>
            <Link href="/sign-in" className='text-lg font-psemibold text-secondary'>Entre já</Link>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp