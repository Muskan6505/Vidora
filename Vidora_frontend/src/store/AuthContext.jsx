import { createContext, useReducer, useEffect } from 'react';
import { getToken, isTokenExpired, removeToken } from '../features/tokenServices';

const initialState = {
    isAuthenticated: false,
    token: null,
};

function authReducer(state, action) {
    switch (action.type) {
        case 'LOGIN':
        return { isAuthenticated: true, token: action.payload };
        case 'LOGOUT':
        return { isAuthenticated: false, token: null };
        default:
        return state;
    }
}

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    useEffect(() => {
        const token = getToken();
        if (token && !isTokenExpired(token)) {
        dispatch({ type: 'LOGIN', payload: token });
        } else {
        removeToken();
        dispatch({ type: 'LOGOUT' });
        }
    }, []);

    return (
        <AuthContext.Provider value={{ authState: state, dispatch }}>
        {children}
        </AuthContext.Provider>
    );
};
