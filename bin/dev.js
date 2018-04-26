require("babel-register");

// 设置开发变量
Object.assign(process.env, {
	"NODE_ENV": "develop"
})

require("../index")
