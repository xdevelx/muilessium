module.exports = {
    favicons: {
        src: 'src/docs_template/images/muilessium.png',
        dest: 'docs/icons/',
        options: {
            iconsPath: 'icons/',
            html: ['docs/*.html'],
            design: {
                ios: {
                    pictureAspect: 'backgroundAndMargin',
                    backgroundColor: '#ffffff',
                    margin: '11%',
                    assets: {
                        ios6AndPriorIcons: false,
                        ios7AndLaterIcons: false,
                        precomposedIcons: false,
                        declareOnlyDefaultIcon: true
                    },
                    appName: 'Muilessium'
                },
                desktopBrowser: {},
                windows: {
                    pictureAspect: 'noChange',
                    backgroundColor: '#383838',
                    onConflict: 'override',
                    assets: {
                        windows80Ie10Tile: false,
                        windows10Ie11EdgeTiles: {
                        small: true,
                        medium: false,
                        big: false,
                        rectangle: false
                        }
                    },
                    appName: 'Muilessium'
                },
                androidChrome: {
                    pictureAspect: 'shadow',
                    themeColor: '#ffffff',
                    manifest: {
                        name: 'Muilessium',
                        display: 'standalone',
                        orientation: 'notSet',
                        onConflict: 'override',
                        declared: true
                    },
                    assets: {
                        legacyIcon: false,
                        lowResolutionIcons: false
                    }
                },
                safariPinnedTab: {
                    pictureAspect: 'blackAndWhite',
                    threshold: 90,
                    themeColor: '#383838'
                }
            },
            settings: {
                compression: 1,
                scalingAlgorithm: 'Lanczos',
                errorOnImageTooSmall: false
            }
        }
    }
};

