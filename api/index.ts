/*
 * @Description
 */
import cors from 'cors';
import express, { Request, Response } from 'express';
import postrouter from './routes/posts';
import VoiceTrans from './utils/iat-ws-node';
// import authrouter from "./routes/auth";
// import userrouter from "./routes/users";
import WebSocket from 'ws';

const wss = new WebSocket.Server({ port: 8080 });
let chunks: any = [];
wss.on('connection', (ws) => {
  ws.binaryType = 'arraybuffer'; // 设置接收二进制数据

  ws.on('message', async (message) => {
    // message将是ArrayBuffer类型
    //processAudioData(message);

    chunks.push(message);
    const blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
    VoiceTrans(blob);
    // console.log(base64String);
  });

  // 如果你想使用箭头函数，可以进一步简化为：
  // ws.on('message', (message) => processAudioData(message));
});

const app = express();

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
app.use('/api/v1', postrouter);

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
