const webpack = require('webpack');
const path = require('path');

const config = {
	entry: './src/index.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js',
		// hash, ext, query, fragment, base, name, path
		assetModuleFilename: 'img/[name][ext]'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				use: 'babel-loader',
				exclude: /node_modules/
			},
			{
				test: /\.(png|jpg|ttf|webp|jpeg|gif|jfif)$/,
				type: 'asset/resource'
			},
			{
				test: /\.hbs$/,
				use: [{
					loader: 'handlebars-loader',
					options: {
						helperDirs: path.resolve(__dirname, 'helpers')
					}
				}]
			},
			{
				test: /\.css$/,
				use: [
					'style-loader',
					'css-loader'
				]
			}
		]
	}
};

module.exports = config;