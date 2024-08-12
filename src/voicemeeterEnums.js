export const VoicemeeterDefaultConfig = {
    0: {},
    1: {
        strips: [{
            id: 0
        }, {
            id: 1
        }, {
            id: 2,
            isVirtual: true
        }],
        buses: [{
            id: 0
        }, {
            id: 1
        }]
    },
    2: {
        strips: [{
            id: 0
        }, {
            id: 1
        }, {
            id: 2
        }, {
            id: 3,
            isVirtual: true
        }, {
            id: 4,
            isVirtual: true
        }],
        buses: [{
            id: 0,
        }, {
            id: 1,
        }, {
            id: 2,
        }, {
            id: 3,
            isVirtual: true
        }, {
            id: 4,
            isVirtual: true
        }],
    },
    3: {
        strips: [{
            id: 0
        }, {
            id: 1
        }, {
            id: 2
        }, {
            id: 3
        }, {
            id: 4
        }, {
            id: 5,
            isVirtual: true
        }, {
            id: 6,
            isVirtual: true
        }, {
            id: 7,
            isVirtual: true
        }],
        buses: [{
            id: 0,
        }, {
            id: 1,
        }, {
            id: 2,
        }, {
            id: 3,
        }, {
            id: 4,
        }, {
            id: 5,
            isVirtual: true
        }, {
            id: 6,
            isVirtual: true
        }, {
            id: 7,
            isVirtual: true
        }],
    }
}

export const VM_ParamType = {
    FLOAT: 0,
    STRING: 1,
}

export const VM_AcessType = {
    READ_WRITE: 0,
    READ_ONLY: 1,
    WRITE_ONLY: 2
}

export const VM_InterfaceType = {
    BOTH: 0,
    PHYSICAL_ONlY: 1,
    VIRTUAL_ONLY: 2
}

export const VM_Version = {
    UNKNOWN: 0,
    VOICEMEETER: 1,
    BANANA: 2,
    POTATO: 3
}

export const VM_Param = {

    Strip(idx) {
        return {

            Mono: {
                paramName: `Strip[${idx}].Mono`,
                paramType: VM_ParamType.FLOAT,
                valueRange: [0, 1],
                accessType: VM_AcessType.READ_WRITE,
                minVersion: VM_Version.VOICEMEETER,
                maxVersion: null
            },

            Mute: {
                paramName: `Strip[${idx}].Mute`,
                paramType: VM_ParamType.FLOAT,
                valueRange: [0, 1],
                accessType: VM_AcessType.READ_WRITE,
                minVersion: VM_Version.VOICEMEETER,
                maxVersion: null
            },

            Solo: {
                paramName: `Strip[${idx}].Solo`,
                paramType: VM_ParamType.FLOAT,
                valueRange: [0, 1],
                accessType: VM_AcessType.READ_WRITE,
                minVersion: VM_Version.VOICEMEETER,
                maxVersion: null
            },

            MC: {
                paramName: `Strip[${idx}].MC`,
                paramType: VM_ParamType.FLOAT,
                valueRange: [0, 1],
                minVersion: VM_Version.VOICEMEETER
            },

            Gain: {
                paramName: `Strip[${idx}].Gain`,
                paramType: VM_ParamType.FLOAT,
                valueRange: [-60, 12],
                minVersion: VM_Version.VOICEMEETER
            },

            GainLayer(jdx) {
                return {
                    paramName: `Strip[${idx}].GainLayer[${jdx}]`,
                    paramType: VM_ParamType.FLOAT,
                    valueRange: [-60.0, 12.0],
                    minVersion: VM_Version.POTATO
                }
            },

            Comp: {
                paramName: `Strip[${idx}].Comp`,
                paramType: VM_ParamType.FLOAT,
                valueRange: [0.0, 10.0],
                minVersion: VM_Version.BANANA
            },

            Comp_GainIn: {
                paramName: `Strip[${idx}].Comp.GainIn`,
                paramType: VM_ParamType.FLOAT,
                valueRange: [-24.0, 24.0],
                minVersion: VM_Version.POTATO
            }

        }
    }

}

export const VM_ButtonState = {
    OFF: 0,
    ON: 1
}