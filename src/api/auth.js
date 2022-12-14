import axios from 'axios';
const baseUrl = 'https://todo-list.alphacamp.io/api/auth';
export const login = async (payload) => {
  try {
    const { username, password } = payload;
    const { data } = await axios.post(`${baseUrl}/login`, {
      username,
      password,
    });

    const { authToken } = data;
    if (authToken) {
      return { success: true, ...data };
    }
    return data;
  } catch (error) {
    console.error('[Login Failed]:', error);
  }
};

export const register = async (payload) => {
  try {
    const { username, email, password } = payload;
    const { data } = await axios.post(`${baseUrl}/register`, {
      username,
      email,
      password,
    });
    const { authToken } = data;
    if (authToken) {
      return { success: true, ...data };
    }
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const checkPermission = async(authToken) => {
  try {
    const response = await axios.get(`${baseUrl}/test-token`, {
      headers: {
        Authorization: 'Bearer ' + authToken,
      },
    });

    return response.data.success
  } catch(error) {
    console.error('[Check Permission Failed]:', error);
  }
}