import { voicemeeterLib } from "./voicemeeterLib.js";
import { VoicemeeterDefaultConfig, VM_AcessType, VM_ParamType } from "./voicemeeterEnums.js";
import { VMJS_AccessError, VMJS_InputError, VMJS_VersionError } from './voicemeeterErrors.js';

let isInitialized = false;
let isConnected = false;
let outputDevices = false;
let inputDevices = false;
let type = 0;
let version = null;
let voicemeeterConfig = null;

export async function init() {
    await voicemeeterLib.init();
    isInitialized = true;
}

export function login() {
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

export function logout() {
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

export function getParameter(parameter) {
    if (parameter.accessType === VM_AcessType.WRITE_ONLY)
        throw new VMJS_AccessError('The given parameter is write-only.');

    if (this.version < parameter.minVersion)
        throw new VMJS_VersionError('The given parameter does not work on the current version of Voicemeeter.');

    if (parameter.maxVersion != null && version > parameter.maxVersion)
        throw new VMJS_VersionError('The given parameter does not work on the current version of Voicemeeter.');

    if (parameter.paramType === VM_ParamType.FLOAT)
        return voicemeeterLib.getParameterFloat(parameter.paramName);
    else if (parameter.paramType === VM_ParamType.STRING) {
        // TODO: Implement this
    }
}

export function setParameter(parameter, value) {
    if (parameter.accessType === VM_AcessType.READ_ONLY)
        throw new VMJS_AccessError('The given parameter is read-only.');

    if (this.version < parameter.minVersion)
        throw new VMJS_VersionError('The given parameter does not work on the current version of Voicemeeter.');

    if (parameter.maxVersion != null && version > parameter.maxVersion)
        throw new VMJS_VersionError('The given parameter does not work on the current version of Voicemeeter.');

    if (parameter.paramType === VM_ParamType.FLOAT) {

        if (value < parameter.valueRange[0] || value > parameter.valueRange[1])
            throw new VMJS_InputError('The given value falls outside the acceptable range for this parameter.');

        voicemeeterLib.setParameterFloat(parameter.paramName, value);

    } else if (parameter.paramType === VM_ParamType.STRING) {
        // TODO: Implement this
    }
}

// export default Voicemeeter;
export { VM_Param } from './voicemeeterEnums.js';