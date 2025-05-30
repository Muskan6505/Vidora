const TOKEN_KEY = 'access_token';

export function setToken(token) {
    sessionStorage.setItem(TOKEN_KEY, token);
    }

    export function getToken() {
    return sessionStorage.getItem(TOKEN_KEY);
    }

    export function removeToken() {
    sessionStorage.removeItem(TOKEN_KEY);
    }

    export function isTokenExpired(token) {
    if (!token) return true;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp < Math.floor(Date.now() / 1000);
    } catch (e) {
        return true;
    }
}