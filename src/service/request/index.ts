import { createAlova } from 'alova';
import adapterFetch from 'alova/fetch';

const alovaInstance = createAlova({
  baseURL: '/api',
  // 禁用缓存
  cacheFor: {
    GET: 0,
    POST: 0,
    PUT: 0,
    PATCH: 0,
    DELETE: 0,
  },
  requestAdapter: adapterFetch(),
  responded: (response) => response.json(),
});

export default alovaInstance;
