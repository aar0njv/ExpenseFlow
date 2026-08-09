import { reportApi } from './api';

export const reportService = {
    async getFinancialReport(accountId) {
        const response = await reportApi.get(`/reports/account/${accountId}`);
        return response.data;
    },
};

export default reportService;
