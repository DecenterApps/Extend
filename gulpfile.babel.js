import gulp from 'gulp';
import loadPlugins from 'gulp-load-plugins';
import webpack from 'webpack';
import rimraf from 'rimraf';

import popupWebpackConfig from './app/popup/webpack.config';
import eventWebpackConfig from './app/background/webpack.config';
import contentWebpackConfig from './app/page/webpack.config';

const plugins = loadPlugins();

gulp.task('popup-js', (cb) => {
  webpack(popupWebpackConfig, (err, stats) => {
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

gulp.task('content-js', (cb) => {
  webpack(contentWebpackConfig, (err, stats) => {
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
  'clean', 'copy-icons', 'copy-manifest', 'copy-jquery', 'copy-web3', 'popup-js', 'event-js', 'content-js'
]);

gulp.task('watch', ['default'], () => {
  gulp.watch('popup/**/*', ['build']);
  gulp.watch('content/**/*', ['build']);
  gulp.watch('event/**/*', ['build']);
});

gulp.task('default', ['build']);
