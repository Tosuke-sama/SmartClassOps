/**
 * @Description 
 */
import styles from './AskArea.less';
import Soundrecord from '../Soundrecord/Soundrecord';
import {useState} from 'react'
import Visible from '../Visible';

const AskArea: React.FC = () => {
  const [isVisible, setISVisible] = useState(false);
  const [word, setWord] = useState("");
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState< AnalyserNode | null>(null);
  const [isPlaying, setIsPlaying] = useState< boolean>(false);
  const click = () => {
    setISVisible(!isVisible)
  }
  return (
    <div>
      <div className={`${styles['main']} ${isVisible ? styles['sidebar-visible'] : styles['sidebar-hidden']}`}  >
        <Soundrecord word={word} transWord={setWord} getAudioContext={setAudioContext} getAnalyser={setAnalyser} getIsplaying={setIsPlaying}  />
        <div>识别的文本：{word}</div>
       
        <Visible audioContext={audioContext} analyser={analyser} isPlaying={isPlaying}/>
      </div>
      <button onClick={click}>显示/隐藏侧边栏</button>
    </div>
    );
}

      export default AskArea;
