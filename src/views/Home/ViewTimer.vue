<template>
    <div class="control-box">
      <van-button
        :disabled="true"
        class="big-button"
        color="linear-gradient(to right, #fc9e2e, #ff6034)"
      >
        {{ formatCountdown(countdown) }}
      </van-button>
      <span class="todo-button" @click="onStop">结束</span>
    </div>
</template>
<script lang="ts" setup>
import { ref, watch } from "vue";

const props = defineProps({
  duration: {
    type: String,
    required: true,
  },
  show: {
    type: Boolean,
    required: true,
  },
});

const emits = defineEmits(["finish", "stop","play-sound","stop-sound"]);

// 倒计时
const countdown = ref();
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
    if(countdown.value==3){
      emits('play-sound');
    }
    if (countdown.value === 0) {
      clearInterval(countdownTimer.value);
      emits("finish");
    }
  }, 1000);
};

const onStop = () => {
  emits('stop-sound');
  clearInterval(countdownTimer.value);
  emits("stop");
};

watch(
  () => props.show,
  (show) => {
    if (show) {
      emits('play-sound');
      countdown.value = Number(props.duration)+3;
      countdownStart();
    } else {
      clearInterval(countdownTimer.value);
      countdownTimer.value = null;
      countdown.value = null;
    }
  },
  { immediate: true }
);
</script>
<style lang="less" scoped>

</style>
