import { Application } from '@hotwired/stimulus';

import { fireEvent, getByTestId } from "@testing-library/dom";
import { cleanupDOM, mountDOM } from "../utils";

import { default as Toggler } from "../../src/controllers/toggler_controller.js";

const startStimulus = () => {
    const stimulus = Application.start();
    stimulus.register("toggler", Toggler);
};

let container = null;
let block1 = null; // start close without classes
let block2 = null; // start close with class hidden
let block3 = null; // start open without classes
let block4 = null; // start open with class hidden

let block5 = null; // start close with custom classes
let block6 = null; // start open with custom classes

describe("TogglerController", () => {

    beforeAll(() => {
        startStimulus();
    });

    afterEach(() => {
        cleanupDOM();
    });

    describe("using default hidden class", () => {
      beforeEach(() => {
            container = mountDOM(`
                <div data-controller="toggler">
                    <div data-action='click->toggler#all touch->toggler#all' data-toggler-show="block1" data-testid="trigger-show-1">Show block 1</div>
                    <div data-action='click->toggler#all touch->toggler#all' data-toggler-show="block1 block2" data-testid="trigger-show-1-2">Show block 1 & 2</div>
                    <div data-action='click->toggler#all touch->toggler#all' data-toggler-show="block3" data-testid="trigger-show-3">Show block 3</div>

                    <div data-action='click->toggler#all touch->toggler#all' data-toggler-hide="block3" data-testid="trigger-hide-3">Hide block 3</div>
                    <div data-action='click->toggler#all touch->toggler#all' data-toggler-hide="block3 block4" data-testid="trigger-hide-3-4">Hide block 3 & 4</div>
                    <div data-action='click->toggler#all touch->toggler#all' data-toggler-hide="block2" data-testid="trigger-hide-2">Hide block 2</div>

                    <div data-action='click->toggler#all touch->toggler#all' data-toggler-toggle="block1" data-testid="trigger-toggle-1">Toggle block 1</div>
                    <div data-action='click->toggler#all touch->toggler#all' data-toggler-toggle="block3" data-testid="trigger-toggle-3">Toggle block 3</div>
                    <div data-action='click->toggler#all touch->toggler#all' data-toggler-toggle="block2 block4" data-testid="trigger-toggle-2-4">Toggle block 2 & 4</div>

                    <div data-action='click->toggler#all touch->toggler#all' data-toggler-show="block1" data-toggler-hide="block3" data-toggler-toggle="block4" data-testid="trigger-multiple">Show 1, hide 3 & toggle 4</div>

                    <div data-action='click->toggler#all touch->toggler#all' data-toggler-show="block5 block6" data-testid="trigger-show-5-6">Show block 5 & 6 custom classes</div>
                    <div data-action='click->toggler#all touch->toggler#all' data-toggler-hide="block5 block6" data-testid="trigger-hide-5-6">Hide block 5 & 6 custom classes</div>
                    <div data-action='click->toggler#all touch->toggler#all' data-toggler-toggle="block5 block6" data-testid="trigger-toggle-5-6">Toggle block 5 & 6 custom classes</div>

                    <div data-toggler-name="block1" data-testid="block-1">Block 1</div>
                    <div data-toggler-name="block2" class="hidden" data-testid="block-2">Block 2</div>
                    <div data-toggler-name="block3" data-toggler-open data-testid="block-3">Block 3</div>
                    <div data-toggler-name="block4" class="hidden" data-toggler-open data-testid="block-4">Block 4</div>

                    <div data-toggler-name="block5" data-testid="block-5" data-toggler-on-class="custom-5-on" data-toggler-off-class="custom-5-off">Block 5 custom classes</div>
                    <div data-toggler-name="block6" data-toggler-open data-testid="block-6" data-toggler-on-class="custom-6-on" data-toggler-off-class="custom-6-off">Block 6 custom classes</div>
                </div>
            `);

            block1 = getByTestId(container, "block-1");
            block2 = getByTestId(container, "block-2");
            block3 = getByTestId(container, "block-3");
            block4 = getByTestId(container, "block-4");

            block5 = getByTestId(container, "block-5");
            block6 = getByTestId(container, "block-6");
        });

        // connect
        test("connects sets the default state of the targets", () => {
            expect(block1).toHaveClass('hidden');
            expect(block2).toHaveClass('hidden');
            expect(block3).not.toHaveClass('hidden');
            expect(block4).not.toHaveClass('hidden');
        });

        // show
        test("shows a single element", () => {
            expect(block1).toHaveClass('hidden');
            fireEvent.click(getByTestId(container, "trigger-show-1"));
            expect(block1).not.toHaveClass('hidden');
        });

        test("shows two elements", () => {
            expect(block1).toHaveClass('hidden');
            expect(block2).toHaveClass('hidden');
            fireEvent.click(getByTestId(container, "trigger-show-1-2"));
            expect(block1).not.toHaveClass('hidden');
            expect(block2).not.toHaveClass('hidden');
        });

        test("shows a single element already visible", () => {
            expect(block3).not.toHaveClass('hidden');
            fireEvent.click(getByTestId(container, "trigger-show-3"));
            expect(block3).not.toHaveClass('hidden');
        });


        // hide
        test("hides a single element", () => {
            expect(block3).not.toHaveClass('hidden');
            fireEvent.click(getByTestId(container, "trigger-hide-3"));
            expect(block3).toHaveClass('hidden');
        });

        test("hides two elements", () => {
            expect(block3).not.toHaveClass('hidden');
            expect(block4).not.toHaveClass('hidden');
            fireEvent.click(getByTestId(container, "trigger-hide-3-4"));
            expect(block3).toHaveClass('hidden');
            expect(block4).toHaveClass('hidden');
        });

        test("hides a single element already hidden", () => {
            expect(block2).toHaveClass('hidden');
            fireEvent.click(getByTestId(container, "trigger-hide-2"));
            expect(block2).toHaveClass('hidden');
        });

        // toggle
        test("toggle a hidden element", () => {
            expect(block1).toHaveClass('hidden');
            fireEvent.click(getByTestId(container, "trigger-toggle-1"));
            expect(block1).not.toHaveClass('hidden');
            fireEvent.click(getByTestId(container, "trigger-toggle-1"));
            expect(block1).toHaveClass('hidden');
        });

        test("toggle a visible element", () => {
            expect(block3).not.toHaveClass('hidden');
            fireEvent.click(getByTestId(container, "trigger-toggle-3"));
            expect(block3).toHaveClass('hidden');
            fireEvent.click(getByTestId(container, "trigger-toggle-3"));
            expect(block3).not.toHaveClass('hidden');
        });

        test("toggle two elements at the same time", () => {
            expect(block2).toHaveClass('hidden');
            expect(block4).not.toHaveClass('hidden');
            fireEvent.click(getByTestId(container, "trigger-toggle-2-4"));
            expect(block2).not.toHaveClass('hidden');
            expect(block4).toHaveClass('hidden');
            fireEvent.click(getByTestId(container, "trigger-toggle-2-4"));
            expect(block2).toHaveClass('hidden');
            expect(block4).not.toHaveClass('hidden');
        });

        // show hide and toggle at the same time
        test("show hide and toggle at the same time", () => {
            expect(block1).toHaveClass('hidden');
            expect(block3).not.toHaveClass('hidden');
            expect(block4).not.toHaveClass('hidden');
            fireEvent.click(getByTestId(container, "trigger-multiple"));
            expect(block1).not.toHaveClass('hidden');
            expect(block3).toHaveClass('hidden');
            expect(block4).toHaveClass('hidden');
            fireEvent.click(getByTestId(container, "trigger-multiple"));
            expect(block1).not.toHaveClass('hidden');
            expect(block3).toHaveClass('hidden');
            expect(block4).not.toHaveClass('hidden');
        });

        // custom classes
        test("connects sets the default state of the targets with custom classes", () => {
            expect(block5).not.toHaveClass('hidden');
            expect(block6).not.toHaveClass('hidden');

            expect(block5).not.toHaveClass('custom-5-on');
            expect(block5).toHaveClass('custom-5-off');

            expect(block6).toHaveClass('custom-6-on');
            expect(block6).not.toHaveClass('custom-6-off');
        });

        test("show custom classes", () => {
            expect(block5).not.toHaveClass('hidden');
            expect(block6).not.toHaveClass('hidden');

            expect(block5).not.toHaveClass('custom-5-on');
            expect(block5).toHaveClass('custom-5-off');

            expect(block6).toHaveClass('custom-6-on');
            expect(block6).not.toHaveClass('custom-6-off');

            fireEvent.click(getByTestId(container, "trigger-show-5-6"));

            expect(block5).not.toHaveClass('hidden');
            expect(block6).not.toHaveClass('hidden');

            expect(block5).toHaveClass('custom-5-on');
            expect(block5).not.toHaveClass('custom-5-off');

            expect(block6).toHaveClass('custom-6-on');
            expect(block6).not.toHaveClass('custom-6-off');
        });

        test("hide custom classes", () => {
            expect(block5).not.toHaveClass('hidden');
            expect(block6).not.toHaveClass('hidden');

            expect(block5).not.toHaveClass('custom-5-on');
            expect(block5).toHaveClass('custom-5-off');

            expect(block6).toHaveClass('custom-6-on');
            expect(block6).not.toHaveClass('custom-6-off');

            fireEvent.click(getByTestId(container, "trigger-hide-5-6"));

            expect(block5).not.toHaveClass('hidden');
            expect(block6).not.toHaveClass('hidden');

            expect(block5).not.toHaveClass('custom-5-on');
            expect(block5).toHaveClass('custom-5-off');

            expect(block6).not.toHaveClass('custom-6-on');
            expect(block6).toHaveClass('custom-6-off');
        });

        test("toggle custom classes", () => {
            expect(block5).not.toHaveClass('hidden');
            expect(block6).not.toHaveClass('hidden');

            expect(block5).not.toHaveClass('custom-5-on');
            expect(block5).toHaveClass('custom-5-off');

            expect(block6).toHaveClass('custom-6-on');
            expect(block6).not.toHaveClass('custom-6-off');

            fireEvent.click(getByTestId(container, "trigger-toggle-5-6"));

            expect(block5).not.toHaveClass('hidden');
            expect(block6).not.toHaveClass('hidden');

            expect(block5).toHaveClass('custom-5-on');
            expect(block5).not.toHaveClass('custom-5-off');

            expect(block6).not.toHaveClass('custom-6-on');
            expect(block6).toHaveClass('custom-6-off');
        });
    });
});
