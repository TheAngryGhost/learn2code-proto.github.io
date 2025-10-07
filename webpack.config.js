import path from "path";
import { fileURLToPath } from "url";
import HtmlWebpackPlugin from "html-webpack-plugin";
import CopyWebpackPlugin from 'copy-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  entry: "./index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  mode: "development",
    module: {
    rules: [
      {
        test: /\.css$/i,             // target .css files
        use: ["style-loader", "css-loader"], // load CSS and inject into JS
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html", // take your existing HTML file
      filename: "index.html",   // output it into dist/
    }),
    new CopyWebpackPlugin({
    patterns: [
      { from: 'images', to: 'images' } // copies all images to dist/images
    ],
  }),
  ],
  devServer: {
    static: {
      directory: path.resolve(__dirname, "dist"),
    },
    port: 8080,
    open: true,
    hot: true,
  },
};
