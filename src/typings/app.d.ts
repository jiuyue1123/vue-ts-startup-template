declare namespace App {
  namespace Service {
    /** 后端服务响应数据结构 */
    interface Response<T = unknown> {
      /** 后端服务返回的code */
      code: string;
      /** 后端服务返回的提示信息 */
      msg: string;
      /** 后端服务返回的数据 */
      data: T;
    }
  }
}
