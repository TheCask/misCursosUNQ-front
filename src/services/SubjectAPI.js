import * as BackAPI from './BackAPI';

export async function getSubjectsAsync(handleSuccess, handleError){
    const response = await fetch('/api/subjects/');
    BackAPI.handleGet(response, handleSuccess, handleError)
}

// getById
export async function getSubjectByIdAsync(subjectId, handleSuccess, handleError){
    const response = await fetch(`/api/subject/${subjectId}`);
    BackAPI.handleGet(response, handleSuccess, handleError)
}

// delete
export async function deleteSubjectAsync(subjectCode, handleSuccess, handleError){
    const response = await fetch(`/api/subject/${subjectCode}`, BackAPI.deleteInit())
    BackAPI.handlePostOrDelete(response, handleSuccess, handleError)    
}

// post
export async function postSubjectAsync(subjectJson, handleSuccess, handleError){
    const response = await fetch('/api/subject', BackAPI.postInit(subjectJson));
    BackAPI.handlePostOrDelete(response, handleSuccess, handleError)
}

// SUBJECT COORDINATOR

// getAllBySubjectId
export async function getSubjectCoordinatorsAsync(subjectCode, handleSuccess, handleError){
    const response = await fetch(`/api/subject/${subjectCode}/coordinators/`);
    BackAPI.handleGet(response, handleSuccess, handleError)
}

// delete
export async function deleteSubjectCoordinatorAsync(userId, subjectCode, handleSuccess, handleError){
    const response = await fetch(`/api/subject/${subjectCode}/${userId}/`, BackAPI.deleteInit())
    BackAPI.handlePostOrDelete(response, handleSuccess, handleError)
}

// updateCoordinators
export async function updateSubjectCoordinatorsAsync(subjectCode, coordinatorsListJson, handleSuccess, handleError){
    const response = await fetch(`/api/subject/${subjectCode}/coordinators/`, BackAPI.postInit(coordinatorsListJson));
    BackAPI.handlePostOrDelete(response, handleSuccess, handleError)
}

// SUBJECT COURSES
// getById
export async function getSubjectCourseQtyAsync(subjectCode, handleSuccess, handleError){
    const response = await fetch(`/api/subject/${subjectCode}/courseQty`);
    BackAPI.handleGet(response, handleSuccess, handleError)
}