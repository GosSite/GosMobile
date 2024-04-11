import AsyncStorage from '@react-native-async-storage/async-storage';

class StorageManager{
    async saveData(key, value){
        AsyncStorage.setItem(key, value);
        console.log("saved")
    }
    async getData(key){
        return await AsyncStorage.getItem(key);
    }
}

export default new StorageManager()