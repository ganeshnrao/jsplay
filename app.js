define(function (require) {
    'use strict';

    var _ = require('lodash');
    var $ = require('jquery');

    $('#app').append('<div>' + _.times(3, _.constant('hello world')).join('<br>') + '</div>');
});
