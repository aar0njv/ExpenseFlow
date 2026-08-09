import { transactionApi } from './api';

export const transactionService = {
    async createTransaction(accountId, amount, transactionType) {
        const response = await transactionApi.post('/transactions', {
            account_id: parseInt(accountId, 10),
            amount: parseFloat(amount),
            transaction_type: transactionType,
        });
        return response.data;
    },

    async getTransactionsByAccount(accountId) {
        const response = await transactionApi.get(`/transactions/account/${accountId}`);
        return response.data;
    },
};

export default transactionService;
