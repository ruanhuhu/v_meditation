<template>
  <div class="view-setting">
    <div class="control-box">
      <van-button
        class="big-button"
        color="linear-gradient(to right, #fc9e2e, #ff6034)"
        :icon="startIocn"
        @click="onStart"
      ></van-button>
      <span class="todo-button" @click="showDurationSelector = true">
        {{ duration }}分钟</span
      >
    </div>
    <!-- 选择时长 -->
    <van-popup v-model:show="showDurationSelector" position="bottom" round>
      <van-picker
        :defaultIndex="defaultIndex"
        :columns="durationOptions"
        @confirm="onSelectDuration"
        @cancel="showDurationSelector = false"
      />
    </van-popup>
    <!-- 自定义时长 -->
    <van-dialog
      v-model:show="showCustomDurationModal"
      title="设置自定义时长"
      theme="round-button"
    >
      <van-field
        ref="customDurationInputRef"
        autocomplete="off"
        v-model="customDuration"
        placeholder="自定义时长"
      />
    </van-dialog>
  </div>
</template>
<script lang="ts" setup>
import { nextTick, ref } from "vue";
import type { PickerObjectOption, FieldInstance } from "vant";
import { Dialog } from "vant";
import "vant/es/dialog/style/index";
import startIocn from "../../assets/start.png";

const emits = defineEmits(["start"]);

// 时长
const duration = ref(12); // in minutes
// 时长选项
const durationOptions = ref<PickerObjectOption[]>([
  //   {
  //     text: "自定义",
  //     value: "custom",
  //   },
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

// 时长选择器
const showDurationSelector = ref(false);
const defaultIndex = ref(0); // 默认时长选择器选项

// 设置时长
const setDuration = (num: number) => {
  duration.value = num;
  showDurationSelector.value = false;
};
// 选择时长
const onSelectDuration = (opt: PickerObjectOption, idx: number) => {
  if (opt.value === "custom") {
    openCustomDurationDialog();
  } else {
    setDuration(opt.value);
  }
  defaultIndex.value = idx;
  showDurationSelector.value = false;
};

// 自定义时长弹窗
const VanDialog = Dialog.Component;
const showCustomDurationModal = ref(false);
const customDuration = ref("");
const customDurationInputRef = ref<FieldInstance | null>(null);
const autoFocusDurationInput = () => {
  if (customDurationInputRef.value) {
    customDurationInputRef.value.blur();
    nextTick(() => {
      customDurationInputRef.value!.focus();
    });
  }
  setTimeout(() => {
    autoFocusDurationInput();
  }, 100);
};
const openCustomDurationDialog = () => {
  customDuration.value = "";
  showCustomDurationModal.value = true;
  autoFocusDurationInput();
};

// 开始
const onStart = () => {
  emits("start", duration.value);
};
</script>
<style lang="less" scoped>

</style>
