import { axiosInstance } from './axios.instance';

function handleResponse<T>(res: { data: { success: boolean; data: T } }): T {
    if (!res.data.success) throw new Error('Неуспешный ответ от API');
    return res.data.data;
}

function handleApiError(err: unknown): never {
    console.error('API Error:', err);
    throw err;
}

export const commandsApi = {
    getCommands: async () =>
        axiosInstance
            .get('/commands/')
            .then(handleResponse)
            .catch(handleApiError),
};
