export class VMJS_AccessError extends Error {
    constructor(message) {
        super(message);
        this.name = "VMJS_AccessError";
    }
}

export class VMJS_InputError extends Error {
    constructor(message) {
        super(message);
        this.name = "VMJS_InputError";
    }
}

export class VMJS_VersionError extends Error {
    constructor(message) {
        super(message);
        this.name = "VMJS_VersionError";
    }
}