<template>
  <div>
    <h1 class="mt-2">成績紀錄表</h1>
    <br />
    <!-- 工具欄 -->
    <div class="grade-tool">
      <button type="button" class="btn btn-primary m-1" @click="createData">
        新增
      </button>
    </div>
    <br />
    <!-- 表格 -->
    <table>
      <thead>
        <tr>
          <th colspan="2">學號</th>
          <th>姓名</th>
          <th>成績</th>
          <th>編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(data, index) in tableData" :key="index">
          <td><input v-model="data.number" readonly /></td>
          <td><input v-model="data.name" /></td>
          <td>
            <input v-model="data.grade" type="number" min="0" max="100" />
          </td>
          <td>
            <button
              type="button"
              class="btn btn-danger m-1"
              @click="deleteData(index)"
            >
              X
            </button>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td>新增</td>
          <td><input v-model="templateData.number" readonly /></td>
          <td><input ref="newName" v-model="templateData.name" /></td>
          <td colspan="2">
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
          <td colspan="2">
            {{ gradeSum }}
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>
<script>
export default {
  name: "GradeList1",
  data() {
    return {
      tableData: [],
      templateData: {
        number: 1,
        name: "",
        grade: 0,
        checked: false,
      },
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
  },
  methods: {
    createData() {
      // 防呆
      if (this.templateData.name.length == 0) return alert("請填入姓名");
      // 新增暫存變數並將新增資料複製給值
      let temp = {};
      Object.assign(temp, this.templateData);
      // 塞入資料陣列
      this.tableData.push(temp);
      // 還原新增資料
      this.templateData = {
        number: this.templateData.number + 1,
        name: "",
        grade: 0,
        checked: false,
      };
      this.$refs.newName.focus();
    },
    deleteData(index) {
      this.tableData.splice(index, 1);
      this.$refs.newName.focus();
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
      width: 490px;
      &:last-child {
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
        width: 490px;
        &:last-child {
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
      width: 470px;
      &:first-child {
        width: 48px;
      }
       &:last-child {
        width: 540px;
      }
    }
  }
}
// 工具列
.grade-tool {
  text-align: center;
}
</style>