<template>
  <div class="control-box">
    <van-button
      class="big-button"
      color="linear-gradient(to right, #fc9e2e, #ff6034)"
      :icon="startIocn"
      :disabled="showCustomDurationKeyboard"
      @click="onStart"
    ></van-button>
    <span
      class="todo-button"
      v-show="!showCustomDurationKeyboard"
      @click="showDurationSelector = true"
    >
      {{ duration }}分钟</span
    >
    <van-field
      v-show="showCustomDurationKeyboard"
      v-model="customDurationText"
      input-align="center"
      readonly
      placeholder="自定义时长（分钟）"
    />
  </div>
  <van-number-keyboard
    :show="showCustomDurationKeyboard"
    :maxlength="6"
    @blur="showCustomDurationKeyboard = false"
  />
  <van-number-keyboard
    v-model="customDuration"
    :show="showCustomDurationKeyboard"
    theme="custom"
    close-button-text="完成"
    @blur="onCustomDurationKeyboardBlur"
  />
  <!-- 选择时长 -->
  <van-popup v-model:show="showDurationSelector" position="bottom" round>
    <van-picker
      v-if="showDurationSelector"
      :defaultIndex="defaultIndex"
      :columns="durationOptions"
      @confirm="onSelectDuration"
      @cancel="showDurationSelector = false"
    />
  </van-popup>
</template>
<script lang="ts" setup>
import { ref, computed, watch } from "vue";
import type { PickerObjectOption } from "vant";
import startIocn from "../../assets/start.png";

const emits = defineEmits(["start"]);

/**
 * 时长
 */
enum LOCALSTORAGE {
  DURATION = "duration", // 选择的时长
  CUSTOM_DURATION = "custom_duration", // 自定义的时长
}
// 设置时长缓存
const setLocalStorage = (key: LOCALSTORAGE, duration: string) => {
  localStorage.setItem(key, duration);
};
// 获取时长缓存
const getLocalStorage = (key: LOCALSTORAGE) => {
  const value = localStorage.getItem(key);
  if (value) {
    return value;
  }
  return "";
};
// 当前选择时长
const duration = ref<string>(getLocalStorage(LOCALSTORAGE.DURATION) || "12"); // in minutes
// 自定义时长
const customDuration = ref<string>(
  getLocalStorage(LOCALSTORAGE.CUSTOM_DURATION) || ""
);
// 时长选择器
const showDurationSelector = ref(false);
// 默认时长选择器选项
const defaultIndex = ref();
// 时长选项
const durationOptions = ref<PickerObjectOption[]>([
  {
    text: "自定义",
    value: "custom",
  },
  {
    text: "12分钟",
    value: 12,
  },
  {
    text: "24分钟",
    value: 24,
  },
  {
    text: "36分钟",
    value: 36,
  },
  {
    text: "48分钟",
    value: 48,
  },
  {
    text: "60分钟",
    value: 60,
  },
]);
// 更新时长
const updateDuration = (durationVal: string) => {
  duration.value = durationVal;
  setLocalStorage(LOCALSTORAGE.DURATION, durationVal);
};
// 更新自定义时长
const updateCustomDuration = (durationVal: string) => {
  customDuration.value = durationVal;
  setLocalStorage(LOCALSTORAGE.CUSTOM_DURATION, durationVal);
};
// 监听自定义时长，更新时长选项
watch(
  customDuration,
  (val) => {
    if (val && Number(val) > 0) {
      const idx = durationOptions.value.findIndex((item) => item.value === val);
      // 添加自定义时长
      if (idx === -1) {
        durationOptions.value.splice(1, 0, {
          text: val + "分钟",
          value: val,
        });
      }
    }
  },
  { immediate: true }
);
// 监听时长选择器显示，初始化时长选择器的默认选项
watch(
  showDurationSelector,
  (show) => {
    if (show) {
      defaultIndex.value = durationOptions.value.findIndex(
        (option) => option.value === duration.value
      );
    }
  },
  { immediate: true }
);

// 选择时长
const onSelectDuration = (opt: PickerObjectOption, idx: number) => {
  if (opt.value === "custom") {
    // 设置自定义时长
    openCustomDurationKeyboard();
  } else {
    // 更新选择的时长
    updateDuration(opt.value);
  }
  // 关闭时长选择器
  showDurationSelector.value = false;
};

// 设置自定义时长
const showCustomDurationKeyboard = ref(false);
watch(customDuration, (val) => {
  // 更新有效自定义时长
  customDuration.value =
    val !== "" && Number(val) !== 0 ? parseInt(val) + "" : "";
});
const customDurationText = computed(() => {
  return customDuration.value != "" ? customDuration.value + "分钟" : "";
});
// 打开自定义时长键盘
const openCustomDurationKeyboard = () => {
  customDuration.value = "";
  showCustomDurationKeyboard.value = true;
};
// 关闭自定义时长键盘
const onCustomDurationKeyboardBlur = () => {
  if (customDuration.value !== "") {
    // 更新选择的时长
    updateDuration(customDuration.value);
    // 更新自定义时长
    updateCustomDuration(customDuration.value);
  }
  showCustomDurationKeyboard.value = false;
};

// 开始
const onStart = () => {
  emits("start",duration.value);
};
</script>
<style lang="less" scoped></style>
