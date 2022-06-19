<template>
  <div class="view-note">
    <textarea
      ref="inputRef"
      :value="note"
      @input="onChange"
      placeholder="如果想记录什么..."
    ></textarea>
    <footer>
    <van-button size="large" round color="linear-gradient(to right, #fc9e2e, #ff6034)" @click="onConfirm">👌</van-button>
    </footer>
  </div>
</template>
<script lang="ts" setup>
import { ref, watch, onMounted } from "vue";

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
});

const emits = defineEmits(["confirm"]);

const note = ref("");
const inputRef = ref();
const onChange = (e: any) => {
  note.value = e.target.value;
};
const onConfirm = ()=>{
    emits('confirm',note.value);
}
onMounted(() => {
  watch(
    () => props.show,
    (show) => {
      if (show) {
        note.value = "";
      }
    },
    { immediate: true }
  );
});
</script>
<style lang="less" scoped>
.view-note {
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 10px 0;
  box-sizing: border-box;
}
textarea {
  display: block;
  box-sizing: border-box;
  width: 100%;
  height: calc(100% - 60px);
  padding: 0 10px;
  min-width: 0;
  margin: 0;
  line-height: inherit;
  text-align: left;
  background-color: transparent;
  border: 0;
  resize: none;
  user-select: auto;
}
footer{
    padding: 10px 20px;
}
</style>
