"use strict";

let installPrompt = null;
const installButton = document.getElementById("installBtn");
const installTip = document.getElementById("installTip");

function isStandalone() {
  return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
}

function setInstallMessage(message) {
  installTip.textContent = message;
  installTip.hidden = !message;
}

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register("./service-worker.js", { scope: "./" });
      registration.update();
    } catch (error) {
      console.warn("离线服务注册失败：", error);
    }
  });
}

window.addEventListener("beforeinstallprompt", event => {
  event.preventDefault();
  installPrompt = event;
  if (!isStandalone()) installButton.hidden = false;
});

installButton.addEventListener("click", async () => {
  if (!installPrompt) {
    setInstallMessage("请打开浏览器菜单，选择“安装应用”或“添加到主屏幕”。");
    return;
  }
  installPrompt.prompt();
  const choice = await installPrompt.userChoice;
  installPrompt = null;
  installButton.hidden = true;
  setInstallMessage(choice.outcome === "accepted" ? "安装成功！以后可以从桌面图标进入游戏。" : "本次未安装，你可以稍后再试。");
});

window.addEventListener("appinstalled", () => {
  installPrompt = null;
  installButton.hidden = true;
  setInstallMessage("游戏已安装到桌面，并且可以离线运行。");
});

if (isStandalone()) {
  installButton.hidden = true;
} else if (location.protocol === "file:") {
  installButton.hidden = false;
  setInstallMessage("当前是文件模式：可以游玩，但安装 PWA 需要从 HTTPS 游戏网址打开。");
}
