/*
 * @Description 
 */
import fs from 'fs';
 function synthesizeSpeech(data) {
    return new Promise((resolve,reject)=>{       
        var sdk = require("microsoft-cognitiveservices-speech-sdk");
        var readline = require("readline");
        var key = "09edca1dba064686b8786f873292a725";
        var region = "eastus";
        var audioFile = "test.mp3";
        const speechConfig = sdk.SpeechConfig.fromSubscription(key, region);
        const audioConfig = sdk.AudioConfig.fromAudioFileOutput(audioFile);
        speechConfig.speechSynthesisVoiceName = "zh-CN-XiaoyiNeural"; 
        var synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

                        synthesizer.speakTextAsync(data,
                            function (result) {
                          if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
                            console.log("语音转换完毕");
                            resolve()
                          } else {
                            console.error("Speech synthesis canceled, " + result.errorDetails +
                                "\nDid you set the speech resource key and region values?");
                          }
                          synthesizer.close();
                          synthesizer = null;
                        },
                           function (err) {
                        //   console.trace("err - " + err);
                          synthesizer.close();
                          synthesizer = null;
                          reject();
                        });
        
      console.log("Now synthesizing to: " + audioFile);
        
    })
    
    }
    export default synthesizeSpeech;

