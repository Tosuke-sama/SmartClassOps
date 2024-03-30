/*
 * @Description
 */
// audio-worklet-processor.js
class PCMProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return []; // 如果有参数，可以在此处定义
  }

  process(inputs, outputs) {
    const input = inputs[0];
    const output = outputs[0];

    // 获取PCM数据
    const inputData = input[0];

    // 将PCM数据发送给主线程
    self.postMessage(
      {
        type: 'audioData',
        data: Float32Array.from(inputData),
      },
      [inputData.buffer],
    );

    return true; // 表示继续处理更多数据
  }
}

registerProcessor('pcm-processor', PCMProcessor);
