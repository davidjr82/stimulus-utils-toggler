import { Controller } from '@hotwired/stimulus';

export default class extends Controller {

    static values = {
        debug: { type: Boolean, default: false },
    }

    connect() {
        let selectors = [];

        document.querySelectorAll(`[data-toggler-name]`).forEach(target => {
            selectors.push(target.getAttribute('data-toggler-name'));
        });

        if(this.debugValue) {
            console.log('connect - toggle classes - ', selectors);
        }

        this.toggleClasses(selectors);
    }

    hideOutside(event) {

        // fill with elements that I am now inside, so will not be hidden
        let in_targets = [];
        document.querySelectorAll(`[data-toggler-hide-outside]`).forEach(target => {
            if(target.contains(event.target)) {
                in_targets = in_targets.concat(target.getAttribute('data-toggler-hide-outside')?.split(" ") || []);
            }
        });

        if(this.debugValue) {
            console.log('hideOutside - in_targets - ', in_targets);
        }

        // hide all elements that are not in in_targets
        let already_hidden = [];
        document.querySelectorAll(`[data-toggler-hide-outside]`).forEach(target => {
            let elements_to_hide = target.getAttribute('data-toggler-hide-outside')?.split(" ") || [];

            elements_to_hide.forEach(to_hide => {
                if(! in_targets.includes(to_hide) && ! already_hidden.includes(to_hide)) {
                    // change manually open values of element "to_hide", and then toggle its classes
                    document.querySelectorAll(`[data-toggler-name="${to_hide}"]`).forEach((target) => target.toggleAttribute('data-toggler-open', false));
                    this.toggleClasses([to_hide]);

                    if(this.debugValue) {
                        console.log('hideOutside - to_hide - ', to_hide);
                        console.log('hideOutside - already_hidden - ', already_hidden);
                    }

                    already_hidden.push(to_hide);
                }
            });
        });
    }

    all(event) {

        if(this.debugValue) {
            console.log('all - event.currentTarget - ', event.currentTarget);
        }

        let selectors = this.toggleOpenValues(event.currentTarget, 'all');
        this.toggleClasses(selectors);
    }

    show(event) {

        if(this.debugValue) {
            console.log('show - event.currentTarget - ', event.currentTarget);
        }

        let selectors = this.toggleOpenValues(event.currentTarget, 'show');
        this.toggleClasses(selectors);
    }

    hide(event) {

        if(this.debugValue) {
            console.log('hide - event.currentTarget - ', event.currentTarget);
        }

        let selectors = this.toggleOpenValues(event.currentTarget, 'hide');
        this.toggleClasses(selectors);
    }

    toggle(event) {

        if(this.debugValue) {
            console.log('toggle - event.currentTarget - ', event.currentTarget);
        }

        let selectors = this.toggleOpenValues(event.currentTarget, 'toggle');
        this.toggleClasses(selectors);
    }

    // class helper - aka private method
    toggleOpenValues(currentTarget, targetAttribute = 'all') {

        // get targets and actions
        let dataShowAttribute = (['all', 'show'].includes(targetAttribute) && currentTarget.dataset?.togglerShow) ? currentTarget.dataset?.togglerShow : null;
        let dataHideAttribute = (['all', 'hide'].includes(targetAttribute) && currentTarget.dataset?.togglerHide) ? currentTarget.dataset?.togglerHide : null;
        let dataToggleAttribute = (['all', 'toggle'].includes(targetAttribute) && currentTarget.dataset?.togglerToggle) ? currentTarget.dataset?.togglerToggle : null;

        let targetsToShow = dataShowAttribute?.split(" ") || [];
        let targetsToHide = dataHideAttribute?.split(" ") || [];
        let targetsToToggle = dataToggleAttribute?.split(" ") || [];

        // toggle open value in the targets
        targetsToShow.forEach((target) => document.querySelectorAll(`[data-toggler-name="${target}"]`).forEach((target) => target.toggleAttribute('data-toggler-open', true)));
        targetsToHide.forEach((target) => document.querySelectorAll(`[data-toggler-name="${target}"]`).forEach((target) => target.toggleAttribute('data-toggler-open', false)));
        targetsToToggle.forEach((target) => document.querySelectorAll(`[data-toggler-name="${target}"]`).forEach((target) => target.toggleAttribute('data-toggler-open')));

        return [...targetsToShow, ...targetsToHide, ...targetsToToggle];
    }

    // class helper - aka private method
    toggleClasses(selectors) {

        selectors.forEach(selector => {

            let targets = document.querySelectorAll(`[data-toggler-name="${selector}"]`) || [];

            targets.forEach((target) => {

                let offClasses = target.dataset?.togglerOffClass || '';
                let onClasses = target.dataset?.togglerOnClass || '';

                // default off class if nothing set (regular toggle hidden)
                if(offClasses == '' && onClasses == '') {
                    offClasses = 'hidden';
                }

                // change classes
                if(offClasses && !/^\s*$/.test(offClasses)) {
                    offClasses.split(' ').forEach(offClass => {
                        target.classList.toggle(offClass, !target.hasAttribute('data-toggler-open'));
                    });
                }

                if(onClasses && !/^\s*$/.test(onClasses)) {
                    onClasses.split(' ').forEach(onClass => {
                        target.classList.toggle(onClass, target.hasAttribute('data-toggler-open'));
                    });
                }

            });
        });
    }
}