import { dirname, join } from 'path';
import Registry from 'winreg';
import koffi from 'koffi'

import { VoicemeeterType } from './enums.js';

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

let voicemeeterDll;

const initializeDllFunctions = async () => {

    // Get the DLL object using koffi
    const dll = koffi.load(await getDllPath());

    voicemeeterDll = {

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
}

export const voicemeeterLib = {

    async init() {
        await initializeDllFunctions();
    },

    login() {
        if (voicemeeterDll.VBVMR_Login() !== 0)
            throw "Login failed";
    },

    logout() {
        if (voicemeeterDll.VBVMR_Logout() !== 0)
            throw "Logout failed";
    },

    getVoicemeeterType() {
        const voicemeeterType = [0];
        if (voicemeeterDll.VBVMR_GetVoicemeeterType(voicemeeterType) !== 0)
            throw "GetVoicemeeterType failed";

        switch(voicemeeterType[0]) {
            case 1:
                return VoicemeeterType.VOICEMEETER;
            case 2:
                return VoicemeeterType.BANANA;
            case 3:
                return VoicemeeterType.POTATO;
            default:
                return VoicemeeterType.UNKNOWN;
        }
    },

    getVoicemeeterVersion() {
        const voicemeeterVersion = [0];
        if (voicemeeterDll.VBVMR_GetVoicemeeterVersion(voicemeeterVersion) !== 0)
            throw "GetVoicemeeterVersion failed";

        const v1 = (voicemeeterVersion[0] & 0xFF000000) >> 24;
        const v2 = (voicemeeterVersion[0] & 0x00FF0000) >> 16;
        const v3 = (voicemeeterVersion[0] & 0x0000FF00) >> 8;
        const v4 = (voicemeeterVersion[0] & 0x000000FF);

        return `${v1}.${v2}.${v3}.${v4}`;
    },

    isParametersDirty() {
        return voicemeeterDll.VBVMR_IsParametersDirty();
    },

    getParameterFloat(parameter) {
        let value = [0];
        if (voicemeeterDll.VBVMR_GetParameterFloat(parameter, value) !== 0)
            throw "GetParameterFloat failed";
        return value[0];
    },

    setParameterFloat(parameter, value) {
        if (voicemeeterDll.VBVMR_SetParameterFloat(parameter, value) !== 0)
            throw "SetParameterFloat failed";
    },

}