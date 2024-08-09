import { voicemeeterLib } from "./index.js";
import {VoicemeeterDefaultConfig, VoicemeeterType} from "./enums.js";

const createParameterHandler = (param, valueRange, minVersion, extraCheck = {}) => {
    return {

        get() {
            if (voicemeeter.type < minVersion)
                throw Error('Your version of Voicemeeter does not support this command.');

            extraCheck();

            return voicemeeterLib.getParameterFloat(param);
        },

        set(value) {
            if (voicemeeter.type < minVersion)
                throw Error('Your version of Voicemeeter does not support this command.');

            if (value < valueRange[0] || value > valueRange[1])
                throw Error('The given value falls outside of the acceptable range for this command.');

            extraCheck();

            return voicemeeterLib.setParameterFloat(param, value);
        }
    }
}

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

            Mono: createParameterHandler(`Strip[${idx}].Mono`, [0, 1], VoicemeeterType.VOICEMEETER),

            Mute: createParameterHandler(`Strip[${idx}].Mute`, [0, 1], VoicemeeterType.VOICEMEETER),

            Solo: createParameterHandler(`Strip[${idx}].Solo`, [0, 1], VoicemeeterType.VOICEMEETER),

            MC: createParameterHandler(`Strip[${idx}].MC`, [0, 1], VoicemeeterType.VOICEMEETER),

            Gain: createParameterHandler(`Strip[${idx}].Gain`, [-60, 12], VoicemeeterType.VOICEMEETER),

            GainLayer(jdx) {
                return createParameterHandler(`Strip[${idx}].GainLayer[${jdx}]`, [-60, 12], VoicemeeterType.POTATO);
            },

            Pan_x: createParameterHandler(`Strip[${idx}].Pan_x`, [-0.5, 0.5], VoicemeeterType.VOICEMEETER),

            Pan_y: createParameterHandler(`Strip[${idx}].Pan_y`, [-0.5, 0.5], VoicemeeterType.VOICEMEETER),

            // TODO: Add check that colors & fx are on physical strips only
            Color_x: createParameterHandler(`Strip[${idx}].Color_x`, [-0.5, 0.5], VoicemeeterType.VOICEMEETER),

            Color_y: createParameterHandler(`Strip[${idx}].Color_y`, [0.0, 1.0], VoicemeeterType.VOICEMEETER),

            fx_x: createParameterHandler(`Strip[${idx}].fx_x`, [-0.5, 0.5], VoicemeeterType.BANANA),

            fx_y: createParameterHandler(`Strip[${idx}].fx_y`, [0.0, 1.0], VoicemeeterType.BANANA),

            Audibility: createParameterHandler(`Strip[${idx}].Audibility`, [0.0, 10.0], VoicemeeterType.VOICEMEETER, () => {
                if (voicemeeter.type !== VoicemeeterType.VOICEMEETER)
                    throw Error("This command only works on Voicemeeter 1.");
            }),

            // TODO: how do i do this?
            Comp: {
                // return createParameterHandler(`Strip[${idx}].Comp`, [0.0, 10.0], VoicemeeterType.BANANA),
                this: createParameterHandler(`Strip[${idx}].Comp`, [0.0, 10.0], VoicemeeterType.BANANA),

                GainIn: createParameterHandler(`Strip[${idx}].Comp.GainIn`, [-24.0, 24.0], VoicemeeterType.POTATO),
            },

        }

    }

}