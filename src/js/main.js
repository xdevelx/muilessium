import Muilessium from './muilessium';

document.addEventListener('DOMContentLoaded', () => {
    window.Hammer = require('hammerjs');
    window.Muilessium = new Muilessium;

    window.Muilessium.components = {
        'Accordion':        window.Muilessium.Factory.create('Accordion',        '.mui-accordion',         {}),
        'Breadcrumb':       window.Muilessium.Factory.create('Breadcrumb',       '.mui-breadcrumb',        {}),
        'ButtonDropdown':   window.Muilessium.Factory.create('ButtonDropdown',   '.mui-button-dropdown',   {}),
        'Button':           window.Muilessium.Factory.create('Button',           '.mui-button',            {}),
        'Carousel':         window.Muilessium.Factory.create('Carousel',         '.mui-carousel',          {}),
        'Checkbox':         window.Muilessium.Factory.create('Checkbox',         '.mui-checkbox',          {}),
        'HeaderNavigation': window.Muilessium.Factory.create('HeaderNavigation', '.mui-header-navigation', {}),
        'Input':            window.Muilessium.Factory.create('Input',            '.mui-input',             {}),
        'MediaView':        window.Muilessium.Factory.create('MediaView',        '.mui-media-view',        {}),
        'ModalWindow':      window.Muilessium.Factory.create('ModalWindow',      '.mui-modal-window',      {}),
        'Pagination':       window.Muilessium.Factory.create('Pagination',       '.mui-pagination',        {}),
        'ProgressBar':      window.Muilessium.Factory.create('ProgressBar',      '.mui-progress-bar',      {}),
        'Radio':            window.Muilessium.Factory.create('Radio',            '.mui-radio',             {}),
        'Rating':           window.Muilessium.Factory.create('Rating',           '.mui-rating',            {}),
        'SelectDropdown':   window.Muilessium.Factory.create('SelectDropdown',   '.mui-select-dropdown',   {}),
        'Tabs':             window.Muilessium.Factory.create('Tabs',             '.mui-tabs',              {}),
        'TagsList':         window.Muilessium.Factory.create('TagsList',         '.mui-tags-list',         {}),
        'Textarea':         window.Muilessium.Factory.create('Textarea',         '.mui-textarea',          {})
    };
});
