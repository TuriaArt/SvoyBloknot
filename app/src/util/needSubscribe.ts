export const needSubscribe = (tip?: string) => {
    // SiYuan-Tu: форк без привязки к официальной подписке/облаку SiYuan — никогда не блокируем и не показываем нагов об оплате.
    return false;
};

/**
 * 判断是否可以使用第三方同步
 * SiYuan-Tu: сторонняя синхронизация (S3/WebDAV/локальная) всегда разрешена, без подписки.
 */
export const isPaidUser = () => {
    return true;
};
