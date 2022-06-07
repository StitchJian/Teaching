<template>
  <div>
    <h1 class="mt-2">成績紀錄表</h1>
    <br />
    <!-- 工具欄 -->
    <div class="grade-tool">
      <button type="button" class="btn btn-primary m-1" @click="createData">
        新增
      </button>
      <button
        type="button"
        class="btn btn-danger m-1"
        @click="deleteDataSubmit"
      >
        刪除
      </button>
    </div>
    <br />
    <!-- 表格 -->
    <table>
      <thead>
        <tr>
          <th>
            <input
              type="checkbox"
              v-model="checkedAllValue"
              @change="checkAll"
            />
          </th>
          <th>學號</th>
          <th>姓名</th>
          <th>成績</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(data, index) in tableData" :key="index">
          <td>
            <input
              type="checkbox"
              @change="checkedData(data.number)"
              v-model="data.checked"
            />
          </td>
          <td><input v-model="data.number" readonly /></td>
          <td><input v-model="data.name" /></td>
          <td>
            <input v-model="data.grade" type="number" min="0" max="100" />
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td>新增</td>
          <td><input v-model="templateData.number" readonly /></td>
          <td><input ref="newName" v-model="templateData.name" /></td>
          <td>
            <input
              v-model="templateData.grade"
              type="number"
              min="0"
              max="100"
            />
          </td>
        </tr>
        <tr>
          <td colspan="3">平均</td>
          <td>
            {{ gradeSum }}
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>
<script>
import * as api from "../api/grade.js";
export default {
  name: "GradeList2",
  data() {
    return {
      tableData: [],
      templateData: {
        number: 0,
        name: "",
        grade: 0,
        checked: false,
      },
      checkList: [],
      checkedAllValue: false,
    };
  },
  computed: {
    gradeSum() {
      // 判斷陣列為空(抓不到值會出錯)
      if (this.tableData.length > 0) {
        return Math.round(
          this.tableData.map((d) => d.grade).reduce((a, b) => a + b) /
            this.tableData.length
        );
      } else {
        return 0;
      }
    },
  },
  mounted() {
    this.$refs.newName.focus();
    this.reloadData();
  },
  methods: {
    async reloadData() {
      await api.GetAllGrade.r().then((res) => {
        this.tableData = res.data;
      });
    },
    async createData() {
      // 防呆
      if (this.templateData.name.length == 0) return alert("請填入姓名");

      await api.SaveGrade.r(this.templateData)
        .then(() => {
          this.reloadData();
          // 還原新增資料
          this.templateData = {
            number: 0,
            name: "",
            grade: 0,
            checked: false,
          };
          this.$refs.newName.focus();
        })
    },
    async deleteDataSubmit() {
      // 防呆
      if (this.checkList.length == 0) return alert("請確認有無勾選!");

      for (let c in this.checkList) {
        await this.deleteData(this.checkList[c]);
      }
      this.reloadData();
      this.$refs.newName.focus();
      // 清空
      this.checkList = [];
      this.checkedAllValue = this.checkedAllValue === true ? false : false;
      this.$refs.newName.focus();
    },
    async deleteData(index) {
      await api.DeleteGrade.r(index)
    },
    checkedData(number) {
      // 判斷是否有在勾選中
      const checkIndex = this.checkList.findIndex((c) => c == number);
      // 有
      if (checkIndex < 0) {
        this.checkList.push(number);
      } else {
        this.checkList.splice(checkIndex, 1);
      }
    },
    checkAll() {
      // 確認全選狀態並改變勾選表值
      if (this.checkedAllValue)
        this.checkList = this.tableData.map((d) => d.number);
      else this.checkList = [];
      // 改變各item check狀態
      this.tableData.forEach((d) => {
        d.checked = this.checkedAllValue;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
// 所有
* {
  margin: 0;
  padding: 0;
  text-align: center;
  line-height: 1.5rem;
}
//表格
table {
  border-collapse: collapse;
  width: 100%;
  display: block;
  background-color: rgb(202, 223, 247);
  // 表頭
  thead {
    width: 100%;
    display: block;
    th {
      border: 0.1rem solid black;
      width: 600px;
      &:first-child {
        width: 50px;
      }
    }
  }
  // 表身
  tbody {
    overflow-y: scroll;
    overflow-x: hidden;
    width: 101%;
    height: 300px;
    display: block;
    background-color: rgba(218, 215, 215, 0.878);
    tr {
      background-color: rgb(215, 204, 204);
      display: block;
      td {
        border: 0.1rem solid black;
        width: 600px;
        &:first-child {
          width: 50px;
        }
      }
      input {
        width: 100%;
      }
    }
  }
  // 表尾
  tfoot {
    width: 100%;
    display: block;
    td {
      input {
        width: 100%;
      }
      border: 0.1rem solid black;
      width: 599px;
      &:first-child {
        width: 48px;
      }
    }
  }
}
// 工具列
.grade-tool {
  text-align: center;
}
</style>