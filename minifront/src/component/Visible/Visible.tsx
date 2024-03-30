/**
 * @Description 
 */
import React, { useEffect, useRef } from "react"
import styles from './index.less'
interface Props {
  audioContext: AudioContext | null;
  analyser: AnalyserNode | null;
  isPlaying:Boolean
}
const Visible: React.FC<Props> = ({ audioContext,analyser, isPlaying }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  let animationId = 0;
  useEffect(() => {
    visibleStart();
    return () => {
      cancelAnimationFrame(animationId);
    }
  },[isPlaying])
  function visibleStart() {
    if (!canvasRef.current) {
      return;
    }
    const canvasCtx: CanvasRenderingContext2D | null = canvasRef.current.getContext("2d");
    var oW = canvasRef.current.width;
    var oH = canvasRef.current.height;
    var color1 = canvasCtx!.createLinearGradient(oW / 2, oH / 2 - 10, oW / 2, oH / 2 - 150);
    color1.addColorStop(0, '#1E90FF');
    color1.addColorStop(.25, '#FF7F50');
    color1.addColorStop(.5, '#8A2BE2');
    color1.addColorStop(.75, '#4169E1');
    color1.addColorStop(1, '#00FFFF');

    var color2 = canvasCtx!.createLinearGradient(0, 0, oW, oH);
    color2.addColorStop(0, '#1E90FF');
    color2.addColorStop(.25, '#FFD700');
    color2.addColorStop(.5, '#8A2BE2');
    color2.addColorStop(.75, '#4169E1');
    color2.addColorStop(1, '#FF0000');

    if(!canvasCtx) return;
     //设置字体样式颜色
     canvasCtx.font = "20px 宋体";
     canvasCtx.fillStyle = color2;		// 设置颜色
     canvasCtx.textAlign = "center";		// 设置水平对齐方式
     canvasCtx.textBaseline = "middle";	// 设置垂直对齐方式
     // 绘制文字（参数：要写的字，x坐标，y坐标）
     canvasCtx.fillText("VICE", oW / 2, oH / 2);


   
    var du = 2;	//角度
    var R = 60;	//半径
    var W = 2;	//宽（线条的粗细）
    let output = new Uint8Array(180).fill(10);
    // let analyser = audioContext.createAnalyser();
    // console.log(audioContext);
    let length = 0;
    let standbyStep = 0;
    (function drawSpectrum() {
      if(isPlaying){
          analyser!.getByteFrequencyData(output);
          // console.log('analyser')
          output.forEach((item,index) => {
            if(index<50){
              output[index] =  output[index]/3
            }
            else{
              output[index] =  output[index]/2
            }
          });
      
        } else {
            // console.log('animation')
          if (standbyStep === 5) { // 定义待机动画速率
            standbyStep = 0;  
          if (length === 180) {
              length = 0;
          }
            output = new Uint8Array(180).fill(10);
            for(let i = 0;i<4;i++){ 
              output[length] = 40; 
              if(length-i>=0)
              output[length-i] = 40-i*10;
              else
              output[length-i+180] = 40-i*10;
              if(length+i>=180)
              output[length+i - 180] = 40-i*10;
              else
              output[length+i] = 40-i*10;
            }
            length++;
          } else {
            standbyStep++;
          }
        }
      canvasCtx!.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      canvasCtx.imageSmoothingEnabled = false;
      for (var i = 0; i < output.length; i++) {            
        var value = output[i] / 10;
        canvasCtx.beginPath();
        canvasCtx.lineWidth = W;
        let Rv1 = (R - value);
        let Rv2 = (R + value);
        canvasCtx.moveTo((Math.sin((i * du) / 180 * Math.PI) * Rv1 + oW / 2), -Math.cos((i * du) / 180 * Math.PI) * Rv1 + oH / 2);
        canvasCtx.lineTo((Math.sin((i * du) / 180 * Math.PI) * Rv2 + oW / 2), -Math.cos((i * du) / 180 * Math.PI) * Rv2 + oH / 2);
        canvasCtx.strokeStyle = color1;//线条的颜色
        canvasCtx.stroke();
      }
      canvasCtx.fillText("VICE", oW / 2, oH / 2);
      animationId = requestAnimationFrame(drawSpectrum);
    })();
  }
  return (
    <div className={styles.main}>
      <canvas id="wrap" ref={canvasRef} className={styles.canvas}></canvas>
    </div>
  )
}
export default Visible