let attempts = 0;

// Load registered user from localStorage (saved during signup)
function getRegisteredUser(){
  try { return JSON.parse(localStorage.getItem('nf_user')); } catch(e){ return null; }
}

document.getElementById('togglePw').addEventListener('click', function(){
  const pw = document.getElementById('password');
  const isText = pw.type === 'text';
  pw.type = isText ? 'password' : 'text';
  this.textContent = isText ? 'SHOW' : 'HIDE';
});

function showAlert(msg){
  const box = document.getElementById('alertBox');
  document.getElementById('alertText').textContent = msg;
  box.classList.add('show');
}
function hideAlert(){ document.getElementById('alertBox').classList.remove('show'); }

function setFieldState(inputId, errId, valid){
  const el = document.getElementById(inputId);
  const err = document.getElementById(errId);
  if(valid){ el.classList.remove('error'); err.classList.remove('show'); }
  else { el.classList.add('error'); err.classList.add('show'); }
  return valid;
}

document.getElementById('loginForm').addEventListener('submit', function(e){
  e.preventDefault();
  hideAlert();
  const email = document.getElementById('email').value.trim();
  const pw = document.getElementById('password').value;

  const emailOk = setFieldState('email','email-err', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
  const pwOk = setFieldState('password','pw-err', pw.length > 0);
  if(!emailOk || !pwOk) return;

  const btn = document.getElementById('loginBtn');
  const spinner = document.getElementById('spinner');
  const btnText = document.getElementById('btnText');
  btn.classList.add('loading');
  spinner.style.display = 'block';
  btnText.textContent = 'Signing in…';

  setTimeout(() => {
    btn.classList.remove('loading');
    spinner.style.display = 'none';
    btnText.textContent = 'Sign In';

    const user = getRegisteredUser();
    const match = user && user.email === email && user.password === pw;

    if(match){
      window.location.href = 'dashboard.html';
    } else {
      attempts++;
      const card = document.getElementById('card');
      card.classList.remove('shake');
      void card.offsetWidth;
      card.classList.add('shake');
      if(!user){
        showAlert('No account found. Please register first.');
      } else if(attempts >= 3){
        showAlert('Too many failed attempts. Make sure you use the email & password from registration.');
      } else {
        showAlert('Incorrect email or password. Please try again.');
      }
    }
  }, 1100);
});