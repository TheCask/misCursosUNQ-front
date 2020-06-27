import * as BackAPI from './BackAPI';

// getAll
export async function getUsersAsync(handleSuccess, handleError){
    const response = await fetch('/api/users/');
    BackAPI.handleGet(response, handleSuccess, handleError)
}

// getById
export async function getUserByIdAsync(userId, handleSuccess, handleError){
    const response = await fetch(`/api/user/${userId}`);
    BackAPI.handleGet(response, handleSuccess, handleError)
}

// delete
export async function deleteUserAsync(userId, handleSuccess, handleError){
    const response = await fetch(`/api/user/${userId}`, BackAPI.deleteInit())
    BackAPI.handlePostOrDelete(response, handleSuccess, handleError)    
}

// post
export async function postUserAsync(userJson, handleSuccess, handleError){
    const response = await fetch('/api/user', BackAPI.postInit(userJson));
    BackAPI.handlePostOrDelete(response, handleSuccess, handleError)
}

// search
export async function searchUsersAsync(page, text, handleSuccess, handleError) {
    const response = await fetch(`/api/users/search?text=${text}&page=${page}`)
    BackAPI.handleGet(response, handleSuccess, handleError)
}

// USER COURSES

// getAllByCourseId
export async function getUserCoursesByEmailAsync(userEmail, handleSuccess, handleError){
    const response = await fetch(`/api/user/${userEmail}/courses/`);
    BackAPI.handleGet(response, handleSuccess, handleError)
}