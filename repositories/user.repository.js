import fs from 'fs';
import { User } from '../models/User.js';

//#region Base de datos simulada
const dbpath = './data/datos.json'
const idpath = './data/id.json'

if(!fs.existsSync(dbpath))
{
    fs.writeFileSync(dbpath,JSON.stringify([]));
}

let DB = JSON.parse(fs.readFileSync(dbpath));

if(!fs.existsSync(idpath))
{
    fs.writeFileSync(idpath,JSON.stringify(1));
}

export let ID = JSON.parse(fs.readFileSync(idpath));

//#endregion

export function ExistUser(id)
{
    return DB.some(x => x.id === Number(id));
}

export function ExistEmail(email)
{
    return DB.some(x => x.email === email);
}

export function ExistEmailWithDiferentId(email,id)
{
    return DB.some(x => x.email === email && x.id != id);
}

//#region  CRUD sencillo
function SaveChanges()
{
    fs.writeFileSync(dbpath,JSON.stringify(DB));
    fs.writeFileSync(idpath,JSON.stringify(ID));
}

export function GetUsers(UserRequest)
{
    let DBFilter = DB;
    let count;

    if(UserRequest == null){
        return DBFilter;
    }

    if(UserRequest.active != null)
    {
        const active = UserRequest.active === "true";
        DBFilter = DBFilter.filter(x => x.active === active);
    }

    if(UserRequest.name != null)
    {
        DBFilter = DBFilter.filter(x => x.name.toLowerCase().includes(UserRequest.name.toLowerCase()));
    }   

    if(UserRequest.minage != null)
    {
        DBFilter = DBFilter.filter(x => x.age >= UserRequest.minage);
    }

    if(UserRequest.maxage != null)
    {
        DBFilter = DBFilter.filter(x => x.age <= UserRequest.maxage);
    }

    count = DBFilter.length;
    let page = UserRequest.page != null? Number(UserRequest.page) : 1;
    let limit = UserRequest.limit != null? Number(UserRequest.limit) : 10;
    const start = (page - 1) * limit;
    const end = page * limit;
    DBFilter = DBFilter.slice(start,end)

    return [DBFilter,count];
}

export function GetUser(id)
{
    return DB.find(x => x.id === Number(id));
}

export function AddUser(user)
{
    DB.push(user);
    ID += 1;
    SaveChanges();
    return user;
}

export function UpdateUser(user)
{
    const index = DB.findIndex(x => x.id === user.id);
    if(index !== -1){
        DB[index] = user;
        SaveChanges();
        return user;
    }
}

export function DeleteUser(id)
{
    DB = DB.filter(x => x.id !== Number(id));
    SaveChanges();
}
//#endregion