import { accountApi } from './api';

export const authService = {
    async login(email, password) {
        const response = await accountApi.post('/login', { email, password });
        return response.data;
    },

    async register(name, email, password, balance) {
        const response = await accountApi.post('/accounts', {
            name,
            email,
            password,
            balance: parseFloat(balance) || 0,
        });
        return response.data;
    },

    async getCurrentUser(token) {
        const response = await accountApi.get('/accounts/me', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    },
};

export default authService;
