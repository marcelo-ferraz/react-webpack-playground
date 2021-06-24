export default class TypeNotSupportedError extends TypeError {
    constructor(type, innerError) {
        super(`The type "${type}" is not yet supported`);
        this.innerError = innerError;
    }
}
