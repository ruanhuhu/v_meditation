<template>
  <div class="page-home">
    <ViewSetting @start="onStart" />
    <van-popup
      v-model:show="showViewTimer"
      position="right"
      :style="{ width: '100%', height: '100%' }"
    >
      <ViewTimer :duration="duration" @finish="onFinish" @stop="onStop" />
    </van-popup>
  </div>
</template>
<script lang="ts" setup>
import { computed, ref } from "vue";
import ViewSetting from "./ViewSetting.vue";
import ViewTimer from "./ViewTimer.vue";

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

const onStop= ()=>{
    view.value = VIEW.SETTING;
}
</script>
<style lang="less" scoped>
.control-box {
  position: absolute;
  left: 50%;
  top: 46%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  :deep(.start-button) {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    margin-bottom: 10px;
    .van-icon__image {
      width: 30px;
      height: 30px;
      margin-left: 4px;
    }
  }
  .duration-button {
    padding: 10px 12px;
  }
}
</style>
