/**
 * @Description
 */

import { CheckOutlined } from '@ant-design/icons';
import React, { useEffect } from 'react';
import styles from './Verification.less';

interface Props {
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  onOK: (values: any) => Promise<void>;
}
const Verification: React.FC<Props> = ({ setVisible, onOK }) => {
  function begin() {
    const wrapperEl = document.getElementById('verification');
    const tipEl = document.getElementById('tip');

    // 拼图区
    const checkWrapperEl = document.getElementById('check-wrapper');
    const checkEl = document.getElementById('check-box');
    const targetEl = document.getElementById('check-target');

    const stateEl = document.getElementById('check-state');
    const resetButtonEl = document.getElementById('resetButton'); // 校验成功页确认按钮

    // 拖动区
    const dragEl = document.getElementById('drag-box');
    const dragProgressEl = document.getElementById('drag-progress');
    const { width: checkWrapperW } = checkWrapperEl.getBoundingClientRect();
    const { x: dragX, width: dragW } = dragEl.getBoundingClientRect();
    const { width: targetW, height: targetH } =
      targetEl.getBoundingClientRect();

    const tolerances = 5; // 容差
    let clickOffsetX = 0; // 鼠标到滑块左边的距离
    let targetX = 50; // 拼图插槽到页面最左边的距离
    let failTimes = 0; // 拖动失败次数

    /**
     * 随机生成图片
     * @param {HTMLElement} checkWrapperEl
     */
    const randomImage = (checkWrapperEl) => {
      const imageList = [
        'https://tosuke.top/upload/17008428149696723616913853192.png',
        'https://tosuke.top/upload/17085830455965b838df226c0bb0716132fe4b69af865.jpg',
      ];
      const index = Math.round(Math.random() * (imageList.length - 1));

      checkWrapperEl.style.backgroundImage = `url(${imageList[index]})`;
    };

    /**
     * 随机生成 left / top 位置
     * @param {number} wrapperW
     * @param {number} wrapperH
     * @param {number} w
     * @param {number} h
     * @returns {[number, number]} [ left, top ]
     */
    const randomPosition = (wrapperW = 400, wrapperH = 300, w = 50, h = 50) => {
      const bleed = w / 2;
      const left = Math.random() * (wrapperW - 3 * w) + w + bleed;
      const top = Math.random() * (wrapperH - 2 * h) + bleed;

      return [Math.floor(left), Math.floor(top)];
    };

    /**
     * 初始化 target 位置
     * @param {HTMLElement} targetEl 拼图缺口
     * @param {HTMLElement} checkEl 拼图
     * @param {number} targetW 拼图宽
     * @param {number} targetH 拼图高
     */
    function init(targetEl, checkEl, targetW = 50, targetH = 50) {
      // 随机生成图片
      randomImage(checkWrapperEl);

      const { width: cwW, height: cwH } =
        checkWrapperEl.getBoundingClientRect();
      // 设置拼图插槽随机位置
      const [targetLeft, targetTop] = randomPosition(
        cwW,
        cwH,
        targetW,
        targetH,
      );
      targetEl.style.left = `${targetLeft}px`;
      targetEl.style.top = `${targetTop}px`;
      checkEl.style.top = `${targetTop}px`;

      // 设置拼图背景
      checkEl.style.backgroundSize = `${cwW}px ${cwH}px`;
      checkEl.style.backgroundPosition = `-${targetLeft}px -${targetTop}px`;

      targetX = targetEl.getBoundingClientRect().x;

      failTimes = 0;
      tipEl.innerHTML = ``;
    }

    // 回到起点
    const reset = () => {
      dragEl.style.transform = 'translateX(0px)';
      checkEl.style.transform = 'translateX(0px)';
      dragProgressEl.style.width = '0px';
    };

    /**
     * 回到起点，有过渡动画
     */
    const animateReset = () => {
      // 添加过渡动画
      wrapperEl.style.animation = `${styles['fail-shake']} 0.5s ease-in-out`;
      dragEl.style.animation = `${styles['move']} 0.5s ease-in-out`;
      checkEl.style.animation = `${styles['move']} 0.5s ease-in-out`;
      dragProgressEl.style.animation = `${styles['elongation']} 0.5s ease-in-out`;
      // 动画结束回调
      const animationEnd = () => {
        reset();

        // 清除过渡动画
        wrapperEl.style.animation = '';
        dragEl.style.animation = '';
        checkEl.style.animation = '';
        dragProgressEl.style.animation = '';

        document.removeEventListener('animationend', animationEnd);
      };

      // 添加监听动画结束
      document.addEventListener('animationend', animationEnd);
    };

    const onButtonClick = () => {
      reset();
      init(targetEl, checkEl, targetW, targetH);
      resetButtonEl.removeEventListener('click', onButtonClick);
      stateEl.style.display = 'none';
    };

    // 成功通过校验
    const success = () => {
      stateEl.style.display = 'flex';
      onOK();
      setVisible(false);
      resetButtonEl.addEventListener('click', onButtonClick);
    };

    // 监听鼠标移动事件
    const onDragMouseMove = (event) => {
      const { pageX } = event; // 鼠标的 x 坐标
      const x = pageX - dragX - clickOffsetX; // drag 移动的距离

      // 鼠标移出左边界
      if (x < 0) {
        if (dragEl.style.transform !== 'translateX(0px)') {
          dragEl.style.transform = 'translateX(0px)';
          checkEl.style.transform = 'translateX(0px)';
          dragProgressEl.style.width = '0px';
        }
        return;
      }

      // 鼠标移出右边界
      const rightBoundary = checkWrapperW - dragW;
      if (x > rightBoundary) {
        if (dragEl.style.transform !== `translateX(${rightBoundary}px)`) {
          dragEl.style.transform = `translateX(${rightBoundary}px)`;
          checkEl.style.transform = `translateX(${rightBoundary}px)`;
          dragProgressEl.style.width = `${rightBoundary}px`;
        }
        return;
      }

      // 修改盒子坐标
      dragEl.style.transform = `translateX(${x}px)`;
      checkEl.style.transform = `translateX(${x}px)`;
      dragProgressEl.style.width = `${x}px`;
    };

    // 结束鼠标监听事件
    const onDragMouseUP = (event) => {
      document.removeEventListener('mousemove', onDragMouseMove);
      document.removeEventListener('mouseup', onDragMouseUP);

      const { pageX } = event;

      const passRange = [
        targetX - tolerances + clickOffsetX,
        targetX + tolerances + clickOffsetX,
      ];

      if (pageX >= passRange[0] && pageX <= passRange[1]) {
        success();
      } else {
        if (failTimes > 1) {
          console.log('shibai1');
          reset();
          init(targetEl, checkEl, targetW, targetH);
          return;
        }
        failTimes++;
        tipEl.innerHTML = `请重试，剩余 ${3 - failTimes} 次机会`;
        console.log('shibai1');
        animateReset();
      }
    };

    // 鼠标按下事件
    const onDragMouseDown = (event) => {
      // 添加鼠标移动事件
      document.addEventListener('mousemove', onDragMouseMove);
      // 添加鼠标弹起事件
      document.addEventListener('mouseup', onDragMouseUP);

      const { offsetX } = event;
      clickOffsetX = offsetX;
    };

    const main = () => {
      init(targetEl, checkEl, targetW, targetH);

      dragEl.addEventListener('mousedown', onDragMouseDown);
      checkEl.addEventListener('mousedown', onDragMouseDown);
    };

    main();
  }
  useEffect(() => {
    begin();
  }, []);

  return (
    <>
      <div id="verification" className={styles.verification}>
        <p id="title" className={styles.title}>
          拼图验证
        </p>
        <p id="tip" className={styles.tip}></p>

        {/* <!-- 拼图区 --> */}
        <div id="check-wrapper" className={styles['check-wrapper']}>
          {/* <!-- 目标插槽 --> */}
          <div id="check-target" className={styles['check-target']}></div>

          {/* <!-- 拼图 --> */}
          <div id="check-box" className={styles['check-box']}></div>

          {/* <!-- 成功 --> */}
          <div id="check-state" className={styles['check-state']}>
            <CheckOutlined />
            <p>验证成功</p>
            <button
              id="resetButton"
              type="button"
              className={styles.resetButton}
            >
              确认
            </button>
          </div>
        </div>

        {/* <!-- 拖动区 --> */}
        <div className={styles['drag-wrapper']}>
          <p className={styles['drag-tip']}>
            <span>拖动按钮完成上方拼图验证</span>
          </p>

          {/* <!-- 已拖过的进度条 --> */}
          <div id="drag-progress" className={styles['drag-progress']}></div>
          {/* <!-- 拖动滑块 --> */}
          <div id="drag-box" className={styles['drag-box']}></div>
        </div>
      </div>
    </>
  );
};
export default Verification;
