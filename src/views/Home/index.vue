<template>
  <div class="page-home">
    <ViewDuration @start="onStart" />
    <!-- 倒计时时长弹窗 -->
    <van-popup
      v-model:show="showViewTimer"
      position="right"
      :style="{ width: '100%', height: '100%' }"
    >
      <ViewTimer
        :show="showViewTimer"
        :duration="record.duration"
        @finish="onFinish"
        @stop="onStop"
        @play-sound="playSound"
        @stop-sound="stopSound"
      />
    </van-popup>
    <!-- 记录弹窗 -->
    <van-popup
      v-model:show="showViewNote"
      position="right"
      :style="{ width: '100%', height: '100%' }"
    >
      <ViewNote :show="showViewNote" @confirm="onConfirm" />
    </van-popup>
    <section class="bottom-section">
      <router-link to="history">我的记录</router-link>
    </section>
  </div>
</template>
<script lang="ts" setup>
import { computed, ref } from "vue";
import ViewDuration from "./ViewDuration.vue";
import ViewTimer from "./ViewTimer.vue";
import ViewNote from "./ViewNote.vue";
import localforage from "localforage";
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';

/**
 * 音频
 */
const sound = new Audio("/audio/yq.mp3");
const playSound = () => {
  sound.play();
};
const stopSound = () => {
  sound.pause();
  sound.currentTime = 0;
};

/**
 * 视图
 */
enum VIEW {
  SETTING, // 设置
  TIMER, // 计时
  NOTE, // 留言
}

const view = ref(VIEW.SETTING); // 视图
const record = ref({
  duration: '', // 时长
  note: '', // 记录
  startTime:'', // 开始时间
  endTime:'', // 结束时间
});

const showViewTimer = computed(() => {
  return view.value === VIEW.TIMER;
});
const showViewNote = computed(() => {
  return view.value === VIEW.NOTE;
});

// 开始倒计时
const onStart = (durationVal: string) => {
  record.value.duration = durationVal;
  record.value.startTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
  view.value = VIEW.TIMER;
};
// 倒计时完成
const onFinish = () => {
  record.value.endTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
  view.value = VIEW.NOTE;
};
// 停止倒计时
const onStop = () => {
  view.value = VIEW.SETTING;
};

/**
 * 数据
 */
const addRecord = () => {
  const id = uuidv4()
  localforage.setItem(id, {...record.value})
};
const onConfirm = (noteValue: string) => {
  record.value.note = noteValue;
  addRecord();
  view.value = VIEW.SETTING;
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
    font-size: 18px;
    color: #666;
    padding: 10px 12px;
  }
}

.bottom-section{
  position: absolute;
  bottom: 30px;
  width: 100%;
  text-align: center;
  font-size: 15px;
  color: #999;
  a{
    color: inherit;
  }
}
</style>
