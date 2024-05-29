import Axios from "axios";
import FormData from "form-data";
import has from "lodash/has.js";
Axios.defaults.baseURL = "https://slack.com/api";

export function makeRequest(params = {}) {
  return {
    params,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Bearer ${process.env.SLACK_TOKEN}`,
    },
  };
}

export const headersUpload = {
  headers: {
    "Content-Type": "multipart/form-data",
    Authorization: `Bearer ${process.env.SLACK_TOKEN}`,
  },
};

export function handleResponse(response) {
  return response
    .then((res) => {
      return res.data;
    })
    .catch((errors) => {
      const res = errors.response;
      throw {
        ...res.data,
        status: res.status,
      };
    });
}

export function getFormData(files = [], params = {}) {
  const formData = new FormData();

  if (files.length) {
    files.forEach((item) => {
      if (item.value) {
        formData.append(item.key, item.value);
      }
    });
  }

  for (const key in params) {
    if (has(params, key)) {
      if (params[key] instanceof Array) {
        params[key].forEach((item, idx) => {
          formData.append(`${key}[]`, params[key][idx]);
        });
      } else {
        formData.append(key, params[key]);
      }
    }
  }

  return formData;
}

export default {
  get(path, params = {}) {
    const request = makeRequest(params);
    return handleResponse(Axios.get(path, request));
  },
  post(path, data = {}, params = {}) {
    const request = makeRequest(params);
    return handleResponse(Axios.post(path, data, request));
  },
  put(path, data = {}, params = {}) {
    const request = makeRequest(params);
    return handleResponse(Axios.put(path, data, request));
  },
  delete(path, params = {}) {
    const request = makeRequest(params);
    return handleResponse(Axios.delete(path, request));
  },
  postUpload(path, files = [], params = {}) {
    const formData = getFormData(files, params);
    formData.append(`_method`, "POST");

    return handleResponse(Axios.post(path, formData, headersUpload));
  },
};
