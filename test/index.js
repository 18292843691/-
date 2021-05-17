// import a from './a.mjs'
// import b from './b.mjs'
// import '../leetcode'
// import ts from './somets.ts'
import './flex.css'

__webpack_nonce__ = "c29tZSBjb29sIHN0cmluZyB3aWxsIHBvcCB1cCAxMjM=";

// console.log(ts)
// console.log('index', a, b)

// if ('serviceWorker' in navigator) {
//   console.log('load serviceWorker')
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('/service-worker.js').then(registration => {
//       console.log('SW registered: ', registration);
//     }).catch(registrationError => {
//       console.log('SW registration failed: ', registrationError);
//     });
//   });
// }

class Node {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}

class ListNode {
  constructor() {
    this.root = null;
  }

  insert(val) {
    const node = new Node(val);
    if (!this.root) {
      this.root = node;
    } else {
      if (node.val < this.root.val) {
        node.next = this.root;
        this.root = node;
      } else if (node.val > this.root.val) {
        if (!this.root.next) {
          this.root.next = node;
        } else {
          let tmpNode = this.root;
          while (tmpNode && tmpNode.next) {
            if (!tmpNode.next) {
              tmpNode.next = node;
              break;
            }

            if (node.val > tmpNode.next.val) {
              tmpNode = tmpNode.next;
            } else {
              node.next = tmpNode.next;
              tmpNode.next = node;
              break;
            }
          }
        }
      }
    }
  }

  reserve() {
    if (!this.root) return;

    if (!this.root.next) return this.root;

    let curNode = this.root;
    let preNode = null;

    // 1 => 2 => 3 => 4

    // next = 2, cur = 1, 1 => null, pre = 1, cur = 2
    // next = 3, cur = 2,  2 => 1 => null, pre = 2, cur = 3
    // next = 4, cur = 3, 3 => 2 => 1 => null, pre = 3, cur = 4
    // next = null, cur = 4, 4 => 3 => 2 => 1 => null, pre = 4, cur = null, break;
    while (curNode) {
      const next = curNode.next;
      curNode.next = preNode;
      preNode = curNode;
      curNode = next;
    }

    this.root = preNode;
    return this;
  }

  recursionReserve(head) {
    if (!head || !head?.next) {
      return head;
    }

    // 1 => 2 => 3 => 4
    newHead = recursionReserve(head.next);

    // 3 => 4; return
    // 4 => 3 => null
    // 4 => 3 => 2 => null
    // 4 => 3 => 2 => 1 => null
    head.next.next = head;
    head.next = null;

    return newHead;
  }

  map() {
    let list = ``;
    let tmpNode = this.root;
    while (tmpNode) {
      list += `${tmpNode.val} => `;
      tmpNode = tmpNode.next;
    }
    console.log(list);
    return list;
  }

  find(val) {
    let tmpNode = this.root;
    while (tmpNode) {
      if (val === tmpNode.val) {
        return tmpNode;
      }
      tmpNode = tmpNode.next;
    }
  }
}

const list = new ListNode();

list.insert(2);
list.insert(4);
list.insert(1);
list.insert(3);

// list.map();

// list.reserve().map();

// console.log(list);

class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

class BinSearchTree {
  constructor() {
    this.root = null;
  }

  insertByNode(node, byNode) {
    if (!byNode.val) {
      console.log(node, byNode);
    }
    if (node.val >= byNode.val) {
      if (!byNode.right) {
        byNode.right = node;
      } else {
        this.insertByNode(node, byNode.right);
      }
    } else {
      if (!byNode.left) {
        byNode.left = node;
      } else {
        this.insertByNode(node, byNode.left);
      }
    }
  }

  insert(val) {
    const node = new TreeNode(val);
    if (!this.root) {
      this.root = node;
    } else {
      this.insertByNode(node, this.root);
    }
  }

  findByNode(val, node) {
    if (!node) {
      return -1;
    }

    if (val === node.val) {
      return node;
    } else {
      if (val >= node.val) {
        return this.findByNode(val, node.right);
      } else {
        return this.findByNode(val, node.left);
      }
    }
  }

  find(val) {
    return this.findByNode(val, this.root);
  }

  depth() {}

  dfsTree() {
    let maxDepth = 0;

    const dfs = (node, depth) => {
      if (!node) return;
      console.log("dfs depth", depth, node.val);
      maxDepth = Math.max(maxDepth, depth);
      node.left && dfs(node.left, depth++);
      node.right && dfs(node.right, depth++);
    };

    dfs(this.root, 0);

    console.log(maxDepth);
  }

  bfsTree() {
    const bfs = (node) => {
      if (!node) return -1;
      const queue = [];
      queue.push(node)

      while (queue.length) {
        const item = queue.shift()
        console.log('bfs', item.val)
        item.left && queue.push(item.left)
        item.right && queue.push(item.right)
      }
    };

    bfs(this.root, 0);
  }

  inOrder() {
    const order = (node) => {
      if (!node) return;
      console.log("inOrder", node.val);
      node.left && order(node.left);
      node.right && order(node.right);
    };

    order(this.root);
  }

  preOrder() {
    const order = (node) => {
      if (!node) return;
      node.left && order(node.left);
      console.log("preOrder", node.val);
      node.right && order(node.right);
    };

    order(this.root);
  }

  postOrder() {
    const order = (node) => {
      if (!node) return;
      node.left && order(node.left);
      node.right && order(node.right);
      console.log("postOrder", node.val);
    };

    order(this.root);
  }

  min() {
    let min = this.root.val
    const getMin = (node) => {
      console.log('getMin', node.val)
      if (node.val < min) {
        min = node.val
      } else {
        node.left && getMin(node.left)
      }
    }

    getMin(this.root)

    return min
  }

  max() {
    let max = this.root.val
    const getMax = (node) => {
      if(!node) return -1
      if (node.val > max) {
        max = Math.max(max, node.val)
        return node
      } else {
        node.right && getMax(node.right)
      }
    }

    getMax(this.root)

    console.log('max', max)
    return max
  }

  remove(val) {
    if (!val) return -1
    const findNodeChild = (val, node, parent, key) => {
      if (!node) return -1
      if (val > node.val) {
        findNodeChild(val, node.right, node, 'right')
      } else if (val < node.val) {
        findNodeChild(val, node.left, node, 'left')
      } else {
        if (parent && key) {
          if (node.right) {
            const left = parent[key].left
            parent[key] = node.right
            left && this.insertByNode(left, parent[key])
          } else {
            parent[key] = node.left
          }
        }
      }
    }

    if (val === this.root.val) {
      if(this.root.right) {
        const left = this.root.left
        this.root = this.root.right
        left && this.insertByNode(left, this.root)
      } else {
        this.root = this.root.left
      }
    }

    findNodeChild(val, this.root)
    console.log(this.root)
  }
}

const tree = new BinSearchTree();

// tree.insert(3);
// tree.insert(1);
// tree.insert(2);
// tree.insert(4);

// console.log(tree);
// console.log("find", tree.find(1), tree.find(10));

// tree.inOrder();
// tree.preOrder();
// tree.postOrder();

// tree.dfsTree();

// tree.bfsTree()

// tree.remove(4)

// tree.min()

// tree.max()

class MinHeap {
  constructor(maxSize) {
    this.heap = []
    this.maxSize = maxSize
  }

  getParentIndex(index) {
    return Math.floor(index / 2)
  }

  getLeftChildrenIndex(index) {
    return index * 2 + 1
  }

  getRightChildrenIndex(index) {
    return index * 2 + 2
  }

  size() {
    return this.heap.length
  }

  getMin() {
    return this.heap[0]
  }

  swap(i1, i2) {
    const tmp = this.heap[i1]
    this.heap[i1] = this.heap[i2]
    this.heap[i2] = tmp
  }

  shiftUp(index) {
    if (index === 0) return
    const parentIndex = this.getParentIndex(index)
    if (this.heap[index] < this.heap[parentIndex]) {
      this.swap(index, parentIndex)
      this.shiftUp(parentIndex)
    }
  }

  shiftDown(index) {
    const leftChildIndex = this.getLeftChildrenIndex(index)
    const rightChildIndex = this.getRightChildrenIndex(index)

    if (this.heap[index] > this.heap[leftChildIndex]) {
      this.swap(index, leftChildIndex)
      this.shiftDown(leftChildIndex)
    }

    if (this.heap[index] > this.heap[rightChildIndex]) {
      this.swap(index, rightChildIndex)
      this.shiftDown(rightChildIndex)
    }
  }

  insert(val) {
    this.heap.push(val)

    if (this.heap.length === 1) return
    this.shiftUp(this.heap.length - 1)
  }

  pop() {
    if (!this.heap.length) return
    const result = this.heap.pop()
    this.heap[0] = result
    this.shiftDown(0)
    return result
  }
}

const heap = new MinHeap()

// heap.insert(3)
// heap.insert(4)
// heap.insert(6)
// heap.insert(8)
// heap.insert(2)
// heap.insert(1)

// heap.pop()
// heap.pop()
// heap.pop()
// heap.pop()

// console.log(heap)


var name = 'name'

function conName() {
  var name = '333'
  console.log(name, this)
}

function getName() {
  var name = 'hx'

  console.log(name, this)
  return conName()
}

var data = {
  name: 'qxx',
  getName,
}

getName()

// getName.call(data)

const pr = (ms) => {
  return new Promise(res => {
    // setTimeout(() => {
      console.log('dddddd', ms)
        res(ms)
    // }, ms);
  })
}

// start => d 100 => 1111 => d 300 => res1  => d200 => 222 => dd 1000 =>  res p 1000 => res2 4 => res3
const getdata = async () => {
  console.log('start')
  const p1 = await pr(200)
  console.log('11111111')
  const p2 = await pr(300)
  console.log('222222222')
}

pr(100).then((res) => {
  console.log('res1',res)
  // console.log(a)
  return pr(400).then((res) => {
    console.log('res p', res)
    return 3
  }).then(res => {
    // console.log('res p 2', a)
    return 4
  })
}, err => {
  console.log(err)
}).then(res => {
  console.log('res2', res)
}, err => {
  console.log('err 2', err)
}).catch(err => {
  console.log('err catch', err)
  return 3
}).then(res => {
  console.log('res3')
})

getdata()
