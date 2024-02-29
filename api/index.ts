/*
 * @Description
 */
import cors from 'cors';
import express, { Request, Response } from 'express';

const app = express();

// 模拟用户数据
const users = [
  { id: 0, name: 'Umi', nickName: 'U', gender: 'MALE' },
  { id: 1, name: 'Fish', nickName: 'B', gender: 'FEMALE' },
];
const login = [{ name: 'Tosuke', password: '123' }];

app.use(
  cors({
    origin: ['http://localhost:8000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  }),
);
app.use(express.json());

// 处理 /api/v1/queryUserList GET 请求
app.get('/api/v1/queryUserList', (req: Request, res: Response) => {
  // 解析查询参数
  const { current, pageSize, sorter, filter } = req.query;
  console.log(current, pageSize, sorter, filter);
  // 这里可以根据查询参数对 userList 进行筛选、排序等操作，这里简单返回全部用户数据
  res.json({
    success: true,
    data: { list: users },
    errorCode: 0,
  });
});

app.post('/api/v1/login', (req: Request, res: Response) => {
  // 解析查询参数
  console.log(req.body);
  let isLogin = false;
  const { username, password } = req.body;
  login.forEach((item) => {
    if (username === item.name && password === item.password) {
      isLogin = true;
    }
  });

  if (isLogin) {
    res.status(200).json({
      success: true,
      errorCode: 0,
    });
  } else {
    res.status(403).json({
      success: false,
      errorCode: 1,
      errMsg: '密码或者账号出错',
    });
  }
});

// 监听端口
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
