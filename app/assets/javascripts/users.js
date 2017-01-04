/* global $ */
//Document ready
$(document).on('turbolinks:load', function(){
    var theForm = $('#pro_form');
    var submitBtn = $('#form-signup-btn');
    
    //Set Stripe public key
    Stripe.setPublishableKey($('meta[name="stripe-key"]').attr('content'));
    
    //When user clicks form submit btn
    submitBtn.click(function(event){
        //prevent default subimission behavior 
        event.preventDefault();
        submitBtn.val("Processing").prop('disabled', true);
        
        //Collect the credit card fields
        var ccNum = $('#card_number').val(),
            cvcNum = $('#card_code').val(),
            expMonth = $('#card_month').val(),
            expYear = $('#card_year').val();
            
        //Use Stripe js library to check for card errors
        var error = false;
        
        //validate card number
        if (!Stripe.card.validateCardNumber(ccNum))
        {
            error = true;
            alert('The credit card number seems to be invalid');
        }
        
        //validate CVC
        if (!Stripe.card.validateCVC(cvcNum))
        {
            error = true;
            alert('The CVC number seems to be invalid');
        }
        
        //validate expiration date
        if (!Stripe.card.validateExpiry(expMonth, expYear))
        {
            error = true;
            alert('The experation date seems to be invalid');
        }
            
        if (error) {
            //If there are card errors, don't send to Stripe
            
            //Make submit button useful again
            submitBtn.val('Sign Up').prop('disabled',false);
        } else {
            //Send the card info to Stripe
             Stripe.createToken({
                number: ccNum,
                cvc: cvcNum,
                exp_month: expMonth,
                exp_year: expYear
            }, stripeResponseHandler);
            
        }
        
        
        return false;
    });

    //Stripe will return a card token
    
    function stripeResponseHandler(status, response) {
        //Get the token from the response
        var token = response.id;
        
        //Inject card token as hidden field into form
        theForm.append( $('<input type="hidden" name="user[stripe_card_token]">').val(token) );
        
        //Submit form to our Rails app
        theForm.get(0).submit();
    }
});
