import axios from 'axios';

const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';

export const ACCOUNT_SERVICE_URL = `http://${host}:8001`;
export const TRANSACTION_SERVICE_URL = `http://${host}:8002`;
export const REPORT_SERVICE_URL = `http://${host}:8003`;
export const accountApi = axios.create({
    baseURL: ACCOUNT_SERVICE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const transactionApi = axios.create({
    baseURL: TRANSACTION_SERVICE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const reportApi = axios.create({
    baseURL: REPORT_SERVICE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const setAuthToken = (token) => {
    if (token) {
        accountApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete accountApi.defaults.headers.common['Authorization'];
    }
};
