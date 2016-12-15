import Muilessium from './muilessium';


document.addEventListener('DOMContentLoaded', () => {
    if (window.Muilessium) {
        console.error('Muilessium already initialized');
    }

    window.Muilessium = new Muilessium;

    window.Muilessium.components = {
        inputs:       window.Muilessium.create('input',             '.mui-input',             {}),
        inputRange:   window.Muilessium.create('input-range',       '.mui-input-range',       {}),
        textareas:    window.Muilessium.create('textarea',          '.mui-textarea',          {}),
        likes:        window.Muilessium.create('like',              '.mui-like',              {}),
        buttons:      window.Muilessium.create('button',            '.mui-button',            {}),
        buttonsd:     window.Muilessium.create('button-dropdown',   '.mui-button-dropdown',   {}),
        carousels:    window.Muilessium.create('carousel',          '.mui-carousel',          {}),
        piecharts:    window.Muilessium.create('pie-chart',         '.mui-pie-chart',         {}),
        barcharts:    window.Muilessium.create('bar-chart',         '.mui-bar-chart',         {}),
        linecharts:   window.Muilessium.create('line-chart',        '.mui-line-chart',        {}),
        dropdowns:    window.Muilessium.create('select-dropdown',   '.mui-select-dropdown',   {}),
        accordions:   window.Muilessium.create('accordion',         '.mui-accordion',         {}),
        checkboxes:   window.Muilessium.create('checkbox',          '.mui-checkbox',          {}),
        tabs:         window.Muilessium.create('tabs',              '.mui-tabs',              {}),
        navigations:  window.Muilessium.create('header-navigation', '.mui-header-navigation', {}),
        progressbars: window.Muilessium.create('progress-bar',      '.mui-progress-bar',      {}),
        ratings:      window.Muilessium.create('rating',            '.mui-rating',            {})
    };
});
