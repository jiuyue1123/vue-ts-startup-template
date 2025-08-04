// 格式化金额

/**
 * 格式化金额
 * @param n 金额
 * @param digits 小数位数
 * @returns 格式化后的金额
 */
export const formatCurrency = (n: number | string, digits = 2) =>
  Number(n).toLocaleString('zh-CN', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });

/**
 * 格式化百分比
 * @param n 百分比
 * @returns 格式化后的百分比
 */
export const formatPercent = (n: number) => `${(n * 100).toFixed(2)}%`;

/*
 * 使用方法
 * formatCurrency(1000000); // 1,000,000.00
 * formatPercent(0.123456); // 12.35%
 */
