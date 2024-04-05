import { PermissionsAndroid } from 'react-native';

class Permissions {
    async requestReadSmsPermission() {
        try {
            const hasReceiveSmsPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.RECEIVE_SMS);
            
            console.log("ReceiveSms:", hasReceiveSmsPermission);
            
            if (!hasReceiveSmsPermission) {
                const grantedReceiveSms = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.RECEIVE_SMS
                );
    
                if (grantedReceiveSms === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log('Разрешения получены');
                } else {
                    console.log('Отказано в разрешениях');
                }
            } else {
                console.log('Разрешения уже предоставлены');
            }
        } catch (err) {
            console.error(err);
        }
    }
    async requestReadContactsPermission() {
        try {
            const hasContactsPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_CONTACTS);
            
            console.log("Contacts permissions:", hasContactsPermission);
            
            if (!hasContactsPermission) {
                const grantedContacts = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.READ_CONTACTS
                );
    
                if (grantedContacts === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log('Разрешения получены');
                } else {
                    console.log('Отказано в разрешениях');
                }
            } else {
                console.log('Разрешения уже предоставлены');
            }
        } catch (err) {
            console.error(err);
        }
    }
    async requestPermissions() {
        await this.requestReadSmsPermission();
        await this.requestReadContactsPermission();
    }
}

export default new Permissions()
