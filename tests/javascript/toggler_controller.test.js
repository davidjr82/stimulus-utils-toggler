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

let block7 = null; // clicking away demo, show
let block8 = null; // clicking away demo, show
let block9 = null; // clicking away demo, toggle
let block_away_1 = null; // clicking away demo


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
                <div data-controller="toggler" data-action="click@window->toggler#away touch@window->toggler#away">

                    <!-- regular on/off demos -->
                    <div data-action='click->toggler#all touch->toggler#all' data-toggler-show="block1"        data-testid="trigger-show-1">Show block 1</div>
                    <div data-action='click->toggler#all touch->toggler#all' data-toggler-show="block1 block2" data-testid="trigger-show-1-2">Show block 1 & 2</div>
                    <div data-action='click->toggler#all touch->toggler#all' data-toggler-show="block3"        data-testid="trigger-show-3">Show block 3</div>

                    <div data-action='click->toggler#all touch->toggler#all' data-toggler-hide="block3"        data-testid="trigger-hide-3">Hide block 3</div>
                    <div data-action='click->toggler#all touch->toggler#all' data-toggler-hide="block3 block4" data-testid="trigger-hide-3-4">Hide block 3 & 4</div>
                    <div data-action='click->toggler#all touch->toggler#all' data-toggler-hide="block2"        data-testid="trigger-hide-2">Hide block 2</div>

                    <div data-action='click->toggler#all touch->toggler#all' data-toggler-toggle="block1"        data-testid="trigger-toggle-1">Toggle block 1</div>
                    <div data-action='click->toggler#all touch->toggler#all' data-toggler-toggle="block3"        data-testid="trigger-toggle-3">Toggle block 3</div>
                    <div data-action='click->toggler#all touch->toggler#all' data-toggler-toggle="block2 block4" data-testid="trigger-toggle-2-4">Toggle block 2 & 4</div>

                    <div data-action='click->toggler#all touch->toggler#all' data-toggler-show="block1" data-toggler-hide="block3" data-toggler-toggle="block4" data-testid="trigger-multiple">Show 1, hide 3 & toggle 4</div>

                    <div data-action='click->toggler#all touch->toggler#all' data-toggler-show="block5 block6"   data-testid="trigger-show-5-6">Show block 5 & 6 custom classes</div>
                    <div data-action='click->toggler#all touch->toggler#all' data-toggler-hide="block5 block6"   data-testid="trigger-hide-5-6">Hide block 5 & 6 custom classes</div>
                    <div data-action='click->toggler#all touch->toggler#all' data-toggler-toggle="block5 block6" data-testid="trigger-toggle-5-6">Toggle block 5 & 6 custom classes</div>

                    <div data-toggler-name="block1"                                  data-testid="block-1">Block 1</div>
                    <div data-toggler-name="block2" class="hidden"                   data-testid="block-2">Block 2</div>
                    <div data-toggler-name="block3"                data-toggler-open data-testid="block-3">Block 3</div>
                    <div data-toggler-name="block4" class="hidden" data-toggler-open data-testid="block-4">Block 4</div>

                    <div data-toggler-name="block5"                   data-testid="block-5" data-toggler-on-class="custom-5-on" data-toggler-off-class="custom-5-off">Block 5 custom classes</div>
                    <div data-toggler-name="block6" data-toggler-open data-testid="block-6" data-toggler-on-class="custom-6-on" data-toggler-off-class="custom-6-off">Block 6 custom classes</div>


                    <!-- clicking away demos -->
                    <div data-action='click->toggler#all touch->toggler#all' data-toggler-show="block7 block8" data-toggler-toggle="block9" data-toggler-away="block7 block8 block9" data-testid="trigger-away-1">Show 7 & 8, Toggle 9</div>

                    <div data-toggler-name="block7"                 data-testid="block-7" data-toggler-away="block7"  >Block 7, hides itself clicking away</div>
                    <div data-toggler-name="block8" class="hidden"  data-testid="block-8" data-toggler-away="block8" >Block 8, hides itself clicking away</div>
                    <div data-toggler-name="block9"                 data-testid="block-9" data-toggler-away="block9" >Block 9, hides itself clicking away</div>
                    <div                                            data-testid="block-away-1">Block to test clicking away</div>
                </div>
            `);

            block1 = getByTestId(container, "block-1");
            block2 = getByTestId(container, "block-2");
            block3 = getByTestId(container, "block-3");
            block4 = getByTestId(container, "block-4");

            block5 = getByTestId(container, "block-5");
            block6 = getByTestId(container, "block-6");

            block7 = getByTestId(container, "block-7");
            block8 = getByTestId(container, "block-8");
            block9 = getByTestId(container, "block-9");
            block_away_1 = getByTestId(container, "block-away-1");
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


        // clicking away
        test("show and toggle at the same time and dont trigger hide away", () => {
            expect(block7).toHaveClass('hidden');
            expect(block8).toHaveClass('hidden');
            expect(block9).toHaveClass('hidden');
            expect(block_away_1).not.toHaveClass('hidden');

            // regular toggle
            fireEvent.click(getByTestId(container, "trigger-away-1"));
            expect(block7).not.toHaveClass('hidden');
            expect(block8).not.toHaveClass('hidden');
            expect(block9).not.toHaveClass('hidden');
            expect(block_away_1).not.toHaveClass('hidden');

            fireEvent.click(getByTestId(container, "trigger-away-1"));
            expect(block7).not.toHaveClass('hidden');
            expect(block8).not.toHaveClass('hidden');
            expect(block9).toHaveClass('hidden');
            expect(block_away_1).not.toHaveClass('hidden');

            fireEvent.click(getByTestId(container, "trigger-away-1"));
            expect(block7).not.toHaveClass('hidden');
            expect(block8).not.toHaveClass('hidden');
            expect(block9).not.toHaveClass('hidden');
            expect(block_away_1).not.toHaveClass('hidden');

            // away all, block-away-1
            fireEvent.click(getByTestId(container, "block-away-1"));
            expect(block7).toHaveClass('hidden');
            expect(block8).toHaveClass('hidden');
            expect(block9).toHaveClass('hidden');
            expect(block_away_1).not.toHaveClass('hidden');

            // trigger show and toggle
            fireEvent.click(getByTestId(container, "trigger-away-1"));
            expect(block7).not.toHaveClass('hidden');
            expect(block8).not.toHaveClass('hidden');
            expect(block9).not.toHaveClass('hidden');
            expect(block_away_1).not.toHaveClass('hidden');

            // away, block-7
            fireEvent.click(getByTestId(container, "block-7"));
            expect(block7).not.toHaveClass('hidden');
            expect(block8).toHaveClass('hidden');
            expect(block9).toHaveClass('hidden');
            expect(block_away_1).not.toHaveClass('hidden');

            // trigger show and toggle
            fireEvent.click(getByTestId(container, "trigger-away-1"));
            expect(block7).not.toHaveClass('hidden');
            expect(block8).not.toHaveClass('hidden');
            expect(block9).not.toHaveClass('hidden');
            expect(block_away_1).not.toHaveClass('hidden');

            // away, block-8
            fireEvent.click(getByTestId(container, "block-8"));
            expect(block7).toHaveClass('hidden');
            expect(block8).not.toHaveClass('hidden');
            expect(block9).toHaveClass('hidden');
            expect(block_away_1).not.toHaveClass('hidden');

            // trigger show and toggle
            fireEvent.click(getByTestId(container, "trigger-away-1"));
            expect(block7).not.toHaveClass('hidden');
            expect(block8).not.toHaveClass('hidden');
            expect(block9).not.toHaveClass('hidden');
            expect(block_away_1).not.toHaveClass('hidden');

            // away, block-9
            fireEvent.click(getByTestId(container, "block-9"));
            expect(block7).toHaveClass('hidden');
            expect(block8).toHaveClass('hidden');
            expect(block9).not.toHaveClass('hidden');
            expect(block_away_1).not.toHaveClass('hidden');

            // trigger show and toggle
            fireEvent.click(getByTestId(container, "trigger-away-1"));
            expect(block7).not.toHaveClass('hidden');
            expect(block8).not.toHaveClass('hidden');
            expect(block9).toHaveClass('hidden');
            expect(block_away_1).not.toHaveClass('hidden');

            // away all, block-away-1
            fireEvent.click(getByTestId(container, "block-away-1"));
            expect(block7).toHaveClass('hidden');
            expect(block8).toHaveClass('hidden');
            expect(block9).toHaveClass('hidden');
            expect(block_away_1).not.toHaveClass('hidden');
        });
    });
});
