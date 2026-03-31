const colors = { weak:'#ff5f6d', fair:'#ffbe57', good:'#4fc3f7', strong:'#4fffb0' };

document.getElementById('password').addEventListener('input', function(){
  const v = this.value;
  let score = 0;
  if(v.length >= 8) score++;
  if(/[A-Z]/.test(v)) score++;
  if(/[0-9]/.test(v)) score++;
  if(/[^A-Za-z0-9]/.test(v)) score++;
  const bars = [s1,s2,s3,s4];
  const labels = ['','Weak','Fair','Good','Strong'];
  const c = [null, colors.weak, colors.fair, colors.good, colors.strong];
  bars.forEach((b,i) => b.style.background = i < score ? c[score] : 'var(--border)');
  document.getElementById('strength-label').textContent = labels[score];
  document.getElementById('strength-label').style.color = c[score] || 'var(--muted)';
});

function validate(id, condition, errId) {
  const el = document.getElementById(id);
  const err = document.getElementById(errId);
  if(condition) {
    el.classList.remove('error'); el.classList.add('valid');
    err.classList.remove('show'); return true;
  } else {
    el.classList.add('error'); el.classList.remove('valid');
    err.classList.add('show'); return false;
  }
}

document.getElementById('regForm').addEventListener('submit', function(e){
  e.preventDefault();
  const fname = document.getElementById('fname').value.trim();
  const lname = document.getElementById('lname').value.trim();
  const email = document.getElementById('email').value.trim();
  const username = document.getElementById('username').value.trim();
  const pw = document.getElementById('password').value;
  const cf = document.getElementById('confirm').value;
  const terms = document.getElementById('terms').checked;

  const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const userRx = /^[a-zA-Z0-9_]{3,20}$/;

  let ok = true;
  ok = validate('fname', fname.length > 0, 'fname-err') && ok;
  ok = validate('lname', lname.length > 0, 'lname-err') && ok;
  ok = validate('email', emailRx.test(email), 'email-err') && ok;
  ok = validate('username', userRx.test(username), 'username-err') && ok;
  ok = validate('password', pw.length >= 8, 'password-err') && ok;
  ok = validate('confirm', pw === cf && cf.length > 0, 'confirm-err') && ok;

  const termsEl = document.getElementById('terms');
  const termsErr = document.getElementById('terms-err');
  if(!terms){ termsErr.classList.add('show'); ok = false; }
  else { termsErr.classList.remove('show'); }

  if(ok){
    // Save credentials so login page can verify them
    localStorage.setItem('nf_user', JSON.stringify({ email, password: pw, name: fname + ' ' + lname }));
    const btn = document.getElementById('submitBtn');
    btn.classList.add('loading'); btn.textContent = 'Creating…';
    setTimeout(() => {
      document.getElementById('successMsg').classList.add('show');
      btn.style.display = 'none';
      setTimeout(() => window.location.href = 'login.html', 2000);
    }, 1200);
  }
});