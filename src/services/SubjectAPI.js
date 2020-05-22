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