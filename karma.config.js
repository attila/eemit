var path = require('path');
var fs = require('fs');

module.exports = function(config) {
  if (!process.env.SAUCE_USERNAME) {
    if (!fs.existsSync('sauce.json')) {
      throw new Error('Missing Sauce credentials. Either provide SAUCE_USERNAME' +
        ' and SAUCE_ACCESS_KEY via environment variables or create a sauce.json' +
        ' with your credentials.');
    } else {
      var sauce = require('./sauce');
      process.env.SAUCE_USERNAME = sauce.username;
      process.env.SAUCE_ACCESS_KEY = sauce.accessKey;
    }
  }

  var sauceLaunchers = {
    SL_Chrome_latest: {
      base: 'SauceLabs',
      browserName: 'chrome',
      version: 'latest'
    },
    SL_Chrome_41: {
      base: 'SauceLabs',
      browserName: 'chrome',
      version: '41',
    },
    SL_FireFox_latest: {
      base: 'SauceLabs',
      browserName: 'firefox',
      version: 'latest',
    },
    SL_Edge: {
      base: 'SauceLabs',
      platform: 'Windows 10',
      browserName: 'microsoftedge',
    },
    SL_IE_11: {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      version: '11',
    },
    SL_IE_10: {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      version: '10',
    },
    SL_IE_9: {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      version: '9',
    },
    SL_Opera_latest: {
      base: 'SauceLabs',
      browserName: 'opera',
      version: 'latest',
    },
    SL_Safari_7: {
      base: 'SauceLabs',
      browserName: 'safari',
      version: '7',
      platform: 'OS X 10.9',
    },
    SL_Mobile_Safari_8: {
      base: 'SauceLabs',
      browserName: 'iphone',
      platform: "OS X 10.10",
      deviceName: 'iPhone 5s',
      version: '8.4',
    },
    SL_Android_4: {
      base: 'SauceLabs',
      browserName: 'android',
      deviceName: 'Android Emulator',
      deviceType: 'phone',
      platform: 'Linux',
      version: '4.4',
    },
  };

  config.set({
    files: ['test/spec.js'],
    frameworks: ['mocha'],
    browsers: Object.keys(sauceLaunchers),
    browserNoActivityTimeout: 180000,
    customLaunchers: sauceLaunchers,
    preprocessors: {
      'test/spec.js': ['webpack'],
    },
    reporters: ['dots', 'saucelabs', 'coverage'],
    port: 9876,
    coverageReporter: {
      reporters: [
        { type: 'html', subdir: 'html' },
        { type: 'lcovonly', subdir: '.' },
      ],
    },
    colors: true,
    concurrency: 5,
    webpack: {
      cache: true,
      devtool: 'inline-source-map',
      module: {
        preLoaders: [
          {
            test: /spec\.js$/,
            include: /test/,
            exclude: /node_modules/,
            loader: 'babel',
            query: {
              cacheDirectory: true,
            },
          },
          {
            test: /\.js?$/,
            include: /src/,
            exclude: /(node_modules|test)/,
            loader: 'babel-istanbul',
            query: {
              cacheDirectory: true,
            },
          },
        ],
        loaders: [
          {
            test: /\.js$/,
            include: path.resolve(__dirname, '../src'),
            exclude: /(node_modules|test)/,
            loader: 'babel',
            query: {
              cacheDirectory: true,
            },
          },
        ],
      },
    },
    webpackMiddleware: {
      noInfo: true,
    },
  });
};
