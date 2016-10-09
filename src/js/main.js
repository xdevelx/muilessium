import Muilessium from './muilessium';

document.addEventListener('DOMContentLoaded', () => {
    window.Muilessium = new Muilessium;
    

    window.Muilessium.create('input',    '.mui-input',    {});
    window.Muilessium.create('textarea', '.mui-textarea', {});
    window.Muilessium.create('like',     '.mui-like',  {
        'eventListeners': {
            'click': () => {
                console.log('like click callback....');
            }
        }
    });
    window.Muilessium.create('button', '.mui-button', {
        'eventListeners': {
            'click': () => {
                console.log('button click callback....');
            }
        }
    });
    window.Muilessium.create('carousel', '.mui-carousel', {});
    window.Muilessium.create('piechart', '.mui-pie-chart', {});
    window.Muilessium.create('barchart', '.mui-bar-chart', {});
    window.Muilessium.create('linechart', '.mui-line-chart', {});
});
