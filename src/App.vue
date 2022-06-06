
<template>
  <!-- 範例，實作時請註解 -->
  <grade-list-1 />
  <!-- <grade-list-2 /> -->
  <!-- 實作部分 -->
  <!-- <practice-1 /> -->
  <!-- <practice-2 /> -->
</template>

<script>
/* eslint-disable vue/no-unused-components */
import GradeList1 from "./components/GradeList1.vue";
import GradeList2 from "./components/GradeList2.vue";
import Practice1 from "./components/Practice1.vue";
import Practice2 from "./components/Practice2.vue";
export default {
  name: "App",
  components: {
    GradeList1,
    GradeList2,
    Practice1,
    Practice2,
  },
};
</script>
<style lang="scss" scoped>
@import "./assets/css/size.scss";
</style>