import Muilessium from './muilessium';

document.addEventListener('DOMContentLoaded', () => {
    window.Muilessium = new Muilessium;

    window.Muilessium.create('input',    '.mui-input',    {});
    window.Muilessium.create('textarea', '.mui-textarea', {});
    window.Muilessium.create('like',     '.mui-like',     {});
});