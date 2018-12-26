function dashboardControls() {
    let deletebtns = document.querySelectorAll('a.delete-trigger');
    deletebtns.forEach((element) => {
        element.addEventListener('click', () => {
            element.nextElementSibling.classList = 'in-view';
        });
    });

    let closebtns = document.querySelectorAll('button.form-close');
    closebtns.forEach((element) => {
        element.addEventListener('click', () => {
            element.parentElement.classList = 'hidden';
        });
    });
}

function checklogin() {
    if (document.getElementById('email').value == '') {
        hide.innerHTML = 'Please, input your email.';
        return false;
    }
    else if (document.getElementById('pwd').value == '') {
        hide.innerHTML = 'Please, provide your password.';  
        return false;
    }
    else{
        return true;
    }
}

c1.style.display = 'none';
c2.style.display = 'none';
c3.style.display = 'none';
c4.style.display = 'none';
c5.style.display = 'none';
c6.style.display = 'none';
c7.style.display = 'none';
c8.style.display = 'none';

function reg1() {
    let email = document.getElementById('remail').value;
    if (email == ''){
        c2.style.display = 'block'
        c1.style.display = 'none'
    }
    else if (email.includes('@')){
        c1.style.display = 'block'
        c2.style.display = 'none'
    }
}

function reg2() {
    let fname = document.getElementById('fname').value;
    if (fname == '') {
        c4.style.display = 'block'
        c3.style.display = 'none'
    }
    else if (fname != '') {
        c3.style.display = 'block'
        c4.style.display = 'none'
    }

}
function reg3() {
    let sname = document.getElementById('sname').value;
    if (sname == '') {
        c6.style.display = 'block'
        c5.style.display = 'none'
    }
    else if (sname != '') {
        c5.style.display = 'block'
        c6.style.display = 'none'
    }

}


