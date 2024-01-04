export class DataException extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'DataException';
    }
}