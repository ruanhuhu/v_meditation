<template>
  <header>
    <div class="info-item">
      <p class="info-value">{{ totalCount }}<span class="unit">次</span></p>
      <p class="info-name">总次数</p>
    </div>
    <div class="info-item">
      <p class="info-value">
        {{ formatDuration(totalDuration).hours }}<span class="unit">小时</span
        >{{ formatDuration(totalDuration).minutes
        }}<span class="unit">分钟</span>
      </p>
      <p class="info-name">总时长</p>
    </div>
    <div class="info-item">
      <p class="info-value">
        {{ formatDuration(averageDuration).hours }}<span class="unit">小时</span
        >{{ formatDuration(averageDuration).minutes
        }}<span class="unit">分钟</span>
      </p>
      <p class="info-name">平均时长</p>
    </div>
  </header>
  <van-list
    class="record-list"
    v-model:loading="loading"
    :finished="finished"
    finished-text=""
    @load="onLoad"
  >
    <van-collapse v-model="activeRecord" accordion>
      <van-collapse-item v-for="record in list" :name="record.id">
        <template #title>
          <span class="title">
            <span class="duration">{{ record.duration }}分</span>
            <van-icon class="icon-note" v-if="record.note" name="orders-o" />
          </span>
          <span class="time">{{ formatTime(record.startTime) }}</span>
        </template>

         {{ record.note }}
      </van-collapse-item>
    </van-collapse>
  </van-list>
</template>
<script lang="ts" setup>
import { ref, computed } from "vue";
import localforage from "localforage";
import dayjs from "dayjs";

type MyRecord = {
  id: string;
  duration: string;
  note: string;
  startTime: string;
  endTime: string;
};
// 记录初始化标记
const recordInited = ref(false);
// 所有记录
const records = ref<MyRecord[]>([]);
// 总次数
const totalCount = computed(() => {
  return records.value.length;
});
// 总时长
const totalDuration = computed(() => {
  return records.value.reduce((total, item) => {
    return total + parseInt(item.duration);
  }, 0);
});
// 平均时长
const averageDuration = computed(() => {
  return totalCount.value ? totalDuration.value / totalCount.value : 0;
});
const getMyRecords = async (): Promise<MyRecord[]> => {
  return new Promise((resolve, reject) => {
    const result: MyRecord[] = [];
    // The same code, but using ES6 Promises.
    localforage
      .iterate(function (value, key, iterationNumber) {
        // Resulting key/value pair -- this callback
        // will be executed for every item in the
        // database.
        // console.log([key, value]);

        const data = value as MyRecord;
        const record = {
          id: key,
          duration: data.duration,
          note: data.note,
          startTime: data.startTime,
          endTime: data.endTime,
        };
        result.push(record);
      })
      .then(function () {
        return resolve(result);
      })
      .catch(function (err) {
        // This code runs if there were any errors
        console.log(err);
        return reject("");
      });
  });
};

// 时长格式化：分钟转小时分钟
type Duration = {
  hours: number;
  minutes: number;
};
const formatDuration = (duration: number): Duration => {
  return {
    hours: Math.floor(duration / 60),
    minutes: duration % 60,
  };
};

const loading = ref(false);
const query = ref({
  page: 0,
  pageSize: 10,
});
const finished = ref(false);
const list = ref<MyRecord[]>([]);
const onLoad = async () => {
  try {
    loading.value = true;
    query.value.page++;
    if (!recordInited.value) {
      records.value = await getMyRecords();
      recordInited.value = true;
    }
    for (let i = 0; i < query.value.pageSize; i++) {
      const idx = (query.value.page - 1) * query.value.pageSize + i;
      if (idx + 1 <= totalCount.value) {
        list.value.push(records.value[idx]);
      } else {
        finished.value = true;
        break;
      }
    }
    loading.value = false;
  } catch (error) {
    console.log("error", error);
  }
};

const activeRecord = ref("");
// 时间戳转月日时分
const formatTime = (time: string): string => {
  const date = dayjs(time).toDate();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const padding = (num: number) => (num < 10 ? "0" + num : num);
  // 不是今年
  if (year !== new Date().getFullYear()) {
    return `${year}年${padding(month)}月${padding(day)} ${padding(
      hour
    )}:${padding(minute)}`;
  }
  // 是今年
  return `${padding(month)}月${padding(day)} ${padding(hour)}:${padding(
    minute
  )}`;
};
</script>
<style lang="less" scoped>
header {
  height: 130px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  background-color: #fc9e2e;
  color: #fff;
  padding-bottom: 30px;
  p {
    margin: 0;
  }
  .info-item {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
  }
  .info-name {
    font-size: 14px;
    font-weight: 400;
  }
  .unit {
    opacity: 0.85;
    font-size: 14px;
    padding: 0 3px;
    font-weight: normal;
  }
  .info-value {
    font-size: 28px;
  }
}
.record-list {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: calc(160px - 30px);
  background-color: #fff;
  border-top-left-radius: 40px;
  border-top-right-radius: 40px;
  overflow-y: auto;
  padding: 20px;
  :deep(.van-cell__title) {
    display: flex;
    justify-content: space-between;
    .title {
      display: flex;
      align-items: center;
      font-size: 16px;
    }
    .duration {
      color: #000;
    }
    .icon-note {
      color: #999;
      margin-left: 4px;
    }
  }
  :deep(.van-collapse-item__content){
    text-align: left;
  }
}
</style>
