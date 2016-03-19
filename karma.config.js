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
      browserName: 'Chrome',
      version: 'latest'
    },
    SL_Chrome_41: {
      base: 'SauceLabs',
      browserName: 'Chrome',
      version: '41',
    },
    SL_FireFox_latest: {
      base: 'SauceLabs',
      browserName: 'Firefox',
      version: 'latest',
    },
    SL_Edge: {
      base: 'SauceLabs',
      platform: 'Windows 10',
      browserName: 'microsoftedge',
      version: 'latest',
    },
    SL_IE_11: {
      base: 'SauceLabs',
      browserName: 'Internet Explorer',
      version: '11',
    },
    SL_IE_10: {
      base: 'SauceLabs',
      browserName: 'Internet Explorer',
      version: '10',
    },
    SL_IE_9: {
      base: 'SauceLabs',
      browserName: 'Internet Explorer',
      version: '9',
    },
    SL_Opera_latest: {
      base: 'SauceLabs',
      browserName: 'Opera',
      version: 'latest',
    },
    SL_Safari_latest: {
      base: 'SauceLabs',
      browserName: 'Safari',
      version: 'latest',
      platform: 'OS X 10.11',
    },
    SL_iOS_latest: {
      base: 'SauceLabs',
      browserName: 'iphone',
      version: '9',
    },
    Android_latest: {
      base: 'SauceLabs',
      browserName: 'android',
    },
    'SL_Android_4.4': {
      base: 'SauceLabs',
      browserName: 'android',
      'appium-version': '1.0',
      deviceName: 'Android',
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
