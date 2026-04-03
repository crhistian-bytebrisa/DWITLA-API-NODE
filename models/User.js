//Clase usuario para la aplicacion.
export class User{
    constructor(id, nombre, email, edad, active = true) {
        this.id = id;
        this.name = nombre;
        this.email = email;
        this.age = edad;
        this.active = active;
    }
}