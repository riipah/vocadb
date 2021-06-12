const mix = require('laravel-mix');
const path = require('path');

require('laravel-mix-eslint');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix
	.setPublicPath('./wwwroot/')
	.webpackConfig({
		output: {
			library: 'app',
		},
	})
	.options({
		processCssUrls: false,
	})
	.alias({
		'@Bootstrap': path.join(__dirname, 'Scripts/Bootstrap'),
		'@Components': path.join(__dirname, 'Scripts/Components'),
		'@DataContracts': path.join(__dirname, 'Scripts/DataContracts'),
		'@Helpers': path.join(__dirname, 'Scripts/Helpers'),
		'@JQueryUI': path.join(__dirname, 'Scripts/JQueryUI'),
		'@KnockoutExtensions': path.join(__dirname, 'Scripts/KnockoutExtensions'),
		'@Models': path.join(__dirname, 'Scripts/Models'),
		'@Repositories': path.join(__dirname, 'Scripts/Repositories'),
		'@Shared': path.join(__dirname, 'Scripts/Shared'),
		'@ViewModels': path.join(__dirname, 'Scripts/ViewModels'),
	})
	.eslint({
		fix: false,
		extensions: ['ts', 'tsx'],
	})
	.babelConfig({
		plugins: ['@babel/plugin-syntax-dynamic-import'],
	})

	.extract(['highcharts'], 'highcharts')
	.extract()

	.js('Scripts/libs.js', 'wwwroot/bundles/shared')

	// SHARED BUNDLES
	// Legacy common scripts - should be phased out
	.scripts(['Scripts/VocaDb.js'], 'wwwroot/bundles/VocaDB.js')

	.ts('Scripts/vdb.ts', 'wwwroot/bundles')

	// Included on all entry edit and create pages (album, artist, my settings etc.)
	.scripts(
		['wwwroot/Scripts/knockout-sortable.js'],
		'wwwroot/bundles/shared/edit.js',
	)

	.scripts(
		[
			'wwwroot/Scripts/jqwidgets27/jqxcore.js',
			'wwwroot/Scripts/jqwidgets27/jqxrating.js',
		],
		'wwwroot/bundles/jqxRating.js',
	)

	// Base CSS
	.less('wwwroot/Content/css.less', 'wwwroot/Content')

	.less('wwwroot/Content/embedSong.less', 'wwwroot/Content')
	.less('wwwroot/Content/Styles/DarkAngel.less', 'wwwroot/Content/Styles')
	.less('wwwroot/Content/Styles/discussions.less', 'wwwroot/Content/Styles')
	.less('wwwroot/Content/Styles/songlist.less', 'wwwroot/Content/Styles')

	// CSS for jqxRating
	.styles(
		['wwwroot/Scripts/jqwidgets27/styles/jqx.base.css'],
		'wwwroot/Scripts/jqwidgets27/styles/css.css',
	)

	.ts('Scripts/index.tsx', 'wwwroot/bundles')
	.react();

if (mix.inProduction()) {
	mix.version();
}
