const row = 3;
const col = 3;
const goal = [2, 2];
const maze = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 1],
];
const mapOpen = [];
const mapClosed = [];
class mapNode {
  constructor(status, lastStep, step,father) {
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
    if (x + 1 < row && maze[x + 1][y] == 0 && this.lastStep != "上") {
      nextStep.push("下");
    }
    if (y + 1 < col && maze[x][y + 1] == 0 && this.lastStep != "左") {
      nextStep.push("右");
    }
    if (x - 1 >= 0 && maze[x - 1][y] == 0 && this.lastStep != "下") {
      nextStep.push("上");
    }
    if (y - 1 >= 0 && maze[x][y - 1] == 0 && this.lastStep != "右") {
      nextStep.push("左");
    }
    return nextStep;
  }
  addFather(father) {
    this.father.push(father);
  }
}
function isOpen(node){
  for(let index in mapOpen){
    let element = mapOpen[index];
    if(node.status[0]==element.status[0]&&node.status[1]==element.status[1]){
            if(node.fn<element.fn){
                mapOpen.splice(index,1,node)
                console.log('老open[进入open]');
            }
            console.log('老open');
            return true;
        }
  }
    return false;
}
function isClosed(node){
  for(let index in mapClosed){
    let element = mapClosed[index];
    if(node.status[0]==element.status[0]&&node.status[1]==element.status[1]){
            if(node.fn<element.fn){
                mapClosed.splice(index,1)
                mapOpen.push(node)
            console.log('老closed[进入open]');
            }
            console.log('老closed');
            return true;
        }
  }
    return false;

}

function migong() {
    let index = 0
  while (mapOpen.length) {
    index=index+1 
    console.log(index,'次循环');
    mapOpen.sort((a,b)=>{
        return a.fn-b.fn;
    });
    let n = mapOpen.shift();
    if (n.status[0] == goal[0]&&n.status[1]== goal[1]) {
      // TODO: 找到路线
      console.log("找到了");
      console.log(n.father);
      console.log(n.status);
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
      const newNode = new mapNode(status, lastStep, n.step + 1,n.father.concat([n.status]));
      if(!isOpen(newNode) && !isClosed(newNode)){
        mapOpen.push(newNode);
        console.log('全新节点');
      }
    });
    mapClosed.push(n)
  }
  console.log('无解');
}
function main(){
    const n = new mapNode([0,0],'',0,[])
    mapOpen.push(n)
    migong()
}
main()
