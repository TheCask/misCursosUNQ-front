import * as BackAPI from './BackAPI';

// getAll
export async function getCoursesAsync(handleSuccess, handleError){
    const response = await fetch('/api/courses/');
    BackAPI.handleGet(response, handleSuccess, handleError)
}

// getById
export async function getCourseByIdAsync(courseId, handleSuccess, handleError){
    const response = await fetch(`/api/course/${courseId}`);
    BackAPI.handleGet(response, handleSuccess, handleError)
}

// delete
export async function deleteCourseAsync(courseId, handleSuccess, handleError){
    const response = await fetch(`/api/course/${courseId}`, BackAPI.deleteInit())
    BackAPI.handlePostOrDelete(response, handleSuccess, handleError)    
}

// post
export async function postCourseAsync(courseJson, handleSuccess, handleError){
    const response = await fetch('/api/course', BackAPI.postInit(courseJson));
    BackAPI.handlePostOrDelete(response, handleSuccess, handleError)
}

// COURSE STUDENT

// getAllByCourseId
export async function getCourseStudentsAsync(courseId, handleSuccess, handleError){
    const response = await fetch(`/api/course/${courseId}/students/`);
    BackAPI.handleGet(response, handleSuccess, handleError)
}

// delete
export async function deleteCourseStudentAsync(studentId, courseId, handleSuccess, handleError){
    const response = await fetch(`/api/course/${courseId}/S${studentId}/`, BackAPI.deleteInit())
    BackAPI.handlePostOrDelete(response, handleSuccess, handleError) 
}

// COURSE TEACHER

// getAllByCourseId
export async function getCourseTeachersAsync(courseId, handleSuccess, handleError){
    const response = await fetch(`/api/course/${courseId}/teachers/`);
    BackAPI.handleGet(response, handleSuccess, handleError)
}

// delete
export async function deleteCourseTeacherAsync(userId, courseId, handleSuccess, handleError){
    const response = await fetch(`/api/course/${courseId}/T${userId}/`, BackAPI.deleteInit())
    BackAPI.handlePostOrDelete(response, handleSuccess, handleError) 
}

// COURSE LESSONS

// getByCourseId
export async function getCourseLessonsAsync(courseId, handleSuccess, handleError){
    const response = await fetch(`/api/course/${courseId}/lessons`);
    BackAPI.handleGet(response, handleSuccess, handleError)
}

// COURSE EVALUATIONS

// post
export async function postCourseEvaluationAsync(courseId, evaluationJson, handleSuccess, handleError){
    const response = await fetch(`/api/course/${courseId}/evaluation`, BackAPI.postInit(evaluationJson));
    BackAPI.handlePostOrDelete(response, handleSuccess, handleError);
}

// delete
export async function deleteCourseEvaluationAsync(evaluationId, handleSuccess, handleError){
    const response = await fetch(`/api/evaluation/${evaluationId}/`, BackAPI.deleteInit())
    BackAPI.handlePostOrDelete(response, handleSuccess, handleError) 
}