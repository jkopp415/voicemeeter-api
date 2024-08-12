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

export const VM_ParameterType = {
    FLOAT: 0,
    STRING: 1,
}

export const VM_AccessType = {
    READ_WRITE: 0,
    READ_ONLY: 1,
    WRITE_ONLY: 2
}

export const VM_InterfaceType = {
    BOTH: 0,
    PHYSICAL_ONLY: 1,
    VIRTUAL_ONLY: 2
}

export const VM_Version = {
    UNKNOWN: 0,
    VOICEMEETER: 1,
    BANANA: 2,
    POTATO: 3
}

export const VM_ButtonState = {
    OFF: 0,
    ON: 1
}

export const VM_Parameters = {

    Strip(idx) {
        return {

            Mono: {
                name: `Strip[${idx}].Mono`,
                type: VM_ParameterType.FLOAT,
                valueRange: [0, 1],
                access: VM_AccessType.READ_WRITE,
                minVersion: VM_Version.VOICEMEETER,
                maxVersion: null
            },

            Mute: {
                name: `Strip[${idx}].Mute`,
                type: VM_ParameterType.FLOAT,
                valueRange: [0, 1],
                access: VM_AccessType.READ_WRITE,
                minVersion: VM_Version.VOICEMEETER,
                maxVersion: null
            },

            Solo: {
                name: `Strip[${idx}].Solo`,
                type: VM_ParameterType.FLOAT,
                valueRange: [0, 1],
                access: VM_AccessType.READ_WRITE,
                minVersion: VM_Version.VOICEMEETER,
                maxVersion: null
            },

            MC: {
                name: `Strip[${idx}].MC`,
                type: VM_ParameterType.FLOAT,
                valueRange: [0, 1],
                access: VM_AccessType.READ_WRITE,
                minVersion: VM_Version.VOICEMEETER,
                maxVersion: null
            },

            Gain: {
                name: `Strip[${idx}].Gain`,
                type: VM_ParameterType.FLOAT,
                valueRange: [-60, 12],
                access: VM_AccessType.READ_WRITE,
                minVersion: VM_Version.VOICEMEETER,
                maxVersion: null
            },

            GainLayer(jdx) {
                return {
                    name: `Strip[${idx}].GainLayer[${jdx}]`,
                    type: VM_ParameterType.FLOAT,
                    valueRange: [-60.0, 12.0],
                    access: VM_AccessType.READ_WRITE,
                    minVersion: VM_Version.POTATO,
                    maxVersion: null
                }
            },

            Comp: {
                name: `Strip[${idx}].Comp`,
                type: VM_ParameterType.FLOAT,
                valueRange: [0.0, 10.0],
                access: VM_AccessType.READ_WRITE,
                minVersion: VM_Version.BANANA,
                maxVersion: null
            },

            Comp_GainIn: {
                name: `Strip[${idx}].Comp.GainIn`,
                type: VM_ParameterType.FLOAT,
                valueRange: [-24.0, 24.0],
                access: VM_AccessType.READ_WRITE,
                minVersion: VM_Version.POTATO,
                maxVersion: null
            }

        }
    }

}