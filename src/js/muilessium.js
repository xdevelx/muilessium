import * as Utils from './utils';

import { Accordion        } from './components/accordion';
import { BarChart         } from './components/bar-chart';
import { Button           } from './components/button';
import { Carousel         } from './components/carousel';
import { Checkbox         } from './components/checkbox';
import { HeaderNavigation } from './components/header-navigation';
import { Input            } from './components/input';
import { Like             } from './components/like';
import { LineChart        } from './components/line-chart';
import { PieChart         } from './components/pie-chart';
import { ProgressBar      } from './components/progress-bar';
import { SelectDropdown   } from './components/select-dropdown';
import { Tabs             } from './components/tabs';
import { Textarea         } from './components/textarea';


const components = {
    'accordion':         Accordion,
    'bar-chart':         BarChart,
    'button':            Button,
    'carousel':          Carousel,
    'checkbox':          Checkbox,
    'header-navigation': HeaderNavigation,
    'input':             Input,
    'like':              Like,
    'line-chart':        LineChart,
    'pie-chart':         PieChart,
    'progress-bar':      ProgressBar,
    'select-dropdown':   SelectDropdown,
    'tabs':              Tabs,
    'textarea':          Textarea
};


class Muilessium {
    constructor() {
        if (typeof Muilessium.instance === 'object') {
            return Muilessium.instance;
        }
        
        Utils.normalizeTabIndex();
        Utils.objectFitImages();

        this.Utils = Utils;
        
        Muilessium.instance = this;

        return this;
    }

    create(type, selector, options) {
        if (typeof components[type] !== 'function') {
            throw new Error('No such component: ' + type);
        }
        
        var elements = document.querySelectorAll(selector);
        
        return [].map.call(elements, function(element) {
            return new components[type](element, options);
        });
    };
}


export default Muilessium;
