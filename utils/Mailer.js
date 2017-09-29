var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
var helper = require('sendgrid').mail;
const hostname = "https://aluapp.herokuapp.com/";
const CONTENT = 'Hello, We have added new fields to the Form. Please go  to <a href="'+ hostname +'">'+ hostname +'</a>';

exports.sendNewFieldsNotif_ = function (emails) {
    var from_email = new helper.Email('no-reply@aluapp.com'),
        to_email = new helper.Email(emails),
        subject = 'New fields added to Data Form',
        content = new helper.Content('text/html', CONTENT),
        mail = new helper.Mail(from_email, subject, to_email, content);

    var request = sg.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: mail.toJSON()
    });

    sg.API(request, function(error, response) {
        console.log(response.statusCode);
        console.log(response.body);
        console.log(response.headers);
    })
};

exports.sendNewFieldsNotif = function (emails) {

    var request = sg.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: {
            personalizations: [
                {
                    to: emails,
                    subject: 'New fields added to Data Form'
                }
            ],
            from: {
                email: 'no-reply@app.com'
            },
            content: [
                {
                    type: 'text/html',
                    value: CONTENT
                }
            ]
        }
    });

    //With promise
    sg.API(request)
        .then(response => {
            console.log(response.statusCode);
            console.log(response.body);
            console.log(response.headers);
        })
        .catch(error => {
            //error is an instance of SendGridError
            //The full response is attached to error.response
            console.log(error.response.statusCode);
        });

};