import axios from "axios";

export const BASE_URL = "https://y23t3h-8081.csb.app/api";

async function fetchModel(url, options = {}) {
  try {
    const token = localStorage.getItem("token");

    const config = {
      url: `${BASE_URL}${url}`,
      method: options.method || "GET",
      data: options.data || null,
      headers: {
        ...options.headers,
      },
    };

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await axios(config);
    return { data: response.data };
  } catch (error) {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
    }
    throw error;
  }
}

export default fetchModel;
