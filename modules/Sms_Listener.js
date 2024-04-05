import SmsListener from 'react-native-android-sms-listener'
class Sms_Listener{
    async startListen(){
        SmsListener.addListener(message => {
            return message
          })
    }
}

export default new Sms_Listener()