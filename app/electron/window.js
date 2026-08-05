// 桌面端 pre-boot 窗口（init.html / workspace.html）共享脚本
// 由各 HTML 通过 <script src="window.js"></script> 引入，依赖 nodeIntegration: true
// 中文用 ld246.com，其他语言用 liuyun.io
"use strict";

// 解析 URL query 参数
const getSearch = (key) => {
    if (window.location.search.indexOf("?") === -1) {
        return "";
    }
    let value = "";
    const data = window.location.search.split("?")[1].split("&");
    data.find(item => {
        const keyValue = item.split("=");
        if (keyValue[0] === key) {
            value = keyValue[1];
            return true;
        }
    });
    return value;
};

// 多语言文案，集中维护所有窗口的全部文案
const I18N_BASE = {
    "en": {
        title: "SvoyBloknot",
        crashTip: "⚠️ A renderer process previously exited unexpectedly. This may be related to plugins, code snippets, or a custom theme and icon. Starting in safe mode is recommended. Safe mode disables all plugins and code snippets and switches to the default theme and icon. Related content is not deleted, but these settings must be restored manually after startup.",
        safeModeBtn: "🛡️ Start in safe mode",
        normalBtn: "Start normally",
        slogan: "Refactor your thinking",
        wsTitle: "Workspaces",
        missingTip: "⚠️ The last opened workspace path could not be found",
        emptyHint: "No available workspaces, please select a new workspace path",
        selectPath: "🗂️ Select a new workspace path",
        selectPathDesc: "The workspace is used to store data, which can be switched later in the top bar menu later",
        workspace: "🗂️ Workspace",
        workspaceDesc: "The workspace is used to store data, which can be switched later in the top bar menu later",
        notice: "⚠️ Do not use a third-party sync disk to sync data, otherwise it will cause abnormal operation and data damage",
        open: "Open",
        selectBtn: "Select",
        lang: "🌐 Language",
        langDesc: "User interface language, which can be switched later in <kbd>Settings</kbd> - <kbd>Appearance</kbd>",
        feedback: "Support and Feedback",
        community: "View on GitHub",
        download: "Download",
        feedbackUrl: "https://github.com/TuriaArt/SvoyBloknot/issues",
        communityUrl: "https://github.com/TuriaArt/SvoyBloknot",
        downloadUrl: "https://github.com/TuriaArt/SvoyBloknot/releases",
        msgPartitionRoot: "⚠️ Do not create the workspace in the partition root path, please create a new folder as the workspace",
        msgNotEmpty: "⚠️ This folder contains other files, please create a new folder as the workspace",
        msgICloud: "⚠️ This folder is under the iCloud sync path, please change another path",
        msgCloudDrive: "⚠️ The folder path can not contain onedrive, dropbox, google drive, pcloud, nutstore, baidunetdisk, weiyun, etc., please change another path",
        msgConfirm: "⚠️ Please confirm that the workspace is not set under the path of a third-party sync disk, otherwise it will cause data damage (iCloud/OneDrive/Dropbox/Google Drive/Nutstore/Baidu Netdisk/Tencent Weiyun, etc.), continue?",
    },
    "ru": {
        title: "SvoyBloknot",
        crashTip: "⚠️ Обнаружено, что процесс отрисовки ранее неожиданно завершился. Это может быть связано с плагинами, фрагментами кода или пользовательскими темами и значками. Рекомендуется запуск в безопасном режиме. Безопасный режим отключает все плагины и фрагменты кода, а также переключает на стандартные тему и значок. Связанные материалы не удаляются, но после запуска эти настройки нужно восстановить вручную.",
        safeModeBtn: "🛡️ Запустить в безопасном режиме",
        normalBtn: "Запустить в обычном режиме",
        slogan: "Реструктурируйте своё мышление",
        wsTitle: "Рабочие пространства",
        missingTip: "⚠️ Не удалось найти путь последнего открытого рабочего пространства",
        emptyHint: "Нет доступных рабочих пространств, выберите новый путь рабочего пространства",
        selectPath: "🗂️ Выберите новый путь рабочего пространства",
        selectPathDesc: "Рабочее пространство используется для хранения данных, его можно переключить позже в главном меню верхней панели",
        workspace: "🗂️ Рабочее пространство",
        workspaceDesc: "Рабочее пространство используется для хранения данных, его можно переключить позже в главном меню верхней панели",
        notice: "⚠️ Не используйте сторонний диск синхронизации для синхронизации данных, иначе это приведёт к неправильной работе и повреждению данных",
        open: "Открыть",
        selectBtn: "Выбрать",
        lang: "🌐 Язык",
        langDesc: "Язык интерфейса пользователя, который можно переключить позже в <kbd>Настройках</kbd> - <kbd>Внешний вид</kbd>",
        feedback: "Поддержка и обратная связь",
        community: "Посмотреть на GitHub",
        download: "Скачать",
        feedbackUrl: "https://github.com/TuriaArt/SvoyBloknot/issues",
        communityUrl: "https://github.com/TuriaArt/SvoyBloknot",
        downloadUrl: "https://github.com/TuriaArt/SvoyBloknot/releases",
        msgPartitionRoot: "⚠️ Не создавайте рабочее пространство в корневом пути раздела, создайте новую папку в качестве рабочего пространства",
        msgNotEmpty: "⚠️ Эта папка содержит другие файлы, создайте новую папку в качестве рабочего пространства",
        msgICloud: "⚠️ Эта папка находится по пути синхронизации iCloud, измените другой путь",
        msgCloudDrive: "⚠️ Путь к папке не может содержать onedrive, dropbox, google drive, pcloud, nutstore, baidunetdisk, weiyun и т. д., измените другой путь",
        msgConfirm: "⚠️ Подтвердите, что рабочее пространство не настроено по пути стороннего диска синхронизации, иначе это приведёт к повреждению данных (iCloud/OneDrive/Dropbox/Google Drive/Nutstore/Baidu Netdisk/Tencent Weiyun и т. д.), продолжить?",
    },
};

// 当前界面语言，由各 HTML 设置
let currentLang = decodeURIComponent(getSearch("lang"));

// 应用指定语言文案到 DOM 并返回当前语言的文案对象
const applyLang = (lang) => {
    const langData = I18N_BASE[lang] || I18N_BASE["en"];
    document.title = `${langData.title} v${getSearch("v")}`;
    document.querySelectorAll("[data-i18n]").forEach(item => {
        const key = item.getAttribute("data-i18n");
        if (langData[key]) {
            item.textContent = langData[key];
        }
    });
    // 含 HTML 标签（如 <kbd>）的文案用 innerHTML
    document.querySelectorAll("[data-i18n-html]").forEach(item => {
        const key = item.getAttribute("data-i18n-html");
        if (langData[key]) {
            item.innerHTML = langData[key];
        }
    });
    document.querySelectorAll("[data-i18n-href]").forEach(item => {
        const key = item.getAttribute("data-i18n-href");
        if (langData[key]) {
            item.href = langData[key];
        }
    });
    currentLang = lang;
    return langData;
};

// 工作空间路径校验函数
const isPartitionRootPath = (absPath) => {
    const path = require("path");
    return path.parse(absPath).root === absPath;
};

const isEmptyDir = (absPath) => {
    const fs = require("fs");
    let files;
    try {
        files = fs.readdirSync(absPath).filter(file => file !== ".DS_Store");
    } catch (err) {
        return false;
    }
    return 0 === files.length;
};

const isWorkspaceDir = (absPath) => {
    const path = require("path");
    const fs = require("fs");
    const conf = path.join(absPath, "conf", "conf.json");
    let data;
    try {
        data = fs.readFileSync(conf, "utf8");
    } catch (err) {
        return false;
    }
    return data.includes("kernelVersion");
};

const isCloudDrivePath = (absPath) => {
    const absPathLower = absPath.toLowerCase();
    return -1 < absPathLower.indexOf("onedrive") || -1 < absPathLower.indexOf("dropbox") ||
        -1 < absPathLower.indexOf("google drive") || -1 < absPathLower.indexOf("pcloud") ||
        -1 < absPathLower.indexOf("坚果云") || -1 < absPathLower.indexOf("nutstore") ||
        -1 < absPathLower.indexOf("百度网盘") || -1 < absPathLower.indexOf("baidunetdisk") ||
        -1 < absPathLower.indexOf("腾讯微云") || -1 < absPathLower.indexOf("weiyun");
};

// macOS 端对工作空间放置在 iCloud 路径下做检查 https://github.com/siyuan-note/siyuan/issues/7747
const isICloudPath = (absPath) => {
    const os = require("os");
    if ("darwin" !== os.platform()) {
        return false;
    }
    const path = require("path");
    const homePath = decodeURIComponent(getSearch("home"));
    const absPathLower = absPath.toLowerCase();
    const iCloudRoot = path.join(homePath, "Library", "Mobile Documents");
    if (!simpleCheckIcloudPath(absPath, homePath)) {
        // 简单判断无法通过则复杂验证
        const allFiles = walk(iCloudRoot);
        for (const file of allFiles) {
            if (-1 < absPathLower.indexOf(file.toLowerCase())) {
                return true;
            }
        }
    }
    return false;
};

// 简单判断 iCloud 同步目录
// 不允许 为桌面 文档 和 iCloud 文件夹 和软链接
const simpleCheckIcloudPath = (absPath, homePath) => {
    const fs = require("fs");
    const path = require("path");
    let stat = fs.lstatSync(absPath);
    if (stat.isSymbolicLink()) {
        return false;
    }
    const absPathLower = absPath.toLowerCase();
    const iCloudRoot = path.join(homePath, "Library", "Mobile Documents");
    if (absPathLower.startsWith(iCloudRoot.toLowerCase())) {
        return false;
    }
    const documentsRoot = path.join(homePath, "Documents");
    if (absPathLower.startsWith(documentsRoot.toLowerCase())) {
        return false;
    }
    const desktopRoot = path.join(homePath, "Desktop");
    if (absPathLower.startsWith(desktopRoot.toLowerCase())) {
        return false;
    }
    return true;
};

const walk = (dir, files = []) => {
    const fs = require("fs");
    const path = require("path");
    let dirFiles;
    try {
        if (!fs.existsSync(dir)) {
            console.log("dir [" + dir + "] not exists");
            return files;
        }
        dirFiles = fs.readdirSync(dir);
    } catch (e) {
        console.error("read dir [" + dir + "] failed: ", e);
        return files;
    }
    for (const f of dirFiles) {
        let stat = fs.lstatSync(dir + path.sep + f);
        if (stat.isSymbolicLink()) {
            files.push(fs.readlinkSync(dir + path.sep + f));
            continue;
        }
        if (stat.isDirectory()) {
            // 如果已经遍历过则不再遍历
            if (files.includes(dir + path.sep + f)) {
                continue;
            }
            files.push(dir + path.sep + f);
            walk(dir + path.sep + f, files);
        }
    }
    return files;
};

// 选择工作空间目录并做路径校验，返回选中的路径；取消或校验失败返回 null
const chooseWorkspacePath = async (langData) => {
    const path = require("path");
    const fs = require("fs");
    const {ipcRenderer} = require("electron");

    let defaultWorkspace = path.join(decodeURIComponent(getSearch("home")), "SvoyBloknot");
    if ("darwin" === process.platform) {
        // Change the initial workspace path to ~/Library/Application Support/SvoyBloknot on macOS https://github.com/siyuan-note/siyuan/issues/17095
        defaultWorkspace = path.join(decodeURIComponent(getSearch("home")), "Library", "Application Support", "SvoyBloknot");
    }
    if (!fs.existsSync(defaultWorkspace)) {
        fs.mkdirSync(defaultWorkspace, {mode: 0o755, recursive: true});
    }

    const result = await ipcRenderer.invoke("siyuan-get", {
        cmd: "showOpenDialog",
        defaultPath: defaultWorkspace,
        properties: ["openDirectory", "createDirectory"],
    });

    if (result.canceled) {
        return null;
    }
    const initPath = result.filePaths[0];

    if (isPartitionRootPath(initPath)) {
        alert(langData.msgPartitionRoot);
        return null;
    }
    if (!isWorkspaceDir(initPath) && !isEmptyDir(initPath)) {
        alert(langData.msgNotEmpty);
        return null;
    }
    if (isICloudPath(initPath)) {
        alert(langData.msgICloud);
        return null;
    }
    if (isCloudDrivePath(initPath)) {
        alert(langData.msgCloudDrive);
        return null;
    }
    if (!confirm(langData.msgConfirm)) {
        return null;
    }
    if (!fs.existsSync(initPath)) {
        fs.mkdirSync(initPath, {mode: 0o755, recursive: true});
    }
    return initPath;
};

// 窗口通用初始化：macOS body class、关闭/最小化按钮 IPC
const initWindowChrome = () => {
    const {ipcRenderer} = require("electron");
    if ("darwin" === process.platform) {
        document.body.classList.add("darwin");
    }
    document.getElementById("close").addEventListener("click", () => {
        ipcRenderer.send("siyuan-first-quit");
    });
    document.getElementById("min").addEventListener("click", () => {
        ipcRenderer.send("siyuan-cmd", "minimize");
    });
};

window.getSearch = getSearch;
window.I18N_BASE = I18N_BASE;
window.applyLang = applyLang;
window.currentLang = currentLang;
window.isPartitionRootPath = isPartitionRootPath;
window.isEmptyDir = isEmptyDir;
window.isWorkspaceDir = isWorkspaceDir;
window.isCloudDrivePath = isCloudDrivePath;
window.isICloudPath = isICloudPath;
window.simpleCheckIcloudPath = simpleCheckIcloudPath;
window.walk = walk;
window.chooseWorkspacePath = chooseWorkspacePath;
window.initWindowChrome = initWindowChrome;
