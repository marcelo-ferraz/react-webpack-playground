export default class MissingModuleError extends TypeError {
    constructor(path, innerError) {
        super(`Couldn't find a module for ${path}`);
        this.innerError = innerError;
    }
}
