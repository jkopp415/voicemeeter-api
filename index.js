const { dirname, join } = require('path');
const Registry = require('winreg');
const koffi = require('koffi');

const getDllPath = () => {

    const regKey = new Registry({
        hive: Registry.HKLM,
        key: "\\SOFTWARE\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\VB:Voicemeeter {17359A74-1236-5467}"
    });

    // TODO: Add some sort of error handling for this promise?
    return new Promise((resolve) => {
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
        const dll = koffi.load(await getDllPath());

        voicemeeterLib = {

            // Login/Logout
            VBVMR_Login: dll.func("long __stdcall VBVMR_Login(void)"),
            VBVMR_Logout: dll.func("long __stdcall VBVMR_Logout(void)"),

        };

        this.isInitialized = true;
    },

    login() {

        if (!this.isInitialized)
            throw "Wait for initialization before logging in";

        if (this.isConnected)
            throw "Already connected";

        if (voicemeeterLib.VBVMR_Login() !== 0)
            throw "Login failed";

        // this.type =
        // this.version =
        // this.voicemeeterConfig =
        this.isConnected = true;
    },

    logout() {

        if (!this.isConnected)
            throw "Not connected";

        if (voicemeeterLib.VBVMR_Logout() !== 0)
            throw "Logout failed";

        this.isConnected = false;
    }

}

module.exports = voicemeeter;