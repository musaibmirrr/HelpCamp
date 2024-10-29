// our client side validation process 
// check bootstrap docs for form validation

// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
    'use strict'

    bsCustomFileInput.init()
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.validated-form')

    // Loop over them and prevent submission
    //   this a way of turning something into array
    Array.from(forms)
        .forEach(form => {
            form.addEventListener('submit', event => {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }

                form.classList.add('was-validated')
            }, false)
        })
})()
