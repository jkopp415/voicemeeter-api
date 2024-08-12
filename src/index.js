import { voicemeeterLib } from "./vmLib.js";
import { VoicemeeterDefaultConfig, VM_AccessType, VM_ParameterType } from "./vmEnums.js";
import { VMJS_AccessError, VMJS_InputError, VMJS_VersionError } from './vmErrors.js';

let isInitialized = false;
let isConnected = false;
// let outputDevices = false;
// let inputDevices = false;
let type = 0;
let version = null;
let voicemeeterConfig = null;

async function init() {
    await voicemeeterLib.init();
    isInitialized = true;
}

function login() {
    if (!isInitialized)
        throw "Wait for initialization before logging in";

    if (isConnected)
        throw "Already connected";

    voicemeeterLib.login();

    type = voicemeeterLib.getVoicemeeterType();
    version = voicemeeterLib.getVoicemeeterVersion();
    voicemeeterConfig = VoicemeeterDefaultConfig[type];
    isConnected = true;
}

function logout() {
    if (!isConnected)
        throw "Not connected";

    voicemeeterLib.logout();

    isConnected = false;
}

function getType() {
    switch (type) {
        case 1: return 'Voicemeeter';
        case 2: return 'Voicemeeter Banana'; 
        case 3: return 'Voicemeeter Potato';
        default: return 'Unknown Voicemeeter Type'
    }
}

function getVersion() {
    return version;
}

function isParametersDirty() {
    return voicemeeterLib.isParametersDirty();
}

function getParameter(parameter) {
    if (parameter.access === VM_AccessType.WRITE_ONLY)
        throw new VMJS_AccessError('The given parameter is write-only.');

    if (this.version < parameter.minVersion)
        throw new VMJS_VersionError('The given parameter does not work on the current version of Voicemeeter.');

    if (parameter.maxVersion != null && version > parameter.maxVersion)
        throw new VMJS_VersionError('The given parameter does not work on the current version of Voicemeeter.');

    if (parameter.type === VM_ParameterType.FLOAT)
        return voicemeeterLib.getParameterFloat(parameter.name);
    else if (parameter.type === VM_ParameterType.STRING) {
        // TODO: Implement this
    }
}

function setParameter(parameter, value) {
    if (parameter.access === VM_AccessType.READ_ONLY)
        throw new VMJS_AccessError('The given parameter is read-only.');

    if (this.version < parameter.minVersion)
        throw new VMJS_VersionError('The given parameter does not work on the current version of Voicemeeter.');

    if (parameter.maxVersion != null && version > parameter.maxVersion)
        throw new VMJS_VersionError('The given parameter does not work on the current version of Voicemeeter.');

    if (parameter.type === VM_ParameterType.FLOAT) {

        if (value < parameter.valueRange[0] || value > parameter.valueRange[1])
            throw new VMJS_InputError('The given value falls outside the acceptable range for this parameter.');

        voicemeeterLib.setParameterFloat(parameter.name, value);

    } else if (parameter.type === VM_ParameterType.STRING) {
        // TODO: Implement this
    }
}

export default {
    init,
    login,
    logout,
    getType,
    getVersion,
    isParametersDirty,
    getParameter,
    setParameter
};

export { VM_Parameters } from './vmEnums.js';