import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  mfsu: {
    shared: { react: { singleton: true } },
  },
  request: {},
  layout: {},
  qiankun: {
    master: {
      apps: [
        {
          name: 'app1',
          entry: 'http://localhost:8005',
        },
      ],
    },
  },
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      name: '首页',
      path: '/home',
      component: './Home',
    },
    {
      name: '教室使用情况',
      path: '/RoomState',
      component: './analysis',
    },
    {
      name: '登录',
      path: '/Login',
      component: './Login',
    },
    {
      name: '权限演示',
      path: '/test',
      routes: [
        {
          path: '/test',
          redirect: '/test/access',
        },
        {
          name: '权限演示',
          path: '/test/access',
          component: './Access',
        },
        {
          name: ' CRUD 示例',
          path: '/test/table',
          component: './Table',
        },
      ],
    },
  ],
  npmClient: 'pnpm',
  headScripts: ['./umi.js'],
  links: [{ href: './umi.css' }],
});
