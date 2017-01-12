import Muilessium from './muilessium';
import * as Utils from './utils';

import * as smoothScrollPolyfill from 'smoothscroll-polyfill';


document.addEventListener('DOMContentLoaded', () => {
    if (window.Muilessium) {
        console.error('Muilessium already initialized');
    }

    window.Muilessium = new Muilessium;

    window.Muilessium.components = {
        accordions:   window.Muilessium.create('accordion',         '.mui-accordion',         {}),
        breadcrumbs:  window.Muilessium.create('breadcrumb',        '.mui-breadcrumb',        {}),
        buttonsd:     window.Muilessium.create('button-dropdown',   '.mui-button-dropdown',   {}),
        buttons:      window.Muilessium.create('button',            '.mui-button',            {}),
        carousels:    window.Muilessium.create('carousel',          '.mui-carousel',          {}),
        checkboxes:   window.Muilessium.create('checkbox',          '.mui-checkbox',          {}),
        hnavigations: window.Muilessium.create('header-navigation', '.mui-header-navigation', {}),
        inputRange:   window.Muilessium.create('input-range',       '.mui-input-range',       {}),
        inputs:       window.Muilessium.create('input',             '.mui-input',             {}),
        mediaViews:   window.Muilessium.create('media-view',        '.mui-media-view',        {}),
        paginations:  window.Muilessium.create('pagination',        '.mui-pagination',        {}),
        radios:       window.Muilessium.create('radio',             '.mui-radio',             {}),
        ratings:      window.Muilessium.create('rating',            '.mui-rating',            {}),
        sdropdowns:   window.Muilessium.create('select-dropdown',   '.mui-select-dropdown',   {}),
        tabs:         window.Muilessium.create('tabs',              '.mui-tabs',              {}),
        tagslists:    window.Muilessium.create('tags-list',         '.mui-tags-list',         {}),
        textareas:    window.Muilessium.create('textarea',          '.mui-textarea',          {})
    };

    Utils.initAnchorLinks();

    smoothScrollPolyfill.polyfill();
});
