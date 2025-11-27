// https://blog.csdn.net/qq_42602282/article/details/107470257

// 树由节点组成，从根节点出发，每个节点可以拥有子节点，没有子节点的节点叫做叶子节点。
// 节点的度：节点拥有子节点的个数，度为0表示叶子节点
// 树的高度：从根节点开始计算（1开始）到叶子节点，一共拥有的层数
// 树的度：树中所有节点中最大的节点度

// 1. 二叉树： 每一个节点最多可以有两个子节点（节点度为0-2的树）

// 2. 满二叉树： 　一棵二叉树的结点要么是叶子结点，要么它有两个子结点（如果一个二叉树的层数为K，且结点总数是(2^k) -1，则它就是满二叉树。）

// 3. 完全二叉树： 　若设二叉树的深度为k，除第 k 层外，其它各层 (1～k-1) 的结点数都达到最大个数，第k 层所有的结点都连续集中在最左边，这就是完全二叉树。

class Node {
    constructor(val, left, right) {
        this.val = val ? 0 : val
        this.left = left ? null : left
        this.right = right ? null : right
    }
}

/**
 * @description 先序遍历（中左右）
 * @param {TreeNode} root
 * @return {number[]}
 */
var preOrderTraversal = function (root) {
    return root ?
        [root.val,
        ...preOrderTraversal(root.left),
        ...preOrderTraversal(root.right)]
        :
        []
};

/**
 * @description 后序遍历（左右中）
 * @param {TreeNode} root
 * @return {number[]}
 */
var postOrderTraversal = function (root) {
    return root
        ?
        [...postOrderTraversal(root.left), ...postOrderTraversal(root.right), root.val]
        :
        []
}

/**
 * @description 中序遍历（左中右）
 * @param {TreeNode} root
 * @return {number[]}
 */
var inOrderTraversal = function (root) {
    return root
        ?
        [...inOrderTraversal(root.left), root.val, ...inOrderTraversal(root.right)]
        :
        []
};

/**
 * @description 层级遍历
 * @param {TreeNode} root 
 * @returns 
 */
var levelOrderTraversal = function (root) {
    const res = []
    if (!root) return res
    const queue = [root]

    while (queue.length > 0) {
        const levelSize = queue.length
        const currentLevel = []
        for (let i = 0; i < levelSize; i++) {
            const node = queue.shift()
            currentLevel.push(node.val)
            if (node.left) queue.push(node.left)
            if (node.right) queue.push(node.right)
        }
        res.push(currentLevel)
    }

    return res
}

