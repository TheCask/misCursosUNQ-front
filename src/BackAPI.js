export function getStudents(callbackFunction){
    fetch('/api/students/')
        .then(response => response.json())
        .then(callbackFunction);
}

export async function deleteStudent(id, callbackFunction){
    
    await fetch(`/api/student/${id}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(callbackFunction);  
}

export default getStudents;