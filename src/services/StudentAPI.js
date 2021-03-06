import * as BackAPI from './BackAPI';

// getAll
export async function getStudentsAsync(handleSuccess, handleError){
    const response = await fetch('/api/students/');
    BackAPI.handleGet(response, handleSuccess, handleError)
}

// getById
export async function getStudentByIdAsync(studentId, handleSuccess, handleError){
    const response = await fetch(`/api/student/${studentId}`);
    BackAPI.handleGet(response, handleSuccess, handleError)
}

// post
export async function postStudentAsync(studentJson, handleSuccess, handleError){
    const response = await fetch('/api/student', BackAPI.postInit(studentJson));
    BackAPI.handlePostOrDelete(response, handleSuccess, handleError)
}

// delete
export async function deleteStudentAsync(studentId, handleSuccess, handleError){
    const response = await fetch(`/api/student/${studentId}`, BackAPI.deleteInit())
    BackAPI.handlePostOrDelete(response, handleSuccess, handleError)   
}

// search
export async function searchStudentsAsync(page, text, handleSuccess, handleError) {
    const response = await fetch(`/api/students/search?text=${text}&page=${page}`)
    BackAPI.handleGet(response, handleSuccess, handleError)
}