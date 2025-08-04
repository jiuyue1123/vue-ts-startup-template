// 本地存储
interface StorageData<T> {
  value: T;
  expire: number | null;
}

export const storage = {
  /**
   * 设置本地存储
   * @param key 键
   * @param value 值
   * @param expire 过期时间(秒)
   */
  set<T>(key: string, value: T, expire?: number) {
    const data: StorageData<T> = {
      value,
      expire: expire ? Date.now() + expire * 1000 : null,
    };
    localStorage.setItem(key, JSON.stringify(data));
  },
  /**
   * 获取本地存储
   * @param key 键
   * @returns 值
   */
  get<T>(key: string): T | null {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    try {
      const { value, expire } = JSON.parse(raw) as StorageData<T>;
      if (expire && Date.now() > expire) {
        localStorage.removeItem(key);
        return null;
      }
      return value;
    } catch {
      return null;
    }
  },
  /**
   * 删除本地存储
   * @param key 键
   */
  remove(key: string) {
    localStorage.removeItem(key);
  },
};

/* 用法
 * storage.set('token', 'abc123', 60 * 60); // 1小时
 * const token = storage.get<string>('token');
 */
