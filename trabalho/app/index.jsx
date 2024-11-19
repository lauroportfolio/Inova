import { StatusBar } from "expo-status-bar";
import { Redirect, router } from "expo-router";
import { View, Text, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from '../constants'
import CustomButton from '../components/CustomButton';
import { useGlobalContext } from '../context/GlobalProvider';

export default function App() {
  const {loading, isLogged} = useGlobalContext();

  if(!loading && isLogged) return <Redirect href="/inicio" />

  return (
    <SafeAreaView className="bg-primary h-full">

      <ScrollView contentContainerStyle={{ height: '100%' }}>
        <View className='w-full justify-center items-center min-h-[105vh] px-4'>
          <Image
            source={images.inova}
            className="w-[280px] h-[84px]"
            resizeMode='contain'
          />

          <Image
            source={images.cards}
            className="max-w-[380px] w-full h-[300px]"
            resizeMode='contain'
          />

          <View className="relative mt-5">
            <Text className="text-3xl text-white font-bold text-center">
              Descubra Os melhores{"\n"}
              Projetos com{" "}
              <Text className="text-secondary-200">Inova</Text>
            </Text>

            <Image
              source={images.path}
              className="w-[136px] h-[15px] absolute -bottom-2 -right-8"
              resizeMode="contain"
            />
          </View>

          <Text className="text-sm font-pregular text-gray-100 mt-7 text-center">
            Criatividade e Inovação: Venha Conhecer Todos os Projetos da nossa Universidade com <Text className="font-pbold">INOVA</Text>
          </Text>

          <CustomButton
            title="Continue com Email"
            handlePress={() => router.push('/sign-in')}
            containerStyles="w-full mt-12"
          />
        </View>
      </ScrollView>

      <StatusBar
        backgroundColor='#161622'
        style='light'
      />
    </SafeAreaView>
  );
}