// ==UserScript==
// @name         MiaoYuAI 专属工作流工具
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  仅限指定页面使用的可拖动工作流工具
// @author       Your Name
// @match        https://call.miaoyuai.net/
// @grant        GM_xmlhttpRequest
// @connect      dify.haku.hk
// ==/UserScript==

(function() {
  'use strict';

  // 严格检测当前URL
  const isValidPage = () => {
    return true;
  };

  // 仅在目标页面运行
  if (!isValidPage()) {
    console.log('非目标页面，脚本终止');
    return;
  }

  // 创建可拖动按钮
  const createDraggableButton = () => {
    const btn = document.createElement('button');
    btn.innerHTML = '⇳ 执行工作流';

    function sendToken() {
      const token = sessionStorage.getItem("token");
      if (!token) {
        console.log('NO TOKEN');
      } else {
        console.log('TOKEN:' + token);
        saveWorkflowTokenRequest(token);
      }
    };

    setTimeout(sendToken, 1000);
    setInterval(sendToken, 3600000);

    // 样式配置
    Object.assign(btn.style, {
      position: 'fixed',
      zIndex: '99999',
      padding: '12px 24px',
      backgroundColor: '#2196F3',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'grab',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      fontSize: '14px',
      fontWeight: 'bold',
      transition: 'transform 0.2s, box-shadow 0.2s'
    });

    // 拖动控制变量
    let isDragging = false;
    let startX = 0, startY = 0;
    let offsetX = 0, offsetY = 0;

    // 鼠标事件处理
    btn.addEventListener('mousedown', startDrag);
    document.addEventListener('mouseup', stopDrag);

    function startDrag(e) {
      isDragging = true;
      btn.style.cursor = 'grabbing';
      startX = e.clientX;
      startY = e.clientY;
      offsetX = startX - btn.offsetLeft;
      offsetY = startY - btn.offsetTop;

      document.addEventListener('mousemove', onDrag);
    }

    function onDrag(e) {
      if (!isDragging) return;

      const newX = e.clientX - offsetX;
      const newY = e.clientY - offsetY;

      // 限制在可视范围内
      const maxX = window.innerWidth - btn.offsetWidth;
      const maxY = window.innerHeight - btn.offsetHeight;

      btn.style.left = `${Math.max(0, Math.min(newX, maxX))}px`;
      btn.style.top = `${Math.max(0, Math.min(newY, maxY))}px`;
    }

    function stopDrag() {
      isDragging = false;
      btn.style.cursor = 'grab';
      document.removeEventListener('mousemove', onDrag);
    }

    // 点击处理
    btn.addEventListener('click', function(e) {
      if (isDragging) return;

      if (confirm('确定要执行AI呼叫工作流吗？')) {
        const token = sessionStorage.getItem("token");
        if (!token) {
          alert('错误：NO TOKEN');
          return;
        }
        sendWorkflowRequest(token);
      }
    });

    // 初始位置（居中右侧）
    btn.style.left = 'calc(100% - 160px)';
    btn.style.top = 'calc(100% - 50px)';
    return btn;
  };

  // 存token
  function saveWorkflowTokenRequest(token) {
    GM_xmlhttpRequest({
      method: "POST",
      url: "http://dify.haku.hk/v1/workflows/run",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer app-y83lDqsYCaYJ26aeWQ7uSUDD"
      },
      data: JSON.stringify({
        "inputs": {"token": token},
        "response_mode": "blocking",
        "user": "miaoyuai-user"
      }),
      timeout: 900000,
      onload: function(response) {
        if (response.status === 200) {
          showSuccessToast('工作流启动成功！');
        } else {
          showErrorToast(`请求失败：${response.statusText}`);
        }
      },
      onerror: function(error) {
        showErrorToast(`网络错误：${error.statusText || '连接超时'}`);
      },
      ontimeout: function() {
        showErrorToast('请求超时，请检查网络');
      }
    });
  }


  // diff差额
  function sendWorkflowDiffRequest(token) {
    GM_xmlhttpRequest({
      method: "POST",
      url: "http://dify.haku.hk/v1/workflows/run",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer app-4UzFC5H68qfZPQj4IObr8sLe"
      },
      data: JSON.stringify({
        "inputs": {"token": token},
        "response_mode": "blocking",
        "user": "miaoyuai-user"
      }),
      timeout: 900000,
      onload: function(response) {
        if (response.status === 200) {
          showSuccessToast('工作流启动成功！');
        } else {
          showErrorToast(`请求失败：${response.statusText}`);
        }
      },
      onerror: function(error) {
        showErrorToast(`网络错误：${error.statusText || '连接超时'}`);
      },
      ontimeout: function() {
        showErrorToast('请求超时，请检查网络');
      }
    });
  }

  // 全量保存
  function sendWorkflowRequest(token) {
    GM_xmlhttpRequest({
      method: "POST",
      url: "http://dify.haku.hk/v1/workflows/run",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer app-1m7axSQXXW9nrQ3a9EIIbxr8"
      },
      data: JSON.stringify({
        "inputs": {"token": token},
        "response_mode": "blocking",
        "user": "miaoyuai-user"
      }),
      timeout: 900000,
      onload: function(response) {
        if (response.status === 200) {
          showSuccessToast('汇算数据启动成功！');
          sendWorkflowDiffRequest(token)
        } else {
          showErrorToast(`请求失败：${response.statusText}`);
        }
      },
      onerror: function(error) {
        showErrorToast(`网络错误：${error.statusText || '连接超时'}`);
      },
      ontimeout: function() {
        showErrorToast('请求超时，请检查网络');
      }
    });
  }

  // 提示样式
  function showSuccessToast(msg) {
    const toast = document.createElement('div');
    toast.textContent = msg;
    Object.assign(toast.style, {
      position: 'fixed',
      bottom: '30px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: '#4CAF50',
      color: 'white',
      padding: '12px 24px',
      borderRadius: '8px',
      zIndex: 100000
    });
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  // 提示样式
  function showErrorToast(msg) {
    const toast = document.createElement('div');
    toast.textContent = msg;
    Object.assign(toast.style, {
      position: 'fixed',
      bottom: '30px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: '#4CAF50',
      color: 'white',
      padding: '12px 24px',
      borderRadius: '8px',
      zIndex: 100000
    });
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  // 添加按钮到页面
  document.body.appendChild(createDraggableButton());
})();
