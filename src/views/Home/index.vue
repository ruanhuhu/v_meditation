<template>
  <div class="page-home">
    <ViewSetting @start="onStart" />
    <van-popup
      v-model:show="showViewTimer"
      position="right"
      :style="{ width: '100%', height: '100%' }"
    >
      <ViewTimer
        :show="showViewTimer"
        :duration="duration"
        @finish="onFinish"
        @stop="onStop"
        @play-sound="playSound"
        @stop-sound="stopSound"
      />
    </van-popup>
  </div>
</template>
<script lang="ts" setup>
import { computed, ref } from "vue";
import ViewSetting from "./ViewSetting.vue";
import ViewTimer from "./ViewTimer.vue";
// import mp3File from "/audio/yq.mp3";

enum VIEW {
  SETTING, // 设置
  TIMER, // 计时
}
const view = ref(VIEW.SETTING);
const duration = ref(12); // in minutes

const showViewTimer = computed(() => {
  return view.value === VIEW.TIMER;
});

const onStart = (durationVal: number) => {
  duration.value = durationVal;
  view.value = VIEW.TIMER;
};

const onFinish = () => {
  view.value = VIEW.SETTING;
};

const onStop = () => {
  view.value = VIEW.SETTING;
};



const sound = new Audio('/audio/yq.mp3');
const playSound = () => {
  sound.play();
};
const stopSound = () => {
  sound.pause();
  sound.currentTime = 0;
};
</script>
<style lang="less" scoped>
:deep(.control-box) {
  position: absolute;
  left: 50%;
  top: 46%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  .big-button {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    margin-bottom: 10px;
    font-size: 30px;
    font-weight: bold;
    opacity: 1 !important;
    .van-icon__image {
      width: 40px;
      height: 40px;
      margin-left: 10px;
    }
  }
  .todo-button {
    font-size: 16px;
    color: #666;
    padding: 10px 12px;
  }
}
</style>
