import { createAlova, Method } from 'alova';
import adapterFetch from 'alova/fetch';

interface FlatResponse<R = unknown> {
  data: R | null;
  error: Error | null;
}

const {
  VITE_SERVICE_SUCCESS_CODE,
  // VITE_SERVICE_LOGOUT_CODES,
  // VITE_SERVICE_MODAL_LOGOUT_CODES,
  // VITE_SERVICE_EXPIRED_TOKEN_CODES,
} = import.meta.env as Env.ImportMeta;

const successCodes = VITE_SERVICE_SUCCESS_CODE.split(',').map((c) => c.trim());

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
  return successCodes.includes(String(code));
}

function createFlatRequest() {
  // 通用请求方法
  async function request<R>(method: Method): Promise<FlatResponse<R>> {
    try {
      const json = (await method) as App.Service.Response<R>;
      const { code, data, msg } = json || {};
      if (isSuccessCode(code as string)) {
        return { data: data ?? null, error: null };
      } else {
        // 错误信息优先用后端 msg
        return { data: null, error: new Error(msg || '请求错误') };
      }
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * 统一的 HTTP 方法请求处理函数
   *
   * @param methodName - HTTP 方法名称 ('Get' | 'Post' | 'Put' | 'Delete')
   * @param url - 请求的 URL 路径
   * @param dataOrParams - GET/DELETE 方法作为查询参数，POST/PUT 方法作为请求体数据
   * @param params - POST/PUT 方法的查询参数（可选）
   * @returns Promise<FlatResponse<R>> 返回扁平化的响应结果
   */
  function methodRequest<R>(
    methodName: 'Get' | 'Post' | 'Put' | 'Delete',
    url: string,
    dataOrParams?: any,
    params?: any,
  ) {
    // 根据 HTTP 方法类型创建对应的请求
    const isGetOrDelete = methodName === 'Get' || methodName === 'Delete';

    const method = isGetOrDelete
      ? baseInstance[methodName]<R>(url, { params: dataOrParams })
      : baseInstance[methodName]<R>(url, dataOrParams, { params });

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
