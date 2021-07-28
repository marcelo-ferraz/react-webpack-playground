const { writeFileSync } = require('fs');
const pkg = require('./package.json');
const { exec } = require('child_process');

exec('GitVersion', (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }

    const current = JSON.parse(stdout);

    writeFileSync('package.json', JSON.stringify({ ...pkg, version: current.SemVer }, null, 4));
});
