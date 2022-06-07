<template>
  <div>
    <h1 class="mt-2">成績紀錄表</h1>
    <br />
    <!-- 工具欄 -->
    <div class="grade-tool">
      <input v-model="searchObject.searchText" />
      <button type="button" class="btn btn-success m-1" @click="reloadData">
        搜尋
      </button>
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
    <!-- 表格 -->
    <table class="table">
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
        <nav aria-label="Page navigation example">
          <ul class="pagination display-flex justify-content-center">
            <li class="page-item" @click="changePage(-1)">
              <a class="page-link" href="#" aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
              </a>
            </li>
            <li class="page-item">
              <i class="page-link" href="#"
                >{{ searchObject.currentPage }} / {{ getLastPage }}</i
              >
            </li>
            <li class="page-item" @click="changePage(1)">
              <a class="page-link" href="#" aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
              </a>
            </li>
          </ul>
        </nav>
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
      searchObject: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
        sort: null,
        order: null,
        searchText: null,
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
    getLastPage() {
      let result = Math.round(
        this.searchObject.total / this.searchObject.pageSize
      );
      if (result === 0) return 1;
      if (this.searchObject.total % this.searchObject.pageSize !== 0)
        result += 1;
      return result;
    },
  },
  mounted() {
    this.$refs.newName.focus();
    this.reloadData(true);
  },
  methods: {
    async reloadData(flag) {
      // 判斷是否為分頁動作
      this.searchObject.currentPage = flag ? 1 : this.searchObject.currentPage
      // 必要query
      let url =
        this.searchObject.pageSize + "/" + this.searchObject.currentPage + "?";
      // 選填query
      let params = [
        this.searchObject.sort === null
          ? null
          : "sort=" + this.searchObject.sort,
        this.searchObject.order === null
          ? null
          : "order=" + this.searchObject.order,
        this.searchObject.searchText === null
          ? null
          : "querySearch=" + this.searchObject.searchText,
      ];
      url += params.filter((p) => !!p).join("&");
      // 請求資料
      await api.FindGrade.r(url).then((res) => {
        this.tableData = res.data.viewGrades;
        this.searchObject.total = res.data.total;
      });
    },
    async createData() {
      // 防呆
      if (this.templateData.name.length == 0) return alert("請填入姓名");

      await api.SaveGrade.r(this.templateData).then(() => {
        this.reloadData(true);
        // 還原新增資料
        this.templateData = {
          number: 0,
          name: "",
          grade: 0,
          checked: false,
        };
        this.$refs.newName.focus();
      });
    },
    async deleteDataSubmit() {
      // 防呆
      if (this.checkList.length == 0) return alert("請確認有無勾選!");

      for (let c in this.checkList) {
        await this.deleteData(this.checkList[c]);
      }
      this.reloadData(true);
      this.$refs.newName.focus();
      // 清空
      this.checkList = [];
      this.checkedAllValue = this.checkedAllValue === true ? false : false;
      this.$refs.newName.focus();
    },
    async deleteData(index) {
      await api.DeleteGrade.r(index);
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
    changePage(number) {
      // 最大分頁數
      let max = Math.round(
        this.searchObject.total / this.searchObject.pageSize
      );
      // 非整數情況
      if (this.searchObject.total % this.searchObject.pageSize !== 0) max += 1;

      // 換頁
      this.searchObject.currentPage += number;

      // 最後頁
      if (this.searchObject.currentPage >= max)
        this.searchObject.currentPage = max;
      // 最前頁
      else if (this.searchObject.currentPage <= 1)
        this.searchObject.currentPage = 1;

      this.reloadData(false);
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
  // 表頭
  thead {
    width: 100%;
    display: block;
    th {
      background-color: rgb(205, 210, 215);
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
    height: 315px;
    display: block;
    tr {
      display: block;
      td {
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
      background-color: rgb(205, 210, 215);
      width: 599px;
      &:first-child {
        width: 48px;
      }
    }
  }
}
// 工具列
.grade-tool {
  padding: 0rem 1rem;
  text-align: left;
  background-color: rgb(246, 246, 246);
}

.page-input {
  display: inline-block;
  width: 2rem;
  color: gray;
  text-decoration: none;
  background-color: #fff;
  border: 1px solid #dee2e6;
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
}
</style>