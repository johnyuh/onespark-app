// email.js
const toast = document.getElementById('toast');
const mailBtn = document.getElementById('mail-btn');
const mailForm = document.getElementById('mail-form');
const sendBtn = document.getElementById('send-mail');

mailBtn.addEventListener('click', () => {
  mailForm.style.display = (mailForm.style.display === 'flex') ? 'none' : 'flex';
});

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

  const now = new Date();
  const timestamp = now.toISOString().replace(/[-:]/g, '').slice(0, 15);
  const fileName = `emails/inbox_${timestamp}.txt`;
  const content = `📩 OneSpark 星火留言\n\n時間：${now.toLocaleString()}\n姓名：${name}\nEmail：${email}\n\n內容：\n${message}\n`;

  try {
    const { GITHUB_USER, GITHUB_REPO, GITHUB_TOKEN } = window.OneSparkConfig;
    const url = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${fileName}`;
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: `新增留言 ${fileName}`,
        content: btoa(unescape(encodeURIComponent(content)))
      })
    });

    if (res.ok) {
      showToast('✅ 已送出留言');
      mailForm.style.display = 'none';
      document.getElementById('sender-name').value = '';
      document.getElementById('sender-email').value = '';
      document.getElementById('sender-message').value = '';
    } else {
      showToast('❌ 無法寫入 GitHub，請稍後再試');
      console.error(await res.text());
    }
  } catch (e) {
    console.error(e);
    showToast('⚠️ 傳送失敗');
  }
});
