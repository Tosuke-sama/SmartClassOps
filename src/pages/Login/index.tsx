/**
 * @Description
 */
// 页面

import Verification from '@/components/Verification';
import services from '@/services/demo';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from '@umijs/max';
import { Button, Card, Form, Input, message } from 'antd';
import { useState } from 'react';
import { Cookies } from 'react-cookie';
import './index.less';
const { login } = services.AuthController;

export default () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [values, setValues] = useState({});
  const onFinish = (values: any) => {
    setVisible(true);
    setValues(values);
  };
  const onSubmit = async () => {
    const res = await login(values).catch(() => {
      // message.error('账号或密码错误');
    });
    if (res) {
      const cookies = new Cookies();
      cookies.set('user-token', '5tgb3edc7ytfc8ujhn');
      message.success('登录成功');
      navigate('/home');
    } else {
      message.error('账号或密码错误');
    }
  };
  return (
    <div className="login-pages">
      <Card title="登录" className="login-card">
        <Form wrapperCol={{ offset: 4, span: 16 }} onFinish={onFinish}>
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入 账号' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="用户名或手机号" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入 密码!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 8 }}>
            <Button type="primary" htmlType="submit" className="login-button">
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
      {visible && <Verification setVisible={setVisible} onOK={onSubmit} />}
    </div>
  );
};
