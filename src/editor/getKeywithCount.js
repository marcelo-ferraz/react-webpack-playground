import path, { extname } from 'path';

export default function getKeyWithCount(obj, path, extension = '', count = 0) {
    let ext = extension;
    let key = path;

    if (!ext) {
        extension = extname(path) || '';
        key = key.substring(0, path.length - ext.length);
    }

    const keyWithCount = count ? `${key}(${count})${ext}` : `${key}${ext}`;
    if (obj[keyWithCount] !== null && obj[keyWithCount] !== undefined) {
        return getKeyWithCount(obj, key, ext, count + 1);
    }
    return keyWithCount;
}
