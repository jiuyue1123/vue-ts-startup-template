// 格式化时间

/**
 * 格式化时间
 * @param date 时间
 * @returns 格式化后的时间
 */
export function prettyTime(date: string | number | Date) {
  const d = new Date(date);
  const now = Date.now();
  const diff = now - d.getTime();
  const sec = Math.floor(diff / 1000);
  const min = Math.floor(sec / 60);
  const hour = Math.floor(min / 60);
  const day = Math.floor(hour / 24);

  if (sec < 60) return '刚刚';
  if (min < 60) return `${min} 分钟前`;
  if (hour < 24) return `${hour} 小时前`;
  if (day < 2) return '昨天';
  return d.toLocaleDateString();
}

/* 用法
 * prettyTime(new Date()); // 刚刚
 * prettyTime(new Date().getTime() - 1000 * 60 * 60 * 24); // 昨天
 * prettyTime(new Date().getTime() - 1000 * 60 * 60 * 24 * 2); // 2天前
 * prettyTime(new Date().getTime() - 1000 * 60 * 60 * 24 * 3); // 3天前
 */
