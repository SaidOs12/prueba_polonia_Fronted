const urlBackend="http://20.201.106.54/"
//"http://localhost:8080/"
//"https://polonia-backend-production.up.railway.app/"
//"http://localhost:8080/"
const url2="http://20.201.106.54"
//"https://gimnasioapi-production.up.railway.app/"
//"http://localhost:8080/"

function getAuthorizationHeaders() {
    const token = localStorage.getItem("token");
    const id = JSON.parse(localStorage.getItem("data")).id;
    return {
        "Authorization": "Bearer " + token,
        "Content-type": "application/json",
    };
}
async function makeRequest(endpoint, method = 'GET', data = null) {
    const url = urlBackend + endpoint;
    const headers = getAuthorizationHeaders();

    const requestOptions = {
        method,
        headers,
        body: data ? JSON.stringify(data) : null,
    };

    try {
        const response = await fetch(url, requestOptions);
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        return response;
    } catch (error) {
        console.error("Error making request:", error);
        throw error;
    }
}


export {urlBackend,makeRequest,url2}
