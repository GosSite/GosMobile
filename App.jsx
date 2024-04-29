import React, { useState, useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Intro from './Components/pages/Intro';
import LogIn from './Components/pages/LogIn';
import Main from './Components/pages/Main';
import StorageManager from './Components/StorageManager';
const Stack = createStackNavigator();

export default function App() {
  const [isBanned, setIsBanned] = useState(false)
  const getUserData = async () => {
    const phoneNumber = await StorageManager.getData('phoneNumber')
    console.log('get user data')
    if (phoneNumber) {
      try {
        const response = await (await fetch(`https://curious-pinafore-goat.cyclic.app/user/${phoneNumber}`)).json()
        console.log(response[0].banned)
        setIsBanned(response[0].banned)
      } catch (error) {
        console.log('Ошибка при получении данных с сервера:', error);
        return error.response
      }
    } else {
      console.log('phone number empty')
    }
  }
  useEffect(() => {
    getUserData()
  }, [])
  return (
    <>
    {isBanned ? <Main/> : <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: 'black',
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen name="Intro" component={Intro} options={{ headerShown: false }} />
        <Stack.Screen name="LogIn" component={LogIn} options={{ title: 'Авторизация' }} />
        <Stack.Screen name="Main" component={Main} options={{ headerShown: false, gestureEnabled: false }} />
      </Stack.Navigator>
    </NavigationContainer>}
    </>
  );
}
