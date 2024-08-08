import { voicemeeterLib } from "./index.js";
import { VoicemeeterDefaultConfig } from "./enums.js";

export const voicemeeter = {

    // General Voicemeeter API settings/values
    isInitialized: false,
    isConnected: false,
    outputDevices: false,
    inputDevices: false,
    type: 0,
    version: null,
    voicemeeterConfig: null,

    async init() {
        await voicemeeterLib.init();
        this.isInitialized = true;
    },

    login() {

        if (!this.isInitialized)
            throw "Wait for initialization before logging in";

        if (this.isConnected)
            throw "Already connected";

        voicemeeterLib.login();

        this.type = voicemeeterLib.getVoicemeeterType();
        this.version = voicemeeterLib.getVoicemeeterVersion();
        this.voicemeeterConfig = VoicemeeterDefaultConfig[this.type];
        this.isConnected = true;
    },

    logout() {

        if (!this.isConnected)
            throw "Not connected";

        voicemeeterLib.logout();

        this.isConnected = false;
    },

    // TODO: Update this, maybe make update loop built-in somehow
    isParametersDirty() {
        return voicemeeterLib.isParametersDirty();
    },

    Strip(idx) {

        // Check that Voicemeeter is connected and the right config is selected
        if (!this.isConnected)
            throw "Not connected";

        if (!this.voicemeeterConfig)
            throw "Configuration error"

        // TODO: I can probably just use this.type and consolidate this section
        // Check that the strip number is valid
        if (!this.voicemeeterConfig.strips.some((strip) => strip.id === idx))
            throw `Strip ${idx} not found`;

        return {

            get Mono() { return voicemeeterLib.getParameterFloat(`Strip[${idx}].Mono`); },
            set Mono(value) { voicemeeterLib.setParameterFloat(`Strip[${idx}].Mono`, value); },

            get Mute() { return voicemeeterLib.getParameterFloat(`Strip[${idx}].Mute`); },
            set Mute(value) { voicemeeterLib.setParameterFloat(`Strip[${idx}].Mute`, value); },

            get Solo() { return voicemeeterLib.getParameterFloat(`Strip[${idx}].Solo`); },
            set Solo(value) { voicemeeterLib.setParameterFloat(`Strip[${idx}].Solo`, value); },

            get MC() { return voicemeeterLib.getParameterFloat(`Strip[${idx}].MC`); },
            set MC(value) { voicemeeterLib.setParameterFloat(`Strip[${idx}].MC`, value); },

            get Gain() { return voicemeeterLib.getParameterFloat(`Strip[${idx}].Gain`); },
            set Gain(value) { voicemeeterLib.setParameterFloat(`Strip[${idx}].Gain`, value); }

        }

    }

}