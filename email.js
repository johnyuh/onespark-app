// email.js - 呼叫安全 API 寫入 GitHub 並寄通知信
const toast = document.getElementById('toast');
const mailForm = document.getElementById('mail-form');
const sendBtn = document.getElementById('send-mail');

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

sendBtn.addEventListener('click', async () => {
  const name = document.getElementById('sender-name').value.trim();
  const email = document.getElementById('sender-email').value.trim();
  const message = document.getElementById('sender-message').value.trim();

  if (!name || !message) return showToast('請填寫姓名與留言內容');

  try {
    const res = await fetch('/api/github-email-proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message })
    });

    if (res.ok) {
      showToast('✅ 已送出留言');
      mailForm.style.display = 'none';
      document.getElementById('sender-name').value = '';
      document.getElementById('sender-email').value = '';
      document.getElementById('sender-message').value = '';
    } else {
      const err = await res.text();
      console.error(err);
      showToast('❌ 傳送失敗');
    }
  } catch (e) {
    console.error(e);
    showToast('⚠️ 無法連線伺服器');
  }
});
