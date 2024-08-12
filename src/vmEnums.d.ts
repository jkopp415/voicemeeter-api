export declare enum VM_ParameterType {
    FLOAT,
    STRING
};

export declare enum VM_AccessType {
    READ_WRITE,
    READ_ONLY,
    WRITE_ONLY
};

export declare enum VM_InterfaceType {
    BOTH,
    PHYSICAL_ONLY,
    VIRTUAL_ONLY
};

export declare enum VM_Version {
    UNKNOWN,
    VOICEMEETER,
    BANANA,
    POTATO
}

interface VM_Parameter {
    name: string,
    type: VM_ParameterType,
    valueRange: number[],
    access: VM_AccessType,
    minVersion: VM_Version,
    maxVersion: VM_Version | undefined
}

export declare const VM_Parameters: {

    Strip(idx: number): {
        Mono: VM_Parameter,
        Mute: VM_Parameter,
        Solo: VM_Parameter,
        MC: VM_Parameter,
        Gain: VM_Parameter,
        GainLayer(jdx: number): VM_Parameter,
        Comp: VM_Parameter,
        Comp_GainIn: VM_Parameter,
    }

}