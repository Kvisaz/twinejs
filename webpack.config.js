const mainConfig = require('./webpack.config.electron.js')
const preloadConfig = require('./webpack.config.preload.js')
const webConfig = require('./webpack.config.web.js')

const useElectron = process.env.USE_ELECTRON === 'y';

module.exports = useElectron
    ? [mainConfig, preloadConfig, webConfig]
    : [webConfig]
