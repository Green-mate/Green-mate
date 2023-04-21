import axios from 'https://cdn.jsdelivr.net/npm/axios@1.3.6/+esm';

// axios GET
async function getWithoutToken(endpoint, params = '') {
  const apiUrl = `${endpoint}/${params}`;
  console.log(`%cGET 요청: ${apiUrl} `, 'color: #a25cd1;');

  try {
    const res = await axios.get(apiUrl);
    const result = res.data;
    return result;
  } catch (error) {
    const { reason } = error.response.data;

    throw new Error(reason);
  }
}

// axios GET with Authorization(token)
async function get(endpoint, params = '') {
  const apiUrl = `${endpoint}/${params}`;
  console.log(`%cGET 요청: ${apiUrl} `, 'color: #a25cd1;');

  try {
    const res = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const result = res.data;
    return result;
  } catch (error) {
    const { reason } = error.response.data;
    throw new Error(reason);
  }
}

// axios POST
async function postWithoutToken(endpoint, data) {
  const apiUrl = endpoint;
  console.log(`%cPOST 요청: ${apiUrl}`, 'color: #296aba;');
  console.log(`%cPOST 요청 데이터: ${data}`, 'color: #296aba;');

  try {
    const response = await axios.post(apiUrl, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = response.data;
    return result;
  } catch (error) {
    if (error.response) {
      const { reason } = error.response.data;
      throw new Error(reason);
    } else {
      throw new Error('Network Error');
    }
  }
}

// axios POST with Authorization(token)
async function post(endpoint, data) {
  const apiUrl = endpoint;
  console.log(`%cPOST 요청: ${apiUrl}`, 'color: #296aba;');
  console.log(`%cPOST 요청 데이터: ${data}`, 'color: #296aba;');

  try {
    const response = await axios.post(apiUrl, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    const result = response.data;
    return result;
  } catch (error) {
    if (error.response) {
      const { reason } = error.response.data;
      throw new Error(reason);
    } else {
      throw new Error('Network Error');
    }
  }
}

// axios PUT with Authorization(token)
async function put(endpoint, params = '', data) {
  // const apiUrl = `/api/admin/categories/${categoryId}`;
  const apiUrl = `${endpoint}/${params}`;

  console.log(`%cPUT 요청: ${apiUrl}`, 'color: #059c4b;');
  console.log(`%cPUT 요청 데이터: ${data}`, 'color: #059c4b;');

  try {
    const response = await axios.put(apiUrl, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    const result = response.data;
    return result;
  } catch (error) {
    if (error.response) {
      const { reason } = error.response.data;
      throw new Error(reason);
    } else {
      throw new Error('Network Error');
    }
  }
}

// axios PATCH with Authorization(token)
async function patch(endpoint, params = '', data) {
  const apiUrl = `${endpoint}/${params}`;
  console.log(`%cPATCH 요청: ${apiUrl}`, 'color: #059c4b;');
  console.log(`%cPATCH 요청 데이터: ${data}`, 'color: #059c4b;');
  try {
    const response = await axios.patch(apiUrl, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    const result = response.data;
    return result;
  } catch (error) {
    if (error.response) {
      const { reason } = error.response.data;
      throw new Error(reason);
    } else {
      throw new Error('Network Error');
    }
  }
}

// DELETE with Authorization(token)
async function del(endpoint, params = '', data = {}) {
  const apiUrl = `${endpoint}/${params}`;

  console.log(`DELETE 요청 ${apiUrl}`);
  console.log(`DELETE 요청 데이터: ${data}`);

  try {
    const response = await axios.delete(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      data: data,
    });

    const result = response.data;
    return result;
  } catch (error) {
    if (error.response) {
      const { reason } = error.response.data;
      throw new Error(reason);
    } else {
      throw new Error('Network Error');
    }
  }
}

// 아래처럼 export하면, import * as Api 로 할 시 Api.get, Api.post 등으로 쓸 수 있음.
export {
  getWithoutToken,
  get,
  postWithoutToken,
  post,
  patch,
  put,
  del as delete,
};
