/* jshint jquery: true */
/* exported MagicToolBox */

var MagicToolBox = (function() {
    'use strict';

    var COLORS = [
        '#FF0000',
        '#FFFF00',
        '#00FF00',
        '#00FFFF',
        '#0000FF',
        '#FF00FF',
        '#FF8000',
        '#80FF00',
        '#00FF80',
        '#0080FF',
        '#8000FF',
        '#FF0080',
        '#40FF00',
        '#00C0FF',
        '#FFC000',
    ];

    /**
    * ToolBox constructor
    */
    function ToolBox(categories) {
        this.initTools();
        this.addCategories(categories);
    }

    //---------------------------------------
    // Tools
    //---------------------------------------
    /**
    * Init toolbar
    */
    ToolBox.prototype.initTools = function() {
        var self = this;
        this.toolBar = $('#selection-toolbar');

        /**
        * Fired when current toll changed.
        * Changes sliders parameters
        */
        function onToolChange() {
            var control = $(this);
            var size = control.data('size');
            var snaps = control.data('snaps');

            if (size) {
                self.sizeInput.slider('enable');
                var changed = false;
                if (self.sizeInput.slider('getAttribute', 'min') !== size.min) {
                    self.sizeInput.slider('setAttribute', 'min', size.min);
                    changed = true;
                }
                if (self.sizeInput.slider('getAttribute', 'max') !== size.max) {
                    self.sizeInput.slider('setAttribute', 'max', size.max);
                    changed = true;
                }
                if (self.sizeInput.slider('getAttribute', 'step') !== size.step) {
                    self.sizeInput.slider('setAttribute', 'step', size.step);
                    changed = true;
                }

                if (changed) {
                    self.sizeInput.slider('refresh');
                    var value = control.data('value') ||
                        self.sizeInput.slider('getValue');
                    self.sizeInput.slider('setValue', value);
                    $('#size-value').text(value.toFixed(2));
                }
            } else {
                self.sizeInput.slider('disable');
            }

            if (snaps) {
                self.planeInput.slider('enable');
                self.colorInput.slider('enable');
            } else {
                self.planeInput.slider('disable');
                self.colorInput.slider('disabled');
            }
        }

        // Init toolbar buttons
        this.brushButton = $('#brush-button')
            .change(onToolChange)
            .data({
                'size': {
                    min: 0.025,
                    max: 0.25,
                    step: 0.025,
                },
                'snaps': true,
                'continuous': true,
                'useCategories': true,
            });
        this.bucketButton = $('#bucket-button')
            .change(onToolChange)
            .data({
                'size': {
                    min: 0.025,
                    max: 1,
                    step: 0.05,
                },
                'snaps': true,
                'continuous': false,
                'useCategories': true,
            });
        this.eraserButton = $('#eraser-button')
            .change(onToolChange)
            .data({
                'size': {
                    min: 0.025,
                    max: 0.25,
                    step: 0.025,
                },
                'snaps': true,
                'continuous': true,
                'eraser': true,
            });
        this.pickerButton = $('#picker-button')
            .change(onToolChange)
            .data({
                'size': false,
                'snaps': false,
                'continuous': false,
            });
        this.selectButton = $('#select-button')
            .change(onToolChange)
            .data({
                'size': false,
                'snaps': false,
                'continuous': false,
                'useCategories': true,
            });

        /**
        * Fired when user starts change slider value
        * Workaround for mouseup error
        */
        function slideOver() {
            var slider = $(this).data('slider');
            $('#main-canvas').one('mouseover', function() {
                slider.mouseup();
            });
        }

        // Init sliders
        this.sizeInput = $('#size-input')
            .slider({
                min: 0.025,
                max: 0.25,
                step: 0.025,
                value: 0.1,
                tooltip: 'hide',
            })
            .on('slide', function(evt) {
                $('#size-value').text(evt.value.toFixed(2));
            })
            .on('slideStart', slideOver)
            .on('slideStop', function(evt) {
                // Save current value to button
                self.toolBar
                    .find('input:radio:checked')
                    .data('value', evt.value);
            });

        this.planeInput = $('#plane-input')
            .slider({
                min: 0.0,
                max: 0.05,
                step: 0.01,
                value: 0.0,
                tooltip: 'hide',
            })
            .on('slide', function(evt) {
                var text = 'off';
                if (evt.value > 0) {
                    text = evt.value.toFixed(2);
                }

                $('#plane-value').text(text);
            })
            .on('slideStart', slideOver);
        this.colorInput = $('#color-input')
            .slider({
                min: 0.0,
                max: 0.5,
                step: 0.1,
                value: 0.0,
                tooltip: 'hide',
            })
            .on('slide', function(evt) {
                var text = 'off';
                if (evt.value > 0) {
                    text = evt.value.toFixed(2);
                }

                $('#color-value').text(text);
            })
            .on('slideStart', slideOver);
    };

    /**
    * Returns current tool parameters
    */
    ToolBox.prototype.getCurrentToolData = function(prop) {
        return this.toolBar.find('input:radio:checked').data(prop);
    };

    /**
    * Returns brush size
    */
    ToolBox.prototype.getSize = function() {
        var data = this.getCurrentToolData();
        if (!data.size) {
            return 0;
        }

        return this.sizeInput.slider('getValue');
    };

    /**
    * Returns plane test value
    */
    ToolBox.prototype.snapToPlane = function() {
        return this.planeInput.slider('getValue');
    };

    /**
    * Returns color test value
    */
    ToolBox.prototype.snapToColor = function() {
        return this.colorInput.slider('getValue');
    };

    /**
    * Returns true if current tool uses categories
    */
    ToolBox.prototype.useCategories = function() {
        return this.getCurrentToolData('useCategories');
    };

    /**
    * Returns true if current continues can be used as a brush
    */
    ToolBox.prototype.continuous = function() {
        return this.getCurrentToolData('continuous');
    };

    //---------------------------------------
    // Category picker
    //---------------------------------------
    /**
    * Init list of categories
    */
    ToolBox.prototype.addCategories = function(categories) {
        this.categoryPicker = $('#category-list');
        for (var i = 0; i < categories.length; i++) {
            this.addCategoryToPicker(categories[i], i, i === 0);
        }
    };

    /**
    * Adds category to categories list
    * @param {string} category - category name
    * @param {number} index - category index in the list
    * @param {bool} active - shows that category should be selected
    */
    ToolBox.prototype.addCategoryToPicker = function(category, index, active) {
        var item = $('<a>')
            .addClass('list-group-item magic-category-picker-item')
            .attr({
                'href': '#',
                'onclick': 'return false;'
            })
            .data('index', index)
            .appendTo(this.categoryPicker);

        var icon = $('<div>')
            .addClass('magic-category-picker-icon')
            .css({ 'background-color': COLORS[index] });

        var label = $('<div>')
            .addClass('magic-category-picker-label')
            .text(category);

        item.append(icon)
            .append(label);

        if (active) {
            item.addClass('active');
        }

        var self = this;
        item.click(function() {
            self.categoryPicker.children('.active').removeClass('active');
            $(this).addClass('active');
        });
    };

    /**
    * Returns selected category index
    */
    ToolBox.prototype.getSelectedCategory = function() {
        if (!this.useCategories()) {
            return 0;
        }

        return this.categoryPicker
            .children('.active')
            .data('index') + 1;
    };

    /**
     * Returns color value
     */
    ToolBox.prototype.getSelectedColor = function() {
        return COLORS[this.getSelectedCategory() - 1];
    };

    return ToolBox;
})();
