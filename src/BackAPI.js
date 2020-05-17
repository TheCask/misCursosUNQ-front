export async function getStudentsAsync(handleSuccess, handleError){
    const response = await fetch('/api/students/');
    if (response.status >= 200 && response.status <= 299) {
        handleSuccess(await response.json())
    } else {
        handleError(response.status, response.statusText)
    }
}

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

export async function getCourseStudentsAsync(courseId, handleSuccess, handleError){
    const response = await fetch('/api/students/');         // TODO: CHANGE URL
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



export default getStudentsAsync;


