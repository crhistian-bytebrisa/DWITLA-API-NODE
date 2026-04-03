import { User } from "../models/User.js";
import { AddUser, DeleteUser, ExistEmail, ExistEmailWithDiferentId, ExistUser, GetUser, GetUsers, ID, UpdateUser } from "../repositories/user.repository.js";

export function ValidateAddUser(UserData)
{
    if(!UserData.email.includes("@") || UserData.email !== UserData.email.replace(/\s/g, ""))
    {
        return [false,"Debe tener un email valido."];
    }

    if(ExistEmail(UserData.email))
    {
        return [false,"El Email ya existe."];
    }

    if(UserData.age < 18)
    {
        return [false,"Debes ser mayor a 18."];
    }

    return [true,"funciono"];
}

export function ValidateUpdateUser(UserData)
{
    if(!ExistUser(UserData.id))
    {
        return [false,"No existe un usuario con ese Id."];
    }

    if(!UserData.email.includes("@") || UserData.email !== UserData.email.replace(/\s/g, ""))
    {
        return [false,"Debe tener un email valido."];
    }

    if(ExistEmailWithDiferentId(UserData.email, UserData.id))
    {
        return [false,"El Email ya existe."];
    }

    if(UserData.age < 18)
    {
        return [false,"Debes ser mayor a 18."];
    }

    return [true,"funciono"];
}

export function AddUserService(UserData)
{
    let user = new User(ID, UserData.name, UserData.email, UserData.age);
    user.active = true;
    user = AddUser(user);
    return user;
}

export function UpdateUserService(UserData)
{
    let user = new User(UserData.id, UserData.name, UserData.email, UserData.age, UserData.active);
    user = UpdateUser(user);
    return user;
}

export function DeleteUserService(id)
{
    DeleteUser(id);
}

export function GetUserService(id)
{
    return GetUser(id);
}

export function GetUsersService(UserRequest)
{
    let users = GetUsers(UserRequest);
    
    return {        
        count: users[0].length,
        total: users[1],
        page: UserRequest.page != null? Number(UserRequest.page) : 1,
        limit: UserRequest.limit != null? Number(UserRequest.limit) : 10,
        data: users[0]
    }
}