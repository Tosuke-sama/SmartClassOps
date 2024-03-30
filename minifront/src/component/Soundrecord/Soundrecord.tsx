/**
 * @Description
 */
import { Layout } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import WebSocketService from '../../utils/websocket';
import Voice from './utils/voice';

 /**
   *  用于语音转换的组件
   * @param {string} word - 接入的原文字
   * @param {function} transWord - 参数为识别文字的回调函数
   * @param {function} getAudioContext - 获取创建的audioContext
   * @param {function} getAnalyser - 获取创建的audioContext
   */

interface Props{
  word : String;
  transWord : Function;
  getAudioContext:Function;
  getAnalyser:Function;
  getIsplaying :Function
}
const wsService = new WebSocketService('ws://localhost:8080/audio');
wsService.onOpen(() => console.log('WebSocket connected'));
const Soundrecord: React.FC<Props> = ( {word, transWord,getAudioContext, getAnalyser ,getIsplaying} ) => {
  const [stream, setStream] = useState(null);
  const [recorder, setRecorder] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceTxt, setVoiceTxt] = useState("")
  const [recordedBlobUrl, setRecordedBlobUrl] = useState(null);
  const audioRef = useRef(null);
  let chunks:any = [];

  useEffect(() => {
    wsService.onMessage((chunk) => {
      console.log(chunk);
      if(chunk!='false'){
        console.log('接受数据');
        chunks.push(chunk);
      } else {
        console.log('文件接受完毕，正在拼接');
        const blob = new Blob(chunks,{ 'type' : 'audio/mpeg' });
        console.log(blob);
        handleFileSelect(blob);
      }
     
    })
  }, [])
  useEffect(() => {
    // return来卸载使用的资源
    return () => {
      if (stream && stream.active) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (recorder) {
        recorder.stop();
        setRecorder(null);
      }
    };
  }, [stream, recorder]);



  const startRecording = async () => {
    try {
      // 请求音频输入设备
      const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      let audioTrack = mediaStream.getAudioTracks()[0];
      audioRef.current.srcObject = mediaStream;
      audioRef.current.play().then((e) => {
        // 成功捏
    }).catch((err) => {
        console.log(err);
    })

      setStream(mediaStream);

      // 创建一个AudioContext实例
      const audioCtx = new AudioContext();
      console.log(555);
      // 录音用的audioCtx，还没跑通，看日后
      // getAudioContext(audioCtx);
      // 创建MediaStreamSourceNode
      const source = audioCtx.createMediaStreamSource(mediaStream);

      // 创建MediaRecorder实例
      const options = { mimeType: 'audio/webm' };
      const recorder = new MediaRecorder(mediaStream, options);

      setRecorder(recorder);

      // 监听dataavailable事件，获取录制好的音频片段
      let chunks:any = [];
      recorder.addEventListener('dataavailable', event => {
        chunks.push(event.data);
        const blob = new Blob(chunks,{ 'type' : 'audio/ogg; codecs=opus' });

        // let audioStream = URL.createObjectURL(blob);
        // audioRef.current.src = audioStream;
      });

      // 监听stop事件，合并音频片段
      recorder.addEventListener('stop', () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        // 可以在此处上传blob对象或进行其他处理
        const url = URL.createObjectURL(blob);
        setRecordedBlobUrl(url);

      });

      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error(err);
    }
  };

  const playRecording = () => {
    audioRef.current.srcObject = null; // 如果之前有播放过其他音频，先清空
    // audioRef.current.src = recordedBlobUrl;
    audioRef.current.src = './1.flac';
    audioRef.current.play();
  };

  const stopRecording = () => {
    if (recorder) {
      recorder.stop();
      setIsRecording(false);
    }
    // playRecording();
  };
  const start = () => {
    let times:any = null;
    let once = 0;
    // 实例化迅飞语音听写（流式版）WebAPI
    const voice = new Voice({
      // 服务接口认证信息 注：apiKey 和 apiSecret 的长度都差不多，请要填错哦，！
      appId: '91ea974d',
      apiSecret: 'ZjgwNWI3ZjM4NGNjY2E0NTljNjUxZDZm',
      apiKey: '23085a250c6473ce5be75af09de8fb4e',
      // 注：要获取以上3个参数，请到迅飞开放平台：https://www.xfyun.cn/services/voicedictation 【注：这是我的迅飞语音听写（流式版）每天服务量500（也就是调500次），如果你需求里大请购买服务量：https://www.xfyun.cn/services/voicedictation?target=price】

      onWillStatusChange: function (oldStatus, newStatus) {
        //可以在这里进行页面中一些交互逻辑处理：注：倒计时（语音听写只有60s）,录音的动画，按钮交互等！
        // fixedBox.style.display = 'block';
        console.log(oldStatus, newStatus);
      },
      onTextChange: function (text) {
        console.log('识别的文字', text);
        transWord(text);
        //监听识别结果的变化
        // voiceTxt.value = text;
        // fixedTxt.innerText = text;
        wsService.sendAudioData(text);
        console.log("Websocket连接成功，发送中。。。")
        setVoiceTxt(text);
        // 3秒钟内没有说话，就自动关闭
        if (text) {
          clearTimeout(times);
          times = setTimeout(() => {
            this.stop(); // voice.stop();
            // fixedBox.style.display = 'none';
            // 语音接口会额外返回最终带有标点的句子，这里舍弃。
            if(once === 0){
              console.log(once);
              wsService.sendAudioData(false)
              once++;
            }
          }, 3000);
        }
      },
    });
    voice.start();
    startRecording();
  };
  const handleFileSelect = async (blob) => {
    // event: React.ChangeEvent<HTMLInputElement>
    var AudioContext = window.AudioContext;
    var audioContext = new AudioContext();//实例化
    // const file = event.target.files?.[0];
    const fileReader = new FileReader();
    // if (!file) return;
    fileReader.readAsArrayBuffer(blob);
    fileReader.onload =async function(e) {
      let count = 0;
		  console.log('开始解码');
			let timer = setInterval(function(){
				count++;
        console.log('解码中,已用时'+count+'秒');
			},1000);

      audioContext.decodeAudioData(e.target.result, function(buffer) {
        // console.log(888, buffer);
				clearInterval(timer)
        console.log('解码成功，用时共计:'+count+'秒')
        getAudioContext(audioContext);
				var audioBufferSourceNode = audioContext.createBufferSource();
				var analyser = audioContext.createAnalyser();
				audioBufferSourceNode.connect(analyser);
				analyser.connect(audioContext.destination);
				audioBufferSourceNode.buffer = buffer;
        // 检测播放结束事件;
        audioBufferSourceNode.onended = function() {
          getIsplaying(false);
          console.log('音频播放已结束');
        };
				audioBufferSourceNode.start();
        getIsplaying(true);
        getAnalyser(analyser)
      })

    }
    // 检查文件是否为FLAC格式
    // if (file.type === 'audio/flac') {
    //   // 创建一个URL来指向选定的文件
    //   const url = URL.createObjectURL(file);
    //   console.log( audioRef.current);
    //   audioRef.current.src = url;
    //   // audioRef.current.play(); // 必须调用load方法刷新音频元素
    // } else {
    //   console.log('Selected file is not in FLAC format.');
    // }
  };
  return (
      <div>
      你好
      <div>
        {isRecording ? (
          <button type="button" onClick={stopRecording}>
            停止录音
          </button>
        ) : (
          <button type="button" onClick={start}>
            开始录音
          </button>
        )}
         <input type="file"  onChange={handleFileSelect} />
        <button type="button" onClick={playRecording}>
          播放录音
        </button>
      </div>
      {/* <div>识别的文本：{voiceTxt}</div> */}
      <audio ref={audioRef} controls style={{ display: 'none' }} />
      </div>
  );
};

export default Soundrecord;
