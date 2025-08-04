import vue from '@vitejs/plugin-vue';
import ElegantVueRouter from 'elegant-router/vite';
import path from 'path';
import UnoCSS from 'unocss/vite';
import AutoImport from 'unplugin-auto-import/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';
import { defineConfig, loadEnv } from 'vite';
import vueDevTools from 'vite-plugin-vue-devtools';

// https://vite.dev/config/
export default defineConfig((configEnv) => {
  const viteEnv = loadEnv(configEnv.mode, process.cwd()) as Env.ImportMeta;

  const proxyUrl = viteEnv.VITE_SERVICE_BASE_URL;

  const proxyConfig = {
    '/api': {
      // 默认地址
      target: 'http://localhost:8080',
      changeOrigin: true,
      rewrite: (p: string) => p.replace(/^\/api/, ''),
    },
  };

  if (proxyUrl) {
    proxyConfig['/api'].target = proxyUrl;
  }

  return {
    plugins: [
      vue(),
      vueDevTools(),
      UnoCSS(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
        dts: 'src/typings/auto-imports.d.ts',
        imports: ['vue', 'vue-router', 'pinia'],
      }),
      Components({
        dirs: ['src/components'],
        dts: 'src/typings/components.d.ts',
        resolvers: [ElementPlusResolver({ importStyle: 'sass' })],
      }),
      ElegantVueRouter(),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          // 全局注入变量文件（无需在每个组件中手动引入）
          additionalData: `@use "~/styles/element/index.scss" as *;`,
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '~': path.resolve(__dirname, 'src'),
      },
    },
    server: {
      open: true,
      proxy: proxyConfig,
      hmr: {
        overlay: false,
      },
    },
  };
});
