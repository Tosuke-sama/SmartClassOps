/*
 * @Description
 */
import cors from 'cors';
import express, { Request, Response } from 'express';
import postrouter from './routes/posts';
import audio from './utils/audio'
// import authrouter from "./routes/auth";
// import userrouter from "./routes/users";
import WebSocket from 'ws';
import fs from 'fs'

const wss = new WebSocket.Server({ port: 8080 });
wss.on('connection', (ws) => {
  let askMsg:any = [];
  ws.on('message', async (message) => {
    
    let messageAsText = String(message);
    if(messageAsText == 'false'){
      let len = askMsg.length;
      audio(askMsg[len-1]).then(() => {
        console.log("语音转换完毕2");
          // 读取MP3文件为ArrayBuffer
          fs.readFile('./test.mp3', (err, data) => {
            if (err) {
              console.error('Error reading MP3 file:', err);
              return;
            }
            
            const arrayBuffer = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
            const uint8Array = new Uint8Array(arrayBuffer);
        
            // 分块发送
            const chunkSize = 1024 * 1024; // 示例中设定每块大小为1MB，可根据实际情况调整
            for (let offset = 0; offset < uint8Array.byteLength; offset += chunkSize) {
              const chunk = uint8Array.subarray(offset, offset + chunkSize);
              ws.send(chunk);
            }
            ws.send("false");
            console.log('MP3 file sent successfully');
          });
      })
      console.log(askMsg[len-1]);
    }
    askMsg.push(messageAsText);


  })
  
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
