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

            if (size)
                self.sizeInput.slider('enable');
            else
                self.sizeInput.slider('disable');
        }

        // Init toolbar buttons
        this.brushButton = $('#brush-button')
            .change(onToolChange)
            .data({
                'size': {
                    min: 0.025,
                    max: 0.25,
                    step: 0.025
                },
                'continuous': true,
                'useCategories': true
            });
        this.bucketButton = $('#bucket-button')
            .change(onToolChange)
            .data({
                'continuous': false,
                'useCategories': true
            });
        this.eraserButton = $('#eraser-button')
            .change(onToolChange)
            .data({
                'continuous': true,
                'eraser': true
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
                min: 1.0,
                max: 10.0,
                step: 0.5,
                value: 1.0,
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
    };

    /**
    * Returns current tool parameters
    */
    ToolBox.prototype.getCurrentToolData = function(prop) {
        return this.toolBar.find('input:radio:checked');
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
    * Returns true if current tool uses categories
    */
    ToolBox.prototype.useCategories = function() {
        return this.getCurrentToolData('useCategories');
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
