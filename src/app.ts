// 运行时配置

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate

import { Cookies } from 'react-cookie';
// import services from '@/services/demo';

export async function getInitialState(): Promise<{ name: string }> {
  //获取用户信息
  const cookies = new Cookies();
  console.log(cookies.get('user-token'));

  return { name: '李京介' };
}

export const layout = () => {
  return {
    logo: 'https://tosuke.top/upload/1.ico',
    title: '智能教室管理系统',
    layout: 'mix',
    menu: {
      locale: true,
    },
    splitMenus: true,
    logout: () => {
      console.log('nih');
    },
  };
};
