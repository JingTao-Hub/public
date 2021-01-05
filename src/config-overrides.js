/**
 * config-overrides.js
 * 重写 react-scripts 默认配置
 */
const moment = require('moment');
const lodash = require('lodash');
const path = require('path');
const fs = require('fs');
const releasePlugin = require('./releasePlugin');
// const { override, fixBabelImports, addLessLoader, disableEsLint } = require('customize-cra');
process.argv.map(val => {
  if (lodash.endsWith(val, 'scripts/build.js') && lodash.isNil(process.env.GENERATE_SOURCEMAP)) {
    process.env.GENERATE_SOURCEMAP = 'false';
  }
});
process.env.REACT_APP_TIME = moment().format('YYYY-MM-DD HH:mm:ss') + ' @荆（5025734@163.com）';
module.exports = ({ override, fixBabelImports, addLessLoader, addBundleVisualizer, disableEsLint, addWebpackModuleRule, babelInclude, addWebpackPlugin}, injectionFiles) => {
  // const appDirectory = fs.realpathSync(process.cwd());
  // const resolveApp = relativePath => {
  //   return path.resolve(path.dirname(appDirectory), relativePath, 'src')
  // };
  // // process.stdout.isTTY = false;
  // const packages = ['public'].map(resolveApp);
  return (config, env) => {
    config = override(
      babelInclude([path.resolve(process.cwd(), 'src'), __dirname]),
      // addWebpackModuleRule(
      //   {
      //     test: /\.(tsx|ts)$/,
      //     include: __dirname,
      //     // exclude: [
      //     //   "components/dataView/content/table.tsx",
      //     //   "components/dataView/header/search.tsx",
      //     //   "components/dataView/other/infoShell/index.tsx",
      //     //   "components/dataView/other/dialog/index.tsx",
      //     //   "components/form/formItem/index.tsx",
      //     // ].map(x => path.resolve(__dirname, x)),
      //     use: [
      //       {
      //         loader: 'awesome-typescript-loader',
      //         options: {
      //           useCache: true,
      //           configFileName: path.resolve(path.dirname(__dirname), 'tsconfig.json'),
      //           cacheDirectory: "node_modules/.cache/awcache",
      //           // transpileOnly: true,
      //           errorsAsWarnings: true,
      //           // reportFiles: [
      //           //   `${value.include}/**/*.{ts,tsx}`,
      //           //   ...packages.map(data => `${data}/**/*.{ts,tsx}`)
      //           // ]
      //           // usePrecompiledFiles: true,
      //         }
      //       }
      //     ]
      //   }
      // ),
      
      fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
      }),
      addLessLoader({
        javascriptEnabled: true,
        //    modifyVars: { '@primary-color': '#1DA57A' },
        localIdentName: "editor-[local]-[hash:base64:5]"
      }),
      // --analyze
      addBundleVisualizer({
        "analyzerMode": "static",
        "reportFilename": "report.html"
      }, true),
      addWebpackPlugin(new releasePlugin(config, injectionFiles)),
      disableEsLint(),
    )(config, env);
    //模块解析 位置
    lodash.update(config, 'resolve.modules', mol => {
      mol.unshift(path.resolve(path.dirname(path.dirname(path.dirname(__dirname))), 'node_modules'))
      return mol;
    })
    // 清空 console
    lodash.set(config, 'optimization.minimizer[0].options.terserOptions.compress.drop_console', env !== "development");
    return config
  }
}
