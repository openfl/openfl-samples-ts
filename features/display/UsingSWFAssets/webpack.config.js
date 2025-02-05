const path = require ("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
	entry: "./src/app.ts",
	output: {
		path: path.resolve (__dirname, "dist"),
		filename: "app.js"
	},
	devtool: "source-map",
	resolve: {
		alias: {
			"openfl": path.resolve (__dirname, "node_modules/openfl/lib/openfl")
		},
		extensions: ['.tsx', '.ts', '.js']
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: 'ts-loader'
			},
			{
				test: /\.swf$/,
				loader: 'swf-loader'
			}
		]
	},
	plugins: [
		new CopyWebpackPlugin({
			patterns: [
				"public"
			]
		})
	],
	performance: {
		hints: false
	}
};