const extractTextPlugin = require("extract-text-webpack-plugin");
module.exports = [
			{
				test: /\.css$/,
				// 不分离的写法
				// use: ["style-loader", "css-loader"]
				// 使用postcss不分离的写法
				// use: ["style-loader", "css-loader", "postcss-loader"]
				// 此处为分离css的写法
				/*use: extractTextPlugin.extract({
					fallback: "style-loader",
					use: "css-loader",
					// css中的基础路径
					publicPath: "../"

				})*/
				// 此处为使用postcss分离css的写法
				use: extractTextPlugin.extract({
					fallback: "style-loader",
					use: ["css-loader", "postcss-loader"],
					// css中的基础路径
					publicPath: "../"

				})
			},
			{
				test: /\.js$/,
				use: ["babel-loader"],
				// 不检查node_modules下的js文件
				exclude: "/node_modules/"
			},
			{
				test: /\.(png|jpg|gif)$/,
				use: [{
						// 需要下载file-loader和url-loader
						loader: "url-loader",
						options: {
							limit: 50,
							// 图片文件输出的文件夹
							outputPath: "images"
						}
					}
				]
			},
			{
				test: /\.html$/,
				// html中的img标签
				use: ["html-withimg-loader"]
			},
			{
				test: /\.less$/,
				// 三个loader的顺序不能变
				// 不分离的写法
				// use: ["style-loader", "css-loader", "less-loader"]
				// 分离的写法
				use: extractTextPlugin.extract({
					fallback:"style-loader",
					use: ["css-loader", "less-loader"]
				})
			},
			{
				test: /\.(scss|sass)$/,
				// sass不分离的写法，顺序不能变
				// use: ["style-loader", "css-loader", "sass-loader"]
				// 分离的写法
				use: extractTextPlugin.extract({
					fallback:"style-loader",
					use: ["css-loader", "sass-loader"]
				})
			}
		]