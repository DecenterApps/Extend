import gulp from 'gulp';
import loadPlugins from 'gulp-load-plugins';
import webpack from 'webpack';
import rimraf from 'rimraf';
import rename from 'gulp-rename';

import popupWebpackConfig from './app/popup/webpack.config';
import eventWebpackConfig from './app/background/webpack.config';
import contentWebpackConfig from './app/page/webpack.config';
import dialogWebpackConfig from './app/dialog/webpack.config';

import popupWebpackProdConfig from './app/popup/webpack.prod.config';
import eventWebpackProdConfig from './app/background/webpack.prod.config';
import contentWebpackProdConfig from './app/page/webpack.prod.config';
import dialogWebpackProdConfig from './app/dialog/webpack.prod.config';

const plugins = loadPlugins();
gulp.task('init-dev', () => {
  gulp.src('./app/constants/config.dev.js')
    .pipe(rename('config.local.js'))
    .pipe(gulp.dest('./app/constants/'))
    .pipe(rename('config.js'))
    .pipe(gulp.dest('./app/constants/'));
});

gulp.task('init-prod', () => {
  gulp.src('./app/constants/config.prod.js')
    .pipe(rename('config.js'))
    .pipe(gulp.dest('./app/constants/'));
});

gulp.task('copy-config-prod', () => {
  gulp.src('./app/constants/config.prod.js')
    .pipe(rename('config.js'))
    .pipe(gulp.dest('./app/constants/'));
});

gulp.task('copy-config', () => {
  gulp.src('./app/constants/config.local.js')
    .pipe(rename('config.js'))
    .pipe(gulp.dest('./app/constants/'));
});

gulp.task('popup-js', (cb) => {
  webpack(popupWebpackConfig, (err, stats) => {
    if(err) throw new plugins.util.PluginError('webpack', err);

    plugins.util.log('[webpack]', stats.toString());

    cb();
  });
});

gulp.task('popup-prod-js', (cb) => {
  webpack(popupWebpackProdConfig, (err, stats) => {
    if(err) throw new plugins.util.PluginError('webpack', err);

    plugins.util.log('[webpack]', stats.toString());

    cb();
  });
});

gulp.task('event-js', (cb) => {
  webpack(eventWebpackConfig, (err, stats) => {
    if(err) throw new plugins.util.PluginError('webpack', err);

    plugins.util.log('[webpack]', stats.toString());

    cb();
  });
});

gulp.task('event-prod-js', (cb) => {
  webpack(eventWebpackProdConfig, (err, stats) => {
    if(err) throw new plugins.util.PluginError('webpack', err);

    plugins.util.log('[webpack]', stats.toString());

    cb();
  });
});

gulp.task('content-js', (cb) => {
  webpack(contentWebpackConfig, (err, stats) => {
    if(err) throw new plugins.util.PluginError('webpack', err);

    plugins.util.log('[webpack]', stats.toString());

    cb();
  });
});

gulp.task('content-prod-js', (cb) => {
  webpack(contentWebpackProdConfig, (err, stats) => {
    if(err) throw new plugins.util.PluginError('webpack', err);

    plugins.util.log('[webpack]', stats.toString());

    cb();
  });
});

gulp.task('dialog-js', (cb) => {
  webpack(dialogWebpackConfig, (err, stats) => {
    if(err) throw new plugins.util.PluginError('webpack', err);

    plugins.util.log('[webpack]', stats.toString());

    cb();
  });
});

gulp.task('dialog-prod-js', (cb) => {
  webpack(dialogWebpackProdConfig, (err, stats) => {
    if(err) throw new plugins.util.PluginError('webpack', err);

    plugins.util.log('[webpack]', stats.toString());

    cb();
  });
});

gulp.task('copy-manifest', () => (
  gulp.src('manifest.json').pipe(gulp.dest('./build'))
));

gulp.task('copy-jquery', () => (
  gulp.src('./app/modules/jquery-slim.js').pipe(gulp.dest('./build'))
));

gulp.task('copy-web3', () => (
  gulp.src('./app/modules/web3.js').pipe(gulp.dest('./build'))
));

gulp.task('copy-icons', () => (
  gulp.src('./app/commonComponents/icons/*').pipe(gulp.dest('./build'))
));

gulp.task('clean', (cb) => {
  rimraf('./build', cb);
});

gulp.task('build', [
  'clean', 'copy-config', 'copy-icons', 'copy-manifest', 'copy-jquery', 'copy-web3',
  'popup-js', 'event-js', 'content-js', 'dialog-js'
]);

gulp.task('watch', ['build'], () => {
  gulp.watch([
    './app/popup/**/*',
    './app/commonComponents/**/*',
    './app/customRedux/**/*',
  ], ['popup-js']);
  gulp.watch([
    './app/background/**/*',
    './app/actions/**/*',
    './app/messages/**/*',
    './app/handlers/**/*',
    './app/modules/**/*',
    './app/constants/**/*',
  ], ['event-js']);
  gulp.watch('./app/actions/**/*', ['event-js']);
  gulp.watch('./app/m/**/*', ['event-js']);
  gulp.watch('./app/page/**/*', ['content-js']);
  gulp.watch('./app/dialog/**/*', ['dialog-js']);
});

gulp.task('default', ['build']);

gulp.task('prod', [
  'clean', 'copy-config-prod', 'copy-icons', 'copy-manifest', 'copy-jquery', 'copy-web3',
  'popup-prod-js', 'event-prod-js', 'content-prod-js', 'dialog-prod-js'
]);

