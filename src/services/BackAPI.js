// AUXILIAR

export async function handleGet(response, handleSuccess, handleError) {
    if (response.status >= 200 && response.status <= 299) { handleSuccess(await response.json()) } 
    else { handleError(response.status, response.statusText) }
}

export async function handlePostOrDelete(response, handleSuccess, handleError) {
    if (response.status >= 200 && response.status <= 299) { handleSuccess(await response) } 
    else { handleError(response.status, response.statusText) }
}

export function postInit(json) {
    return ({
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(json),
    })
}

export function deleteInit() {
    return ({
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
}

export function authInit(json) {
    return ({
        credentials: 'include',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(json)
        }
    )
}