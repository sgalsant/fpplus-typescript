export class Persona {
    #nombre: string = "";
   
    public set nombre(value: string) {
        this.#nombre = value;
    }

    public get nombre() {
        return this.#nombre;
    }
}