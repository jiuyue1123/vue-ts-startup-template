import request from '../request';

interface LoginVO {
  token: string;
}

export function fetchLogin(username: string, password: string) {
  return request.post<LoginVO>('/auth/login', { username, password });
}
