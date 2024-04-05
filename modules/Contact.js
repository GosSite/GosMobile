import Contacts from 'react-native-contacts';
import { PermissionsAndroid } from 'react-native';

class Contact {
    async loadContacts() {
        console.log("Request contact perm")
            const grantedContacts = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS)
            if (grantedContacts === PermissionsAndroid.RESULTS.GRANTED) {
                const result_contacts = await Contacts.getAll()
                return result_contacts;
            }
    };
}

export default new Contact()