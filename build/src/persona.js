"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Persona = void 0;
class Persona {
    constructor() {
        this.#nombre = "";
    }
    #nombre;
    set nombre(value) {
        this.#nombre = value;
    }
    get nombre() {
        return this.#nombre;
    }
}
exports.Persona = Persona;
//# sourceMappingURL=persona.js.map