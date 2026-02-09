const electron = require('electron');
console.log('Electron object:', typeof electron === 'string' ? 'is string: ' + electron : Object.keys(electron));
if (electron.app) {
    console.log('App found!');
    process.exit(0);
} else {
    console.log('App NOT found!');
    process.exit(1);
}
