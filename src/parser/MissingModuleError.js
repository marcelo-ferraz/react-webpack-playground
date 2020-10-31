export default class MissingModuleError extends TypeError {
    constructor(msg, innerError) {
        super(msg);
        this.innerError = innerError;
    }
}
