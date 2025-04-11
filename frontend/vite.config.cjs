const { defineConfig } = require('vite');
const react = require('@vitejs/plugin-react');
const path = require('path');
const { NodeGlobalsPolyfillPlugin } = require('@esbuild-plugins/node-globals-polyfill');
const { NodeModulesPolyfillPlugin } = require('@esbuild-plugins/node-modules-polyfill');

module.exports = defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      stream: 'stream-browserify',
      buffer: 'buffer',
      util: 'util',
      '@multiversx/sdk-core': path.resolve(__dirname, 'node_modules/@multiversx/sdk-core'),
      '@multiversx/sdk-core/out': path.resolve(__dirname, 'node_modules/@multiversx/sdk-core/out'),
      '@multiversx/sdk-dapp': path.resolve(__dirname, 'node_modules/@multiversx/sdk-dapp/__commonjs'),
      '@multiversx/sdk-dapp/services': path.resolve(__dirname, 'node_modules/@multiversx/sdk-dapp/__commonjs/services'),
      '@multiversx/sdk-dapp/utils': path.resolve(__dirname, 'node_modules/@multiversx/sdk-dapp/__commonjs/utils'),
      '@multiversx/sdk-dapp/UI': path.resolve(__dirname, 'node_modules/@multiversx/sdk-dapp/__commonjs/UI'),
      '@multiversx/sdk-network-providers': path.resolve(__dirname, 'node_modules/@multiversx/sdk-network-providers'),
      '@multiversx/sdk-wallet': path.resolve(__dirname, 'node_modules/@multiversx/sdk-wallet')
    },
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.json']
  },
  define: {
    'process.env': {},
    global: 'globalThis',
    'process': '{}'
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis'
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
          process: false
        }),
        NodeModulesPolyfillPlugin()
      ]
    },
    include: [
      '@multiversx/sdk-core',
      '@multiversx/sdk-dapp',
      '@multiversx/sdk-network-providers',
      '@multiversx/sdk-wallet',
      'buffer',
      'stream-browserify',
      'util'
    ]
  },
  build: {
    rollupOptions: {
      external: ['buffer'],
      output: {
        globals: {
          buffer: 'Buffer'
        }
      }
    },
    commonjsOptions: {
      transformMixedEsModules: true,
      include: [/node_modules/],
      requireReturnsDefault: 'auto'
    }
  },
  server: {
    port: 5176,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
      'Content-Security-Policy': process.env.NODE_ENV === 'development' 
        ? "script-src 'self' 'unsafe-eval' 'unsafe-inline' https: http:; connect-src 'self' https: http: wss: ws:;"
        : "script-src 'self' 'unsafe-inline' https: http:; connect-src 'self' https: http: wss: ws:;"
    },
    hmr: {
      clientPort: 5176
    }
  },
  experimental: {
    renderBuiltUrl: (filename, { hostType }) => {
      if (hostType === 'js') {
        return { runtime: `window.__assetsBaseUrl + ${JSON.stringify(filename)}` };
      }
      return filename;
    }
  }
}); 