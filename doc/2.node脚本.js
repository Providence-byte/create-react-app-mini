// node -e "console.log(process.argv)" -- a b c
// [ 'D:\\Node.js\\node_version\\node.exe', 'a', 'b', 'c' ]

// 奇怪的命令行
//node -e "console.log(process.argv[1])" -- "["root","aaa"]" ❌
// 输出 [,第一对双引号包裹的算一个参数
//node -e "console.log(process.argv[1])" -- "["""root""","""aaa"""]" 🤔
// 输出 [ root,aaa] ,多了个空格？？？
//node -e "console.log(process.argv[1])" -- "[""root"",""aaa""]" ✔
// 输出 [root,aaa]
//node -e "console.log(JSON.parse(JSON.stringify(process.argv[1])))" -- "[""root"",""aaa""]"



// -e --eval "script" 执行