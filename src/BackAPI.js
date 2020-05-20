
// STUDENT

// getAll
export async function getStudentsAsync(handleSuccess, handleError){
    const response = await fetch('/api/students/');
    handleGet(response, handleSuccess, handleError)
}

// getById
export async function getStudentByIdAsync(studentId, handleSuccess, handleError){
    const response = await fetch(`/api/student/${studentId}`);
    handleGet(response, handleSuccess, handleError)
}

// post
export async function postStudentAsync(studentJson, handleSuccess, handleError){
    const response = await fetch('/api/student', postInit(studentJson));
      handlePostOrDelete(response, handleSuccess, handleError)
}

// delete
export async function deleteStudentAsync(studentId, handleSuccess, handleError){
    const response = await fetch(`/api/student/${studentId}`, deleteInit())
    handlePostOrDelete(response, handleSuccess, handleError)   
}

// COURSE STUDENT

export async function getCourseStudentsAsync(courseId, handleSuccess, handleError){
    const response = await fetch(`/api/course/${courseId}/students/`);
    handleGet(response, handleSuccess, handleError)
}

export async function deleteCourseStudentAsync(studentId, courseId, handleSuccess, handleError){
    const response = await fetch(`/api/course/${courseId}/${studentId}/`, deleteInit())
    handlePostOrDelete(response, handleSuccess, handleError) 
}

// USER

export async function getUsersAsync(handleSuccess, handleError){
    const response = await fetch('/api/users/');
    handleGet(response, handleSuccess, handleError)
}

// getById
export async function getUserByIdAsync(userId, handleSuccess, handleError){
    const response = await fetch(`/api/user/${userId}`);
    handleGet(response, handleSuccess, handleError)
}

export async function deleteUserAsync(userId, handleSuccess, handleError){
    const response = await fetch(`/api/user/${userId}`, deleteInit())
    handlePostOrDelete(response, handleSuccess, handleError)    
}

export async function postUserAsync(userJson, handleSuccess, handleError){
    const response = await fetch('/api/user', postInit(userJson));
      handlePostOrDelete(response, handleSuccess, handleError)
}

async function handleGet(response, handleSuccess, handleError) {
    if (response.status >= 200 && response.status <= 299) { handleSuccess(await response.json()) } 
    else { handleError(response.status, response.statusText) }
}

function handlePostOrDelete(response, handleSuccess, handleError) {
    if (response.status >= 200 && response.status <= 299) { handleSuccess() } 
    else { handleError(response.status, response.statusText) }
}

function postInit(json) {
    return ({
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(json),
    })
}

function deleteInit() {
    return ({
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
}

export default getStudentsAsync;