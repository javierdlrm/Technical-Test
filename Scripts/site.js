(function($){
    'use strict';

    // Start managements
    $(document).ready(documentReadyManagements);
    $(window).load(windowLoadManagements);

})(jQuery)

//---- Main functions

/// Managements when document is ready.
function documentReadyManagements()
{
    // Scrollbar style
    manageScrollBar();
}

/// Managements when window is loaded.
function windowLoadManagements()
{
    // Header visibility
    manageHeader();

    // Hamburger visibility
    manageHamburgerMenu();

    // File form template visibility
    manageFileInput();

    // Enable file drop zone
    manageDropZone();

    // Enable copy to clipboard
    manageCopyToClipboard();
}

//---- Other functions

/// Manages the header visibility for each view.
function manageHeader() {
    var menuHeader = $('.menu-header');

    if (document.title.indexOf("Index") === -1) {
        if (!menuHeader.hasClass('menu-header-show')) {
            menuHeader.addClass('menu-header-show');
        }
    } else {
        if (menuHeader.hasClass('menu-header-show')) {
            menuHeader.removeClass('menu-header-show');
        }
    }
}

/// Manages the hamburger menu visibility for each view.
function manageHamburgerMenu()
{
    $('#hamburger-menu-button').click(manageHamburgerMenuButtonClick);
}
function manageHamburgerMenuButtonClick()
{
    var button = $('#hamburger-menu-button');

    if (button.hasClass('fa-bars')) { // Opening
        $(window).resize(function () {
            console.log("Resize: " + $(window).width());
            if ($(window).width() >= 850)
                manageHamburgerMenuButtonClick();
        });
    }
    else { // Closing
        $(window).off("resize");
    }

    $('.column-left').toggleClass('column-zero-width');
    button.toggleClass('fa-bars');
    button.toggleClass('fa-times');
}

/// Manages the file form and template visibility.
function manageFileInput()
{
    if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
        alert('The File APIs are not fully supported in this browser.');
        return;
    }

    $('#input-file').change(function () {
        loadFile($('#input-file')[0].files[0])
    });
}

/// Enable file drop zone.
function manageDropZone()
{
    $(document.body).on('drop dragover dragenter', function (e) {
        e.preventDefault();
        e.stopPropagation();
    });

    var textArea = $('#text-area');

    textArea.on('dragover', function (e) {
        e.preventDefault();
        e.stopPropagation();

        console.log("Dragover");
    });
    textArea.on('dragenter', function (e) {
        e.preventDefault();
        e.stopPropagation();

        console.log("Dragenter");

        if (!textArea.hasClass('text-area-dragover'))
            textArea.addClass('text-area-dragover');
    });
    textArea.on('dragleave', function (e) {
        console.log("Drageleave");

        if (textArea.hasClass('text-area-dragover'))
            textArea.removeClass('text-area-dragover');
    });
    textArea.on('drop', function (e) {
        if (e.originalEvent.dataTransfer) {
            if (e.originalEvent.dataTransfer.files.length) {
                e.preventDefault();
                e.stopPropagation();
                
                loadFile(e.originalEvent.dataTransfer.files[0]);
            }
        }
    });
}

// Load file in text area
function loadFile(file)
{
    fileReader = new FileReader();
    fileReader.onloadend = function () {
        $('#text-area').val(fileReader.result);
    };
    fileReader.readAsText(file);
}

/// Styles the scroll bars.
function manageScrollBar() {

    $('#text-area').slimScroll({
        height: '400px',
        width: '100%'
    });

    $('#warnings-area').slimScroll({
        height: '200px',
        width: '100%'
    });

    $('#scroll-left').slimScroll({
        height: '100%',
        width: '100%'
    });

    $('#scroll-right').slimScroll({
        height: '100%',
        width: '100%'
    });
}

/// Enable copy to clipboard.
function manageCopyToClipboard()
{
    $('#button-copy').click(function (event) {
        var textArea = document.querySelector('#text-area');
        var range = document.createRange();
        range.selectNode(textArea);
        window.getSelection().addRange(range);

        try {
            var successful = document.execCommand('copy');
            message = successful ? 'Copied!' : 'Not supported browser';
        } catch (error) {
            message = 'Not supported browser';
        }

        manageCopyNotification(message);
        try{ window.getSelection().removeRange(range); } 
        catch (error){ window.getSelection().removeAllRanges();}
    });
}
function manageCopyNotification(message)
{
    var copyLabel = $('#copy-label');
    copyLabel.val(message);

    var height = copyLabel.height() + 35;
    console.log("Height: " + height);
    copyLabel.css('margin-top', '-' + height + 'px');

    if (!copyLabel.hasClass('copy-label-show'))
        copyLabel.addClass('copy-label-show');

    setTimeout(function () { copyLabel.removeClass('copy-label-show'); }, 1500);
}