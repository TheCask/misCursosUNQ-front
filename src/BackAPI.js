export function getStudents(callbackFunction){
    fetch('/api/students/')
        .then(response => response.json())
        .then(callbackFunction);
}

export async function deleteStudent(studentId, callbackFunction){
    
    await fetch(`/api/student/${studentId}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(callbackFunction);  
}

export function getCourseStudents(courseId, callbackFunction){
    fetch('/api/students/')               // TODO: CHANGE URL to course/id/students
        .then(response => response.json())
        .then(callbackFunction);
}

export async function deleteCourseStudent(studentId, courseId, callbackFunction){
    await fetch(`/api/student/${studentId}`, { // TODO: CHANGE URL
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(callbackFunction); 
}


export default getStudents;