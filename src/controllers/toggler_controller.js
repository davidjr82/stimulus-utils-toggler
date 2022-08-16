import { Controller } from '@hotwired/stimulus';

export default class extends Controller {

    static values = {
        debug: { type: Boolean, default: false },
    }

    connect() {
        let selectors = [];

        document.querySelectorAll(`[data-toggler-name], [data-toggler-tab]`).forEach(target => {
            selectors.push(target);
        });

        if(this.debugValue) {
            console.log('connect - toggle classes - ', selectors);
        }

        this.toggleClasses(selectors);
    }

    away(event) {

        // fill with elements that I am now inside, so will not be hidden
        let in_targets = [];
        document.querySelectorAll(`[data-toggler-away]`).forEach(target => {
            if(target.contains(event.target)) {
                in_targets = in_targets.concat(target.getAttribute('data-toggler-away')?.split(" ") || []);
            }
        });

        if(this.debugValue) {
            console.log('away - in_targets - ', in_targets);
        }

        // hide all elements that are not in in_targets
        let already_analyzed_to_hide = [];
        document.querySelectorAll(`[data-toggler-away]`).forEach(target => {
            let elements_to_hide = target.getAttribute('data-toggler-away')?.split(" ") || [];

            elements_to_hide.forEach(to_hide => {
                if(! in_targets.includes(to_hide) && ! already_analyzed_to_hide.includes(to_hide)) {
                    // change manually open values of element "to_hide", and then toggle its classes
                    document.querySelectorAll(`[data-toggler-name="${to_hide}"]`).forEach((target) => target.toggleAttribute('data-toggler-open', false));
                    this.toggleClasses([to_hide]);

                    if(this.debugValue) {
                        console.log('away - to_hide - ', to_hide);
                    }
                }

                if(! already_analyzed_to_hide.includes(to_hide)) {
                    already_analyzed_to_hide.push(to_hide);

                    if(this.debugValue) {
                        console.log('away - already_analyzed_to_hide - ', already_analyzed_to_hide);
                    }
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
        let dataTabAttribute = (['all'].includes(targetAttribute) && currentTarget.dataset?.togglerTab) ? currentTarget.dataset?.togglerTab : null;

        let targetsToShow = dataShowAttribute?.split(" ") || [];
        let targetsToHide = dataHideAttribute?.split(" ") || [];
        let targetsToToggle = dataToggleAttribute?.split(" ") || [];
        let targetsToHideIfBelongToTab = dataTabAttribute?.split(" ") || [];


        // for tab action, hide other tab contents before executing show
        targetsToHideIfBelongToTab.forEach(tab => {

            let tabSelectors = document.querySelectorAll(`[data-toggler-tab="${tab}"]`);

            tabSelectors.forEach(tabSelector => {
                if(! tabSelector.isEqualNode(currentTarget)) {
                    tabSelector.toggleAttribute('data-toggler-open', false);
                    targetsToHide = targetsToHide.concat(tabSelector, tabSelector.dataset?.togglerShow?.split(" ") || []);
                }
                else {
                    currentTarget.toggleAttribute('data-toggler-open', true);
                    targetsToShow = targetsToShow.concat(currentTarget);
                }
            });
        });

        // toggle open value in the targets
        targetsToShow.forEach((target) => document.querySelectorAll(`[data-toggler-name="${target}"]`).forEach((target) => target.toggleAttribute('data-toggler-open', true)));
        targetsToHide.forEach((target) => document.querySelectorAll(`[data-toggler-name="${target}"]`).forEach((target) => target.toggleAttribute('data-toggler-open', false)));
        targetsToToggle.forEach((target) => document.querySelectorAll(`[data-toggler-name="${target}"]`).forEach((target) => target.toggleAttribute('data-toggler-open')));

        return [...targetsToShow, ...targetsToHide, ...targetsToToggle];
    }

    // class helper - aka private method
    toggleClasses(selectors) {

        selectors.forEach(selector => {

            let targets = (typeof selector === 'string')
                            ? document.querySelectorAll(`[data-toggler-name="${selector}"]`) || []
                            : [selector];

            targets.forEach((target) => {

                let offClasses = target.dataset?.togglerOffClass || '';
                let onClasses = target.dataset?.togglerOnClass || '';

                // default off class if nothing set (regular toggle hidden)
                if(offClasses == '' && onClasses == '') {
                    offClasses = 'hidden';
                }

                // change classes
                if(offClasses && !/^\s*$/.test(offClasses)) {

                    this.fireEvents(target, 'togglerEventsOffBefore');

                    offClasses.split(' ').forEach(offClass => {
                        target.classList.toggle(offClass, !target.hasAttribute('data-toggler-open'));
                    });


                    this.fireEvents(target, 'togglerEventsOff');
                    this.fireEvents(target, 'togglerEventsOffAfter');
                }

                if(onClasses && !/^\s*$/.test(onClasses)) {

                    this.fireEvents(target, 'togglerEventsOnBefore');

                    onClasses.split(' ').forEach(onClass => {
                        target.classList.toggle(onClass, target.hasAttribute('data-toggler-open'));
                    });

                    this.fireEvents(target, 'togglerEventsOn');
                    this.fireEvents(target, 'togglerEventsOnAfter');
                }

                this.fireEvents(target, 'togglerEvents');
            });
        });
    }

    fireEvents(target, eventDataSet) {

        if(!target.dataset) {
            return;
        }

        let togglerEvents = target.dataset[eventDataSet] || '';

        if(togglerEvents && !/^\s*$/.test(togglerEvents)) {
            togglerEvents.split(' ').forEach(togglerEvent => {
                let eventDispatched = this.dispatch(togglerEvent, { detail: { content: target } });

                if(this.debugValue) {
                    console.log('fireEvents dispatched', target, togglerEvents, togglerEvent, eventDispatched);
                }
            });
        }
    }
}