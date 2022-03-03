import { Controller } from '@hotwired/stimulus';

export default class extends Controller {

    connect() {
        let selectors = [];

        document.querySelectorAll(`[data-toggler-name]`).forEach(target => {
            selectors.push(target.getAttribute('data-toggler-name'));
        });

        this.toggleClasses(selectors);
    }

    toggle(event) {
        let selectors = this.toggleOpenValues(event.currentTarget);
        this.toggleClasses(selectors);
    }

    toggleOpenValues(currentTarget) {

        // get targets and actions
        let dataShowAttribute = currentTarget.dataset?.togglerShow ? currentTarget.dataset?.togglerShow : null;
        let dataHideAttribute = currentTarget.dataset?.togglerHide ? currentTarget.dataset?.togglerHide : null;
        let dataToggleAttribute = currentTarget.dataset?.togglerToggle ? currentTarget.dataset?.togglerToggle : null;

        let targetsToShow = dataShowAttribute?.split(" ") || [];
        let targetsToHide = dataHideAttribute?.split(" ") || [];
        let targetsToToggle = dataToggleAttribute?.split(" ") || [];

        // toggle open value in the targets
        targetsToShow.forEach((target) => document.querySelectorAll(`[data-toggler-name="${target}"]`).forEach((target) => target.toggleAttribute('data-toggler-open', true)));
        targetsToHide.forEach((target) => document.querySelectorAll(`[data-toggler-name="${target}"]`).forEach((target) => target.toggleAttribute('data-toggler-open', false)));
        targetsToToggle.forEach((target) => document.querySelectorAll(`[data-toggler-name="${target}"]`).forEach((target) => target.toggleAttribute('data-toggler-open')));

        return [...targetsToShow, ...targetsToHide, ...targetsToToggle];
    }

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