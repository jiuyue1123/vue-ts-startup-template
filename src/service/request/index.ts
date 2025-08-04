import { createAlova, Method } from 'alova';
import adapterFetch from 'alova/fetch';

interface FlatResponse<R = unknown> {
  data: R | null;
  error: Error | null | unknown;
}

const {
  VITE_SERVICE_SUCCESS_CODE,
  // VITE_SERVICE_LOGOUT_CODES,
  // VITE_SERVICE_MODAL_LOGOUT_CODES,
  // VITE_SERVICE_EXPIRED_TOKEN_CODES,
} = import.meta.env as Env.ImportMeta;

// base实例
const baseInstance = createAlova({
  baseURL: '/api',
  // 禁用缓存
  cacheFor: null,
  requestAdapter: adapterFetch(),
  responded: (response) => response.json(),
});

function isSuccessCode(code: string | number): boolean {
  // 支持字符串和数字类型的 code
  return VITE_SERVICE_SUCCESS_CODE.split(',')
    .map((c) => c.trim())
    .includes(String(code));
}

function createFlatRequest() {
  // 通用请求方法
  async function request<R>(method: Method): Promise<FlatResponse<R>> {
    try {
      const json = (await baseInstance.Request(method)) as Partial<App.Service.Response<R>>;
      const { code, data, msg } = json || {};
      if (isSuccessCode(code as string)) {
        return { data: data ?? null, error: null };
      } else {
        // 错误信息优先用后端 msg
        return { data: null, error: new Error(msg || 'Request error') };
      }
    } catch (error) {
      return { data: null, error };
    }
  }

  // 精简请求方法
  function methodRequest<R>(
    methodName: 'Get' | 'Post' | 'Put' | 'Delete',
    url: string,
    dataOrParams?: any,
    params?: any,
  ) {
    let method;
    if (methodName === 'Get' || methodName === 'Delete') {
      method = baseInstance[methodName]<R>(url, { params: dataOrParams });
    } else {
      method = baseInstance[methodName]<R>(url, dataOrParams, { params });
    }
    return request<R>(method);
  }

  return {
    request,
    get<R>(url: string, params?: Record<string, any>) {
      return methodRequest<R>('Get', url, params);
    },
    post<R>(url: string, data?: Record<string, any>, params?: Record<string, any>) {
      return methodRequest<R>('Post', url, data, params);
    },
    put<R>(url: string, data?: Record<string, any>, params?: Record<string, any>) {
      return methodRequest<R>('Put', url, data, params);
    },
    delete<R>(url: string, params?: Record<string, any>) {
      return methodRequest<R>('Delete', url, params);
    },
  };
}

const request = createFlatRequest();

export default request;
