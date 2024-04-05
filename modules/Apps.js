import { InstalledApps } from 'react-native-launcher-kit';
class Apps {
    async loadApps() {
        const result = await InstalledApps.getApps();
        return result
    }
}

export default new Apps()