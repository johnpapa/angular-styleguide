const path = require("path");
const pluginsConfig = require("./webpack.plguins.js");
const rulesConfig = require("./webpack.rules.js");

module.exports = {
	entry: {
		// 多入口文件
		a: "./src/js/index.ts",
		b: "./src/js/index2.ts",
		jquery: "jquery",
	},
	output: {
		path: path.resolve(__dirname, "dist"),
		// 打包多出口文件
		// 生成 a.bundle.js  b.bundle.js  jquery.bundle.js
		filename: "./js/[name].bundle.js"
	},
	plugins: pluginsConfig,
	devServer: {
		contentBase: path.resolve(__dirname, "dist"),
		host: "localhost",
		port: "8090",
		open: true, // 开启浏览器
		hot: false, // 开启热更新
		inline: true,
	},
	devtool: "inline-source-map", // 开启调试模式
	module: {
		rules: rulesConfig,
	},
	resolve: {
		extensions: [".tsx", ".ts", ".js", ".json"],
	},
	performance: {
		hints: false
	  },
	// 提取js，lib1名字可改
	optimization: {
		splitChunks: {
			cacheGroups: {
				lib1: {
					chunks: "initial",
					name: "jquery",
					enforce: true,
				},
			},
		},
	},

};