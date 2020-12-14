// const fs = require('fs');
const childProcess = require('child_process');
const fsExtra = require('fs-extra');

// 清除整个lib文件夹
let error = fsExtra.emptyDirSync('lib');
if (error) {
    console.log('remove folder: lib failed!');
    return;
}

// 如果不存在，就创建lib文件夹
error = fsExtra.ensureDirSync('lib');
if (error) {
    console.log('mkdir folder: lib failed!');
    return;
}

console.log('build typescript to lib!');
childProcess.exec('tsc --outDir lib');

console.log('copy theme file to lib!');
// 拷贝theme文件到lib
error = fsExtra.copySync('src/theme', 'lib/theme');
if (error) {
    console.log('copy theme file failed!');
}
