export enum LogLevel {
    debug = 0,
    warning = 1,
    error = 2
}

export class Util {
    static globalLogLevel = 0;

    static log(text: string, logLevel = LogLevel.debug) {
        if (logLevel >= this.globalLogLevel) {
            console.log(text);
        }
    }

    static equals(a: number, b: number) {
        return Math.abs(a - b) < 2;
    }

}
