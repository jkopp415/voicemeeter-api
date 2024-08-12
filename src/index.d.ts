import { VM_Parameter } from './vmEnums.d.ts';

/**
 * THE INIT FUNCTION
 */
export function init(): Promise<void>;

/**
 * THE LOGIN FUNCTION
 */
export function login(): void;

/**
 * THE LOGOUT FUNCTION
 */
export function logout(): void;

/**
 * getType()
 */
export function getType(): string;

/**
 * getVersion()
 */
export function getVersion(): string;

/**
 * THE ISPARAMETERSDIRTY FUNCTION
 */
export function isParametersDirty(): any;

/**
 * THE GETPARAMETER FUNCTION
 */
export function getParameter(parameter: VM_Parameter): number;

/**
 * THE SETPARAMETER FUNCTION
 */
export function setParameter(parameter: VM_Parameter, value: any): void;

export * from './vmEnums.d.ts';