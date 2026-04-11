import express from 'express';

import { ExistUser } from './repositories/user.repository.js';
import { AddUserService, DeleteUserService, GetUserService, GetUsersService, UpdateUserService, ValidateAddUser, ValidateUpdateUser } from './services/user.services.js';
import { LogMethod } from './middlewares/log.js';

const app = express();

app.use(express.json());

app.use((req,res,next) =>{
    let start = Date.now();

    res.on('finish', () =>{
        LogMethod(req, start, res.status)
    })

    next();
})

//Endpoint para ver si la API funciona.
app.get('/', (req, res) => {
    res.send('API funcionando');
    console.log("[GET]:Verificar si la API funciona.")
});

//Endpoint que devuelve todos los datos.
app.get('/users', (req,res) =>{
    let datausers = GetUsersService(req.query);
    console.log("[GET|Success]: Obtener todos los usuarios.")
    return res.json(datausers)
})

//Endpoint que devuelve un usuario en especifico mediante su ID
app.get('/users/:id', (req,res) =>{
    let id = req.params.id;
    let user = GetUserService(id); 
    if(user === null)
    {
        res.status(404).json("No existe un usuario con ese ID.");
        console.log(`[GET|Failed]: Obtener el usuario del ID ${id}.`)
    }
    else
    {
        res.json(user);
        console.log(`[GET]: Obtener el usuario del ID ${id}.`)
    }
})

//Endpoint para agregar un usuario
app.post('/users', (req,res) =>{
    let validate = ValidateAddUser(req.body);
    if(validate[0])
    {
        let user = AddUserService(req.body);
        res.status(201).json(user);
        console.log(`[POST|Success]: Se agrego al usuario ${user.name}.`)
    }
    else
    {
        console.log(`[POST|Failet]: ${validate[1]}`)
        res.status(400).json(validate[1])
    }
})


//Endpoint para actualizar un usuario
app.put('/users/:id', (req,res) =>{
    let id = req.params.id;
    if(id != req.body.id)
    {
        return res.status(400).json("Debes ingresar el mismo id en el JSON.");
    }
    
    let validate = ValidateUpdateUser(req.body)
    if(validate[0])
    {
        let user = UpdateUserService(req.body);
        res.json(user);
        console.log(`[PUT|Success]: Se modifico al usuario ${user.name}.`)
    }
    else
    {
        console.log(`[PUT|Failet]: ${validate[1]}`)
        res.status(400).json(validate[1])
    }     
})

//Endpoint para eliminar un usuario
app.delete('/users/:id',(req,res) =>{
    let id = req.params.id;

    if(!ExistUser(id)){
        console.log(`[DELETE|Failet]: No existe usuario con el id ingresado.`)
        res.status(404).json(`No existe usuario con ese ID.`);
    }
    else
    {
        DeleteUserService(id);
        console.log(`[DELETE|Successes]: Se elimino un usuario.`)
        res.status(204).json('Se elimino el usuario.');
    }
})

app.listen(3000, () => {
    console.log('Servidor en http://localhost:3000');
});

