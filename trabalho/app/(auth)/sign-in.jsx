import { Text, View, ScrollView, Image, Alert } from 'react-native'
import { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import { images } from '../../constants'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'

import { Link } from 'expo-router'
import { getCurrentUser, signIn } from '../../lib/appwrite'
import { useGlobalContext } from "../../context/GlobalProvider"

const SignIn = () => {
  const { setUser, setIsLogged } = useGlobalContext();
  const [isSubmiting, setIsSubmiting] = useState(false)

  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const submit = async () => {
    if(!form.email === "" || !form.password === "") {
      Alert.alert('Error', 'Por favor preencha todos os campos')
    }

    setIsSubmiting(true);

    try {
      await signIn(form.email, form.password)
      const result = await getCurrentUser();
      setUser(result);
      setIsLogged(true)

      Alert.alert("Success", "Usuário logado com sucesso!")
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
        <View className="w-full justify-center min-h-[88vh] px-4 my-6">
          <Image
            source={images.inova}
            resizeMode='contain'
            className="w-[115px] h-[35px]"
          />

          <Text className="text-2xl text-white text-semibold mt-10 font-psemibold">Faça login agora!</Text>

          <FormField
            title="Email"
            placeholder="Exemplo@hotmail.com"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-adress"
          />
          <FormField
            title="Password"
            placeholder="Exemplo2024*"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
          />

          <View className="pt-6 gap-2 ml-60">
            <Link href="/forgot-password" className="text-[15px] text-gray-100">Esqueceu a senha?</Link>
          </View>

          <CustomButton
            title="Login"
            handlePress={submit}
            containerStyles="mt-8"
            isLoading={isSubmiting}
          />

          <View className='justify-center pt-5 flex-row gap-2'>
            <Text className="text-lg text-gray-100 font-pregular">
              Não possui uma conta?
            </Text>
            <Link href="/sign-up" className='text-lg font-psemibold text-secondary'>Cadastre-se</Link>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn