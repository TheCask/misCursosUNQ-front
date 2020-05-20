
// STUDENT

// getAll
export async function getStudentsAsync(handleSuccess, handleError){
    const response = await fetch('/api/students/');
    if (response.status >= 200 && response.status <= 299) {
        handleSuccess(await response.json())
    } else {
        handleError(response.status, response.statusText)
    }
}

// getById
export async function getStudentByIdAsync(studentId, handleSuccess, handleError){
    const response = await fetch(`/api/student/${studentId}`);
    if (response.status >= 200 && response.status <= 299) {
        handleSuccess(await response.json())
    } else {
        handleError(response.status, response.statusText)
    }
}

// post
export async function postStudentAsync(studentJson, handleSuccess, handleError){
    const response = await fetch('/api/student', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(studentJson),
      });
    if (response.status >= 200 && response.status <= 299) {
        handleSuccess()
    } else {
        handleError(response.status, response.statusText)
    }
}

// delete
export async function deleteStudentAsync(studentId, handleSuccess, handleError){
    
    const response = await fetch(`/api/student/${studentId}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    if (response.status >= 200 && response.status <= 299) {
        handleSuccess()
    } else {
        handleError(response.status, response.statusText)
    }    
}

// COURSE STUDENT

export async function getCourseStudentsAsync(courseId, handleSuccess, handleError){
    const response = await fetch(`/api/course/${courseId}/students/`);         // TODO: CHANGE URL
    if (response.status >= 200 && response.status <= 299) {
        handleSuccess(await response.json())
    } else {
        handleError(response.status, response.statusText)
    }
}

export async function deleteCourseStudentAsync(studentId, courseId, handleSuccess, handleError){
    
    const response = await fetch(`/api/student/${studentId}`, {     // TODO: CHANGE URL
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    if (response.status >= 200 && response.status <= 299) {
        handleSuccess()
    } else {
        handleError(response.status, response.statusText)
    }    
}

// USER
export async function getUsersAsync(handleSuccess, handleError){
    const response = await fetch('/api/users/');
    if (response.status >= 200 && response.status <= 299) {
        handleSuccess(await response.json())
    } else {
        handleError(response.status, response.statusText)
    }
}

// getById
export async function getUserByIdAsync(userId, handleSuccess, handleError){
    const response = await fetch(`/api/user/${userId}`);
    if (response.status >= 200 && response.status <= 299) {
        handleSuccess(await response.json())
    } else {
        handleError(response.status, response.statusText)
    }
}

export async function deleteUserAsync(userId, handleSuccess, handleError){
    
    const response = await fetch(`/api/user/${userId}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    if (response.status >= 200 && response.status <= 299) {
        handleSuccess()
    } else {
        handleError(response.status, response.statusText)
    }    
}

export async function postUserAsync(userJson, handleSuccess, handleError){
    const response = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userJson),
      });
    if (response.status >= 200 && response.status <= 299) {
        handleSuccess()
    } else {
        handleError(response.status, response.statusText)
    }
}

export default getStudentsAsync;


