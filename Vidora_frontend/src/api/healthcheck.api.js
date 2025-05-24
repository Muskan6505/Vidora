import axios from 'axios';

export const healthCheck = async () => {
    try{
        const response = axios.get('/healthcheck', {
            withCredentials:true
        })

        return response;
    }catch(error){
        throw error.response?.data || error;
    }
}