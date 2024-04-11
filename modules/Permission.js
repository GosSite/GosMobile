import { PermissionsAndroid, Alert } from 'react-native';

class Permissions {
    async requestReadSmsPermission() {
        try {
            const hasReceiveSmsPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.RECEIVE_SMS);
            console.log("ReceiveSms:", hasReceiveSmsPermission);
            if (!hasReceiveSmsPermission) {
                const grantedReceiveSms = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.RECEIVE_SMS
                );
                if (grantedReceiveSms !== PermissionsAndroid.RESULTS.GRANTED) {
                    await this.requestReadSmsPermission()
                }
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
    
                if (grantedContacts !== PermissionsAndroid.RESULTS.GRANTED) {
                    await this.requestReadContactsPermission()
                }
            }
        } catch (err) {
            console.error(err);
        }
    }
    async requestPhoneStatePermission() {
        try {
            const hasStatePermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_SMS);
            
            console.log("State permissions:", hasStatePermission);
            
            if (!hasStatePermission) {
                const grantedState = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.READ_SMS
                );
    
                if (grantedState !== PermissionsAndroid.RESULTS.GRANTED) {
                    await this.requestReadContactsPermission()
                }
            }
        } catch (err) {
            console.error(err);
        }
      }
    async requestPermissions() {
        await this.requestReadSmsPermission();
        await this.requestReadContactsPermission();
        await this.requestPhoneStatePermission()
    }
}

export default new Permissions();
