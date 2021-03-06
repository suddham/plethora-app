//sign up form error Session
Template.signupForm.created = function(){
    Session.set('signUpErrors', {});
};

//using our template. set the error message
Template.signupForm.helpers({
    errorMessage : function(field) {
        return Session.get('signUpErrors')[field];
    },
    errorClass: function(field) {
        return !!Session.get('signUpErrors')[field] ? 'has-error' : '';
    }
});

//sign up form event handler
Template.signupForm.events({
    'submit #signin-form' : function(e){
        e.preventDefault();

        var signInForm = $(e.currentTarget),
            username = signInForm.find('#name').val().toLowerCase(),
            email = trimInput(signInForm.find('#email').val().toLowerCase()),
            password = signInForm.find('#password').val(),
            passwordConfirm = signInForm.find('#verify').val()
            ,
            //to set out session errors
            loginFields = {
                username: username,
                email : email,
                password: password,
                verify: passwordConfirm
            },

            //check for empty form fields
            errors = validate(loginFields);


        if(errors.username || errors.email || errors.password || errors.verify){
            return Session.set('signUpErrors', errors);
        }

        if(!areValidPasswords(password, passwordConfirm)) {
            errors.password, errors.verify = "Your passwords did not match";
            return Session.set('signUpErrors', errors);
        }
        if (isNotEmpty(email) && isNotEmpty(password) && isEmail(email) && areValidPasswords(password, passwordConfirm)) {
            Accounts.createUser({username: username, email: email, password: password}, function(err) {
                if (err) {
                    if (err.message === 'Email already exists. [403]') {
                        console.log('We are sorry but this email is already used.');
                        errors.email = 'We are sorry but this email is already used. Try another one.';
                        return Session.set('signUpErrors', errors);
                    } else {
                        console.log('We are sorry but something went wrong.');
                        return throwError(err.message);
                    }
                } else {
                    Router.go('/welcome');

                    //refresh Session state
                    return Session.set('signUpErrors', {})
                }
            });

        }

        //keeps complier happy?
        return false;
    }
});