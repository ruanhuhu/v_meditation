<template>
  <div class="view-timer">
    <div class="timer-box">
      <van-button
        :disabled="true"
        class="timer-button"
        color="linear-gradient(to right, #fc9e2e, #ff6034)"
      >
        {{ formatCountdown(countdown) }}
      </van-button>
      <span class="stop-button" @click="onStop">结束</span>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import mp3File from '../../assets/yq.mp3'

const props = defineProps({
  duration: {
    type: Number,
    required: true,
  },
});

const emits = defineEmits(["finish", "stop"]);


const sound = new Audio(mp3File)
const playSound = () => {
  sound.play()
}
const stopPlaySound = () => {
  sound.pause()
  sound.currentTime = 0
}

playSound()

// 倒计时
// const countdown = ref(props.duration * 60 + 3);
const countdown = ref(props.duration);
const countdownTimer = ref();

// 获取倒计时时间
const formatCountdown = (countdown: number) => {
  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;
  return `${minutes < 10 ? "0" + minutes : minutes}:${
    seconds < 10 ? "0" + seconds : seconds
  }`;
};

const countdownStart = () => {
  countdownTimer.value = setInterval(() => {
    countdown.value--;
    if (countdown.value === 0) {
      clearInterval(countdownTimer.value);
      emits("finish");
      playSound()
    }
  }, 1000);
};

countdownStart();

const onStop = () => {
  clearInterval(countdownTimer.value);
  emits("stop");
  stopPlaySound()
};
</script>
<style lang="less" scoped>
.view-timer {
  width: 100%;
  height: 100%;
}
.timer-box {
  position: absolute;
  left: 50%;
  top: 46%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10px;
  .timer-button {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    font-size: 18px;
    font-weight: bold;
    margin-top: 4px;
    opacity: 1 !important;
  }
  .stop-button {
    padding: 10px 12px;
    opacity: 0.7;
  }
}
</style>
