import Muilessium from './muilessium';

document.addEventListener('DOMContentLoaded', () => {
    window.Hammer = require('hammerjs');
    
    window.Muilessium = new Muilessium;

    let create = window.Muilessium.Factory.create;

    window.Muilessium.Factory.create('Breadcrumb', '.mui-breadcrumb', {});
    window.Muilessium.Factory.create('Button',     '.mui-button',     {});
    window.Muilessium.Factory.create('MediaView',  '.mui-media-view', {});
    window.Muilessium.Factory.create('Pagination', '.mui-pagination', {});
    window.Muilessium.Factory.create('ScrollFix',  '.mui-scroll-fix', {});
    window.Muilessium.Factory.create('TagsList',   '.mui-tags-list',  {});

    window.Muilessium.components = {
        'Accordion':        window.Muilessium.Factory.create('Accordion',        '.mui-accordion',         {}),
        'ButtonDropdown':   window.Muilessium.Factory.create('ButtonDropdown',   '.mui-button-dropdown',   {}),
        'Carousel':         window.Muilessium.Factory.create('Carousel',         '.mui-carousel',          {}),
        'Checkbox':         window.Muilessium.Factory.create('Checkbox',         '.mui-checkbox',          {}),
        'HeaderNavigation': window.Muilessium.Factory.create('HeaderNavigation', '.mui-header-navigation', {}),
        'Input':            window.Muilessium.Factory.create('Input',            '.mui-input',             {}),
        'ModalWindow':      window.Muilessium.Factory.create('ModalWindow',      '.mui-modal-window',      {}),
        'ProgressBar':      window.Muilessium.Factory.create('ProgressBar',      '.mui-progress-bar',      {}),
        'Radio':            window.Muilessium.Factory.create('Radio',            '.mui-radio',             {}),
        'Rating':           window.Muilessium.Factory.create('Rating',           '.mui-rating',            {}),
        'SelectDropdown':   window.Muilessium.Factory.create('SelectDropdown',   '.mui-select-dropdown',   {}),
        'Spoiler':          window.Muilessium.Factory.create('Spoiler',          '.mui-spoiler',           {}),
        'Tabs':             window.Muilessium.Factory.create('Tabs',             '.mui-tabs',              {}),
        'Textarea':         window.Muilessium.Factory.create('Textarea',         '.mui-textarea',          {})
    };
});
