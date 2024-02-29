/**
 * @Description
 */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 POST /api/v1/user */
export async function login(
  body?: API.UserInfoVO,
  options?: { [key: string]: any },
) {
  console.log(body, options);
  return request<API.Result_UserInfo_>('http://localhost:3000/api/v1/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
