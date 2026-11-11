document.addEventListener('DOMContentLoaded', () => {
  const statusDot = document.querySelector('.status-dot');
  const apiStatus = document.getElementById('api-status');
  const taskCodeInput = document.getElementById('task-code-input');
  const actionTypeSelect = document.getElementById('action-type-select');
  const btnGenerate = document.getElementById('btn-generate');
  const generatedString = document.getElementById('generated-string');
  const btnCopy = document.getElementById('btn-copy');

  // Check health endpoint
  fetch('/api/health')
    .then(res => res.json())
    .then(data => {
      if (data.status === 'ok') {
        statusDot.classList.add('active');
        apiStatus.textContent = 'Server: Sẵn sàng (Port 3000)';
      }
    })
    .catch(() => {
      apiStatus.textContent = 'Server: Offline (Mở qua tệp tĩnh)';
    });

  // Generator logic
  function generateSnippet() {
    const code = (taskCodeInput.value || 'TN-1').trim().toUpperCase();
    const type = actionTypeSelect.value;
    let result = '';

    switch (type) {
      case 'commit':
        result = `feat(core): [${code}] implement feature updates`;
        break;
      case 'branch':
        result = `feature/${code.toLowerCase()}-inbound-demo`;
        break;
      case 'pr':
        result = `feat: ${code} Add responsive navigation bar`;
        break;
      case 'issue':
        result = `[Tính năng] Tạo trang giới thiệu sản phẩm`;
        break;
      default:
        result = `[${code}] demo`;
    }

    generatedString.textContent = result;
  }

  btnGenerate.addEventListener('click', generateSnippet);

  btnCopy.addEventListener('click', async () => {
    const text = generatedString.textContent;
    try {
      await navigator.clipboard.writeText(text);
      const originalText = btnCopy.textContent;
      btnCopy.textContent = 'Đã chép!';
      btnCopy.style.backgroundColor = '#dcfce7';
      btnCopy.style.color = '#15803d';
      setTimeout(() => {
        btnCopy.textContent = originalText;
        btnCopy.style.backgroundColor = '';
        btnCopy.style.color = '';
      }, 1500);
    } catch {
      alert('Không thể sao chép, hãy copy bằng tay: ' + text);
    }
  });
});

