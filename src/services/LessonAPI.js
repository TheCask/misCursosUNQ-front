import * as BackAPI from './BackAPI';

// post
export async function postLessonAsync(lessonJson, handleSuccess, handleError){
    const response = await fetch('/api/lesson', postInit(lessonJson));
    BackAPI.handlePostOrDelete(response, handleSuccess, handleError)
}