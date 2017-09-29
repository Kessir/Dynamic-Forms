$(document).ready(function() {

    // Place JavaScript code here...

    // console.log(template);

    var fieldModule = {
        fieldCounter: 2,
        init: function () {
            this.formTemplate = $('#field-template').html();

            // setting up listeners
            $('#add-field-button').on('click', function (e) {
                e.preventDefault();
                // alert(e);
                fieldModule.addField();
            })
        },
        addField: function () {
            var outputHtml = Mustache.render(this.formTemplate, {counter: this.fieldCounter});
            $(outputHtml).appendTo( $( "#fields-container" ) );

            this.fieldCounter++;
        }
    };


    fieldModule.init();
});