const lodash = require('lodash');
const path = require('path');
const fs = require('fs');

module.exports = class EndWebpackPlugin {
    constructor(config, files) {
        this.outputPath = lodash.get(config, 'output.path');
        this.files = lodash.merge([], files);
        this.argvs = {};
        process.argv.map(val => {
            // 设置其他环境变量
            if (lodash.startsWith(val, '--') && lodash.includes(val, '=')) {
                /--(\w*)=(\w*)/.test(val);
                lodash.set(this.argvs, RegExp.$1, RegExp.$2);
            }
        });

    }
    apply(compiler) {
        if (process.env.NODE_ENV === "development") {
            return
        }
        compiler.hooks.done.tapAsync(
            'MyExampleWebpackPlugin',
            (compilation, callback) => {
                lodash.map(this.files, file => {
                    const filePath = path.resolve(this.outputPath, file);
                    const fileStr = fs.readFileSync(filePath).toString();
                    const newFileStr = lodash.template(fileStr, { interpolate: /%([\s\S]+?)%/g })(this.argvs);
                    fs.writeFileSync(filePath, newFileStr);
                });
                callback();
            }
        );
        // compiler.plugin('done', (stats,callback) => {
        //     lodash.map(this.files, file => {
        //         const filePath = path.resolve(this.outputPath, file);
        //         const fileStr = fs.readFileSync(filePath).toString();
        //         const newFileStr = lodash.template(fileStr, { interpolate: /%([\s\S]+?)%/g })(this.argvs);
        //         fs.writeFileSync(filePath, newFileStr);
        //     })
        //     callback()
        //     return true
        // });
    }
}