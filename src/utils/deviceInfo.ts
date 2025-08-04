/**
 * 设备环境信息接口定义
 */
interface DeviceEnvironmentInfo {
  basic: {
    timestamp: string;
    url: string;
    referrer: string;
    userAgent: string;
    language: string;
    languages: readonly string[];
    online: boolean;
    cookieEnabled: boolean;
    domain: string;
  };
  browser: {
    name: string;
    version: string;
    vendor: string;
    hardwareConcurrency: number;
    product: string;
  };
  system: {
    name: string;
    version: string;
  };
  device: {
    deviceType: string;
    touchSupport: boolean;
    maxTouchPoints: number;
    platform: string;
    vendor: string;
  };
  screen: {
    width: number;
    height: number;
    availWidth: number;
    availHeight: number;
    colorDepth: number;
    pixelDepth: number;
    orientation: string;
  };
  network: {
    type: string;
    effectiveType: string;
    downlink?: number;
    rtt?: number;
    saveData?: boolean;
  };
}

/**
 * 网络连接接口定义
 */
interface NetworkInformation {
  type: string;
  effectiveType: string;
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
}

/**
 * 获取设备环境信息的工具函数
 * @returns 包含完整设备环境信息的对象
 */
export function getDeviceEnvironmentInfo(): DeviceEnvironmentInfo {
  try {
    // 基础信息
    const basicInfo = {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      language: navigator.language,
      languages: navigator.languages,
      online: navigator.onLine,
      cookieEnabled: navigator.cookieEnabled,
      domain: document.domain,
    };

    // 解析浏览器信息
    const userAgent = navigator.userAgent.toLowerCase();
    const browserInfo = getBrowserInfo(userAgent);

    // 解析系统信息
    const systemInfo = getSystemInfo(userAgent);

    // 设备信息
    const deviceInfo = {
      deviceType: detectDeviceType(),
      touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
      maxTouchPoints: navigator.maxTouchPoints || 0,
      platform: navigator.platform,
      vendor: navigator.vendor || 'Unknown',
    };

    // 屏幕信息
    const screenInfo = {
      width: screen.width,
      height: screen.height,
      availWidth: screen.availWidth,
      availHeight: screen.availHeight,
      colorDepth: screen.colorDepth,
      pixelDepth: screen.pixelDepth,
      orientation: screen.orientation?.type || 'Unknown',
    };

    // 网络信息
    const networkInfo = getNetworkInfo();

    // 整合所有信息
    return {
      basic: basicInfo,
      browser: browserInfo,
      system: systemInfo,
      device: deviceInfo,
      screen: screenInfo,
      network: networkInfo,
    };
  } catch {
    // 返回基础信息作为降级方案
    return getFallbackDeviceInfo();
  }
}

/**
 * 提取浏览器信息
 */
function getBrowserInfo(userAgent: string): DeviceEnvironmentInfo['browser'] {
  let name = 'Unknown';
  let version = 'Unknown';

  if (userAgent.indexOf('edge') > -1) {
    name = 'Microsoft Edge';
    version = extractVersion(userAgent, 'edge/');
  } else if (userAgent.indexOf('edg') > -1) {
    name = 'Microsoft Edge (Chromium)';
    version = extractVersion(userAgent, 'edg/');
  } else if (
    userAgent.indexOf('chrome') > -1 &&
    !userAgent.includes('edge') &&
    !userAgent.includes('edg')
  ) {
    name = 'Google Chrome';
    version = extractVersion(userAgent, 'chrome/');
  } else if (userAgent.indexOf('firefox') > -1) {
    name = 'Mozilla Firefox';
    version = extractVersion(userAgent, 'firefox/');
  } else if (userAgent.indexOf('safari') > -1 && !userAgent.includes('chrome')) {
    name = 'Safari';
    version = extractVersion(userAgent, 'safari/');
  } else if (userAgent.indexOf('opera') > -1 || userAgent.indexOf('opr') > -1) {
    name = 'Opera';
    version = extractVersion(userAgent, userAgent.indexOf('opera') > -1 ? 'opera/' : 'opr/');
  } else if (userAgent.indexOf('msie') > -1 || userAgent.indexOf('trident') > -1) {
    name = 'Internet Explorer';
    version = extractVersion(userAgent, userAgent.indexOf('msie') > -1 ? 'msie ' : 'rv:');
  }

  return {
    name,
    version,
    vendor: navigator.vendor || 'Unknown',
    hardwareConcurrency: navigator.hardwareConcurrency || 0,
    product: navigator.product || 'Unknown',
  };
}

/**
 * 提取系统信息
 */
function getSystemInfo(userAgent: string): DeviceEnvironmentInfo['system'] {
  let name = 'Unknown';
  let version = 'Unknown';

  // 移动设备系统
  if (userAgent.indexOf('iphone') > -1) {
    name = 'iOS';
    version = extractVersion(userAgent, 'iphone os ');
  } else if (userAgent.indexOf('ipad') > -1) {
    name = 'iOS';
    version = extractVersion(userAgent, 'ipad; cpu os ');
  } else if (userAgent.indexOf('android') > -1) {
    name = 'Android';
    version = extractVersion(userAgent, 'android ');
  }
  // 桌面系统
  else if (userAgent.indexOf('windows') > -1) {
    name = 'Windows';
    if (userAgent.indexOf('windows nt 10.0') > -1) version = '10/11';
    else if (userAgent.indexOf('windows nt 6.3') > -1) version = '8.1';
    else if (userAgent.indexOf('windows nt 6.2') > -1) version = '8';
    else if (userAgent.indexOf('windows nt 6.1') > -1) version = '7';
    else if (userAgent.indexOf('windows nt 6.0') > -1) version = 'Vista';
    else if (userAgent.indexOf('windows nt 5.1') > -1) version = 'XP';
  } else if (userAgent.indexOf('mac os x') > -1) {
    name = 'macOS';
    version = extractVersion(userAgent, 'mac os x ').replace(/_/g, '.');
  } else if (userAgent.indexOf('linux') > -1) {
    name = 'Linux';
    version = 'Unknown';
  }

  return { name, version };
}

/**
 * 检测设备类型
 */
function detectDeviceType(): string {
  const userAgent = navigator.userAgent.toLowerCase();

  // 优先检测平板设备
  if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
    return 'Tablet';
  }

  // 检测移动设备
  if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent)) {
    return 'Mobile';
  }

  return 'Desktop';
}

/**
 * 获取网络信息
 */
function getNetworkInfo(): DeviceEnvironmentInfo['network'] {
  try {
    // 使用类型断言处理不同浏览器的网络API
    const nav = navigator as Navigator & {
      connection?: NetworkInformation;
      mozConnection?: NetworkInformation;
      webkitConnection?: NetworkInformation;
    };

    const connection = nav.connection || nav.mozConnection || nav.webkitConnection;

    if (!connection) {
      return {
        type: 'Unknown',
        effectiveType: 'Unknown',
      };
    }

    return {
      type: connection.type || 'Unknown',
      effectiveType: connection.effectiveType || 'Unknown',
      downlink: connection.downlink,
      rtt: connection.rtt,
      saveData: connection.saveData,
    };
  } catch {
    return {
      type: 'Unknown',
      effectiveType: 'Unknown',
    };
  }
}

/**
 * 提取版本号辅助函数
 */
function extractVersion(userAgent: string, keyword: string): string {
  try {
    const index = userAgent.indexOf(keyword);
    if (index === -1) return 'Unknown';

    let versionStr = userAgent.substring(index + keyword.length);
    versionStr = versionStr.split(' ')[0].split(';')[0].split('/')[0];
    return versionStr || 'Unknown';
  } catch {
    return 'Unknown';
  }
}

/**
 * 降级方案：当主要方法失败时返回基础信息
 */
function getFallbackDeviceInfo(): DeviceEnvironmentInfo {
  return {
    basic: {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      language: navigator.language,
      languages: navigator.languages,
      online: navigator.onLine,
      cookieEnabled: navigator.cookieEnabled,
      domain: document.domain,
    },
    browser: {
      name: 'Unknown',
      version: 'Unknown',
      vendor: navigator.vendor || 'Unknown',
      hardwareConcurrency: navigator.hardwareConcurrency || 0,
      product: navigator.product || 'Unknown',
    },
    system: {
      name: 'Unknown',
      version: 'Unknown',
    },
    device: {
      deviceType: 'Unknown',
      touchSupport: false,
      maxTouchPoints: 0,
      platform: navigator.platform,
      vendor: navigator.vendor || 'Unknown',
    },
    screen: {
      width: screen.width,
      height: screen.height,
      availWidth: screen.availWidth,
      availHeight: screen.availHeight,
      colorDepth: screen.colorDepth,
      pixelDepth: screen.pixelDepth,
      orientation: 'Unknown',
    },
    network: {
      type: 'Unknown',
      effectiveType: 'Unknown',
    },
  };
}

/**
 * 导出类型定义供其他模块使用
 */
export type { DeviceEnvironmentInfo, NetworkInformation };

// 使用示例
// const deviceInfo = getDeviceEnvironmentInfo();
// console.log('设备环境信息:', deviceInfo);
//
// // 上传到后台
// fetch('/api/logs/device', {
//   method: 'POST',
//   headers: { 'Content-Type': 'application/json' },
//   body: JSON.stringify(deviceInfo)
// }).catch(error => {
//   console.error('设备信息上传失败:', error);
// });
