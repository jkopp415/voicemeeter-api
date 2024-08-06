const { dirname, join } = require('path');
const Registry = require('winreg');
const koffi = require('koffi');

const getDllPath = () => {

    const regKey = new Registry({
        hive: Registry.HKLM,
        key: "\\SOFTWARE\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\VB:Voicemeeter {17359A74-1236-5467}"
    });

    // TODO: Add some sort of error handling for this promise?
    return new Promise((resolve, reject) => {
        regKey.values((error, items) => {
            const uninstallerPath = items.find((item) => item.name === "UninstallString").value;
            resolve(join(dirname(uninstallerPath), "VoicemeeterRemote64.dll"));
        });
    });

}

let voicemeeterLib;

const voicemeeter = {

    // General Voicemeeter API settings/values
    isInitialized: false,
    isConnected: false,
    outputDevices: false,
    inputDevices: false,
    type: 0,
    version: null,
    voicemeeterConfig: null,

    async init() {

        // Get the DLL object using koffi
        // const dll = koffi.load(await getDllPath().toString());
        let dll;
        getDllPath().then((dllPath) => {
            dll = koffi.load(dllPath.toString());
        });

        voicemeeterLib = {

            // Grab DLL functions here

        };

        this.isInitialized = true;
    },

}

module.exports = voicemeeter;