'use strict';

$(function() {
    var fileInput = $('.js-upload-file-input');
    var resultContainer = $('.js-result-container');

    var diffParser = new DiffParser();
    var diffFormatter = new DiffFormatter();

    fileInput.on('change', function(e) {
        var file = this.files[0];

        console.time();
        diffParser.parse(file, function(diff) {
            console.timeEnd();
            var html = diffFormatter.format(diff, resultContainer);
        });
    });

});
