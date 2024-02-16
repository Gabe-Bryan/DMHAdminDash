
export function getAPIKeyFromURL() {
    let urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("api_key");
}
