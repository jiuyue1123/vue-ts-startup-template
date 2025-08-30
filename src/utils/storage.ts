/**
 * 浏览器存储工具（localStorage / sessionStorage）
 * - SSR 安全：在无 window 环境下不报错
 * - 自动 JSON 序列化/反序列化
 * - 不可用时（如隐私模式）使用内存降级
 */

type NullableStorage = Storage | undefined;

interface StorageAPI {
  get: <T = unknown>(key: string, defaultValue?: T | null) => T | null;
  set: (key: string, value: unknown) => boolean;
  remove: (key: string) => void;
  clear: () => void;
  has: (key: string) => boolean;
  keys: () => string[];
}

function isStorageUsable(storage: NullableStorage): boolean {
  if (!storage) return false;
  try {
    const testKey = '__trace_lattice_storage_test__';
    storage.setItem(testKey, '1');
    storage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

function safeStringify(value: unknown): string {
  try {
    return JSON.stringify(value);
  } catch {
    // 循环引用或不可序列化对象时，退化为 String 表示
    return String(value);
  }
}

function safeParse<T = unknown>(raw: string | null): T | null {
  if (raw == null) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    // 非 JSON 字符串，直接返回原始字符串（断言为 unknown 再转 T）
    return raw as unknown as T;
  }
}

function createMemoryFallback(): StorageAPI {
  const map = new Map<string, string>();

  return {
    get<T = unknown>(key: string, defaultValue: T | null = null): T | null {
      return safeParse<T>(map.get(key) ?? null) ?? defaultValue;
    },
    set(key: string, value: unknown): boolean {
      map.set(key, safeStringify(value));
      return true;
    },
    remove(key: string): void {
      map.delete(key);
    },
    clear(): void {
      map.clear();
    },
    has(key: string): boolean {
      return map.has(key);
    },
    keys(): string[] {
      return Array.from(map.keys());
    },
  };
}

function createStorageAPI(storage: NullableStorage): StorageAPI {
  const usable = isStorageUsable(storage);
  if (!usable) return createMemoryFallback();

  const s = storage as Storage;

  return {
    get<T = unknown>(key: string, defaultValue: T | null = null): T | null {
      return safeParse<T>(s.getItem(key)) ?? defaultValue;
    },
    set(key: string, value: unknown): boolean {
      try {
        s.setItem(key, safeStringify(value));
        return true;
      } catch {
        return false;
      }
    },
    remove(key: string): void {
      try {
        s.removeItem(key);
      } catch {
        // ignore
      }
    },
    clear(): void {
      try {
        s.clear();
      } catch {
        // ignore
      }
    },
    has(key: string): boolean {
      try {
        return s.getItem(key) !== null;
      } catch {
        return false;
      }
    },
    keys(): string[] {
      try {
        const result: string[] = [];
        for (let i = 0; i < s.length; i += 1) {
          const k = s.key(i);
          if (k != null) result.push(k);
        }
        return result;
      } catch {
        return [];
      }
    },
  };
}

const hasWindow = typeof window !== 'undefined';

/** localStorage API 包装 */
export const localStorageUtil: StorageAPI = createStorageAPI(
  hasWindow ? window.localStorage : undefined,
);

/** sessionStorage API 包装 */
export const sessionStorageUtil: StorageAPI = createStorageAPI(
  hasWindow ? window.sessionStorage : undefined,
);

/**
 * 获取指定类型的存储包装
 * @param type 'local' | 'session'
 */
export function getStorage(type: 'local' | 'session' = 'local'): StorageAPI {
  return type === 'local' ? localStorageUtil : sessionStorageUtil;
}

export const localStg = getStorage('local');
export const sessionStg = getStorage('session');
