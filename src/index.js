import { Application } from '@hotwired/stimulus';
window.stimulus = Application.start();

import { default as Toggler } from "./controllers/toggler_controller.js";
stimulus.register('toggler', Toggler);