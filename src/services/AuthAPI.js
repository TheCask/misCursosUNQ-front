import * as BackAPI from './BackAPI';

// auth config
const config = require('../login/authConfig');

/* USER */

// getAppUserById
export async function getAppUserByIdAsync(handleSuccess, handleError){
    // fetch won't send cookies unless you set credentials
    const response = await fetch(`http://localhost:${config.serverPort}/getAppUser`, {credentials: 'include'});
    BackAPI.handleGet(response, handleSuccess, handleError)
}

// getGlobalUserById
export async function getGlobalUserByIdAsync(handleSuccess, handleError){
    // fetch won't send cookies unless you set credentials
    const response = await fetch(`http://localhost:${config.serverPort}/getGlobalUser`, {credentials: 'include'});
    BackAPI.handleGet(response, handleSuccess, handleError)
}

// postGlobalUserAsync
export async function postGlobalUserAsync(userJson, handleSuccess, handleError){
    const response = await fetch(`http://localhost:${config.serverPort}/setGlobalUser`, BackAPI.authInit(userJson));
    BackAPI.handlePostOrDelete(response, handleSuccess, handleError)
}