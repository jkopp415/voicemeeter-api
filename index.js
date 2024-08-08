const { dirname, join } = require('path');
const Registry = require('winreg');
const koffi = require('koffi');

const { VoicemeeterDefaultConfig, VoicemeeterType, PanelType } = require('./enums');

// TODO: Add better error handling for function failures

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

            // General information
            VBVMR_GetVoicemeeterType: dll.func("long __stdcall VBVMR_GetVoicemeeterType(_Out_ long* pType)"),
            VBVMR_GetVoicemeeterVersion: dll.func("long __stdcall VBVMR_GetVoicemeeterVersion(_Out_ long* pVersion)"),

            // Get parameters
            VBVMR_IsParametersDirty: dll.func("long __stdcall VBVMR_IsParametersDirty(void)"),
            VBVMR_GetParameterFloat: dll.func("long __stdcall VBVMR_GetParameterFloat(char* szParamName, _Out_ float* pValue)"),

            // Set parameters
            VBVMR_SetParameterFloat: dll.func("long __stdcall VBVMR_SetParameterFloat(char* szParamName, float Value)"),

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

        this.type = this.getVoicemeeterType();
        this.version = this.getVoicemeeterVersion();
        this.voicemeeterConfig = VoicemeeterDefaultConfig[this.type];
        this.isConnected = true;
    },

    logout() {

        if (!this.isConnected)
            throw "Not connected";

        if (voicemeeterLib.VBVMR_Logout() !== 0)
            throw "Logout failed";

        this.isConnected = false;
    },

    getVoicemeeterType() {

        const voicemeeterType = [0];
        if (voicemeeterLib.VBVMR_GetVoicemeeterType(voicemeeterType) !== 0)
            throw "GetVoicemeeterType failed";

        switch(voicemeeterType[0]) {
            case 1:
                return VoicemeeterType.voicemeeter;
            case 2:
                return VoicemeeterType.voicemeeterBanana;
            case 3:
                return VoicemeeterType.voicemeeterPotato;
            default:
                return VoicemeeterType.unknown;
        }
    },

    getVoicemeeterVersion() {

        const voicemeeterVersion = [0];
        if (voicemeeterLib.VBVMR_GetVoicemeeterVersion(voicemeeterVersion) !== 0)
            throw "GetVoicemeeterVersion failed";

        const v1 = (voicemeeterVersion[0] & 0xFF000000) >> 24;
        const v2 = (voicemeeterVersion[0] & 0x00FF0000) >> 16;
        const v3 = (voicemeeterVersion[0] & 0x0000FF00) >> 8;
        const v4 = (voicemeeterVersion[0] & 0x000000FF);

        return `${v1}.${v2}.${v3}.${v4}`;
    },

    isParametersDirty() {

        return voicemeeterLib.VBVMR_IsParametersDirty();
    },

    getButtonState(panelType, panelNum, buttonName) {

        // Check that Voicemeeter is connected and the right config is selected
        if (!this.isConnected)
            throw "Not connected";

        if (!this.voicemeeterConfig)
            throw "Configuration error";

        // Check that the interface type (strip or bus) is valid and get the corresponding string
        if (!Object.values(PanelType).includes(panelType))
            throw `Invalid Interface type: ${panelType}`;
        const panelTypeStr = panelType === PanelType.strip ? "Strip" : "Bus";

        // Check that the interface number is valid
        if (!this.voicemeeterConfig[panelType === PanelType.strip ? "strips" : "buses"]
                .some((strip) => strip.id === parseInt(panelNum)))
            throw `${panelTypeStr} ${panelNum} not found`;

        // Run the API method and return the result
        const parameter = `${panelTypeStr}[${panelNum}].${buttonName}`;
        let value = [0];
        if (voicemeeterLib.VBVMR_GetParameterFloat(parameter, value) !== 0)
            throw "GetParameterFloat failed";

        return value[0];
    },

    setButtonState(panelType, panelNum, buttonName, buttonState) {

        // Check that Voicemeeter is connected and the right config is selected
        if (!this.isConnected)
            throw "Not connected";

        if (!this.voicemeeterConfig)
            throw "Configuration error";

        // Check that the interface type (strip or bus) is valid and get the corresponding string
        if (!Object.values(PanelType).includes(panelType))
            throw `Invalid Interface type: ${panelType}`;
        const panelTypeStr = panelType === PanelType.strip ? "Strip" : "Bus";

        // Check that the interface number is valid
        if (!this.voicemeeterConfig[panelType === PanelType.strip ? "strips" : "buses"]
            .some((strip) => strip.id === parseInt(panelNum)))
            throw `${panelTypeStr} ${panelNum} not found`;

        // Run the API method
        const parameter = `${panelTypeStr}[${panelNum}].${buttonName}`;
        if (voicemeeterLib.VBVMR_SetParameterFloat(parameter, buttonState) !== 0)
            throw "SetParameterFloat failed";
    }

}

module.exports = voicemeeter;