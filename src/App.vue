<script setup>
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus'

let mapOpen = [];
let mapClosed = [];
let startNode = [0, 0]
let goal = [2, 2]
const goalRef = ref('2,2')
const startRef = ref('0,0')
const row = ref(3);
const col = ref(3);
let maze = ref([
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
]);
function blockChange(x, y) {
  let n = maze.value[x][y]
  maze.value[x][y] = (n == 0 ? 1 : 0)
}
function mazeChange() {
  console.log('尝试改变');
  maze.value = new Array(row.value).fill(0).map(() => {
    return Array(col.value).fill(0)
  })
}
//算法
class mapNode {
  constructor(status, lastStep, step, father) {
    this.status = status;
    this.step = step; //类中变量
    this.fn =
      step +
      Math.abs(status[0] - goal[0]) +
      Math.abs(status[1] - goal[1]);
    this.lastStep = lastStep;
    this.father = father;
  }
  findStep() {
    const nextStep = [];
    const x = this.status[0];
    const y = this.status[1];
    // 上下左右算子
    if (x + 1 < row.value && maze.value[x + 1][y] == 0 && this.lastStep != "上") {
      nextStep.push("下");
    }
    if (y + 1 < col.value && maze.value[x][y + 1] == 0 && this.lastStep != "左") {
      nextStep.push("右");
    }
    if (x - 1 >= 0 && maze.value[x - 1][y] == 0 && this.lastStep != "下") {
      nextStep.push("上");
    }
    if (y - 1 >= 0 && maze.value[x][y - 1] == 0 && this.lastStep != "右") {
      nextStep.push("左");
    }
    return nextStep;
  }
  addFather(father) {
    this.father.push(father);
  }
}
function notOpen(node) {
  for (let index in mapOpen) {
    let element = mapOpen[index];
    if (node.status[0] == element.status[0] && node.status[1] == element.status[1]) {
      if (node.fn < element.fn) {
        mapOpen.splice(index, 1, node)
      }
      return false;
    }
  }
  return true;
}
function notClosed(node) {
  for (let index in mapClosed) {
    let element = mapClosed[index];
    if (node.status[0] == element.status[0] && node.status[1] == element.status[1]) {
      if (node.fn < element.fn) {
        mapClosed.splice(index, 1)
        mapOpen.push(node)
      }
      return false;
    }
  }
  return true;

}

function migong() {
  let index = 0
  while (mapOpen.length) {
    index = index + 1
    console.log(index, '次循环');
    mapOpen.sort((a, b) => {
      return a.fn - b.fn;
    });
    let n = mapOpen.shift();
    if (n.status[0] == goal[0] && n.status[1] == goal[1]) {
      // TODO: 找到路线
      let line = n.father.concat([n.status])
      ElMessage.success(`找到路线啦，共走了${line.length-1}步`)
      line.forEach((element, index) => {
        maze.value[element[0]][element[1]] = 3
      }
      )
      return true;
    }
    let readyList = n.findStep();
    readyList.map((item) => {
      let x = n.status[0];
      let y = n.status[1];
      let status = [];
      let lastStep = "";
      switch (item) {
        case "下":
          status = [x + 1, y];
          lastStep = "下";
          break;
        case "右":
          status = [x, y + 1];
          lastStep = "右";
          break;
        case "上":
          status = [x - 1, y];
          lastStep = "上";
          break;
        case "左":
          status = [x, y - 1];
          lastStep = "左";
          break;
      }
      const newNode = new mapNode(status, lastStep, n.step + 1, n.father.concat([n.status]));
      if (notOpen(newNode) && notClosed(newNode)) {
        mapOpen.push(newNode);
      }
    });
    mapClosed.push(n)
  }
  ElMessage.info('此迷宫无解')
}
function main() {
  mapOpen = [];
  mapClosed = [];
  maze.value = maze.value.map(item => {
    return item.map(element => {
      return element == 1 ? 1 : 0
    })
  })
  if(startNode[0]<0||startNode[0]>=row.value||startNode[1]<0||startNode[1]>=col.value){
    ElMessage.error('开始坐标超出范围')
    return
  }
  if(goal[0]<0||goal[0]>=row.value||goal[1]<0||goal[1]>=col.value){
    ElMessage.error('目的坐标超出范围')
    return
  }
  if(maze.value[startNode[0]][startNode[1]]==1){
    ElMessage.info('此迷宫无解')
    return
  }
  const n = new mapNode(startNode, '', 0, [])
  mapOpen.push(n)
  migong()
}
function reset() {
  mapOpen = [];
  mapClosed = [];
  mazeChange()
}
function startChange() {
  startNode = startRef.value.split(',').map((item) => {
    return parseInt(item)
  })
  console.log(startNode);
}
function goalChange() {
  goal = goalRef.value.split(',').map((item) => {
    return parseInt(item)
  })
  console.log(goal);
}
</script>

<template>
  <div class="container">
    <div class="role">
      <h2 style="margin-right: 0px;">操作方法</h2>
      <div style="text-align:justify;">
        1.设置好迷宫行数和迷宫列数<br/>
        2.点击重置迷宫或者空白处<br/>
        3.点击迷宫方格，将有障碍的地方设置为灰色，表示不可通过<br/>
        4.设置好开始坐标和目的坐标<br/>
        5.点击开始寻路按钮<br/>
        6.寻路完成后会有消息提示并将路线显示在迷宫中<br/>

      </div>

    </div>
    <div class="left">
      <h2>迷宫设置</h2>
      <el-form label-width="120px">
        <el-form-item label="迷宫行数">
          <el-input-number v-model="row" @change="mazeChange">
          </el-input-number>
        </el-form-item>
        <el-form-item label="迷宫列数">
          <el-input-number v-model="col" @change="mazeChange">
          </el-input-number>
        </el-form-item>
        <el-form-item label="开始坐标">

          <el-input v-model="startRef" placeholder="Please input" @change="startChange">
          </el-input>
        </el-form-item>
        <el-form-item label="目的坐标">

          <el-input v-model="goalRef" placeholder="Please input" @change="goalChange">
          </el-input>
        </el-form-item>
        <el-button type="success" @click="main">开始寻路</el-button>
        <el-button type="warning" @click="reset">重置迷宫</el-button>
      </el-form>

    </div>

    <div class="maze">
      <h2>迷宫</h2>
      <div class="row" v-for="(item, index) in maze">
        <div class="block" :class="{ chose: items == 1, unchose: items == 0, line: items == 3 }" v-for="(items, indexs) in item"
          @click="blockChange(index, indexs)">
          {{ items }}
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>
.block {
  width: 70px;
  height: 70px;
  margin: 2px;
  border: 1px solid black;
}

.chose {
  background-color: grey
}

.unchose {
  background-color: white;
}

.line {
  background-color: aquamarine;
}

.row {
  display: flex;
}

.container {
  display: flex;
  padding: 20px;
  border: 2px solid var(--el-border-color);
  border-radius: 4px;

}



.role {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 280px;
}

.left {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 280px;

  margin-right: 30px;
}
</style>
