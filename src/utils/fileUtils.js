import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';

export const convertFilePath = async (path) => {
  try {
    if (path.startsWith('data:')) {
      return path;
    }

    if (path.startsWith('file://') && Capacitor.isNativePlatform()) {
      return Capacitor.convertFileSrc(path);
    }

    let directory;
    let pathToUse = path;

    if (path.startsWith('file://')) {
      pathToUse = path.replace('file://', '');
      directory = undefined;
    } else if (path.startsWith('/')) {
      directory = undefined;
    } else {
      directory = Directory.Documents;
    }

    console.log(
      `Reading file from path: ${pathToUse} with directory: ${directory || 'undefined'}`
    );

    // Read the file
    const result = await Filesystem.readFile({
      path: pathToUse,
      directory,
    });

    // Return as data URL
    const fileExtension = path.split('.').pop().toLowerCase();
    let mimeType;

    switch (fileExtension) {
      case 'pdf':
        mimeType = 'application/pdf';
        break;
      case 'epub':
        mimeType = 'application/epub+zip';
        break;
      default:
        mimeType = 'application/octet-stream';
    }

    return `data:${mimeType};base64,${result.data}`;
  } catch (error) {
    console.error('Error converting file path:', error);
    throw error;
  }
};

export const getFileAsBlob = async (path) => {
  try {
    if (Capacitor.isNativePlatform() && path.startsWith('file://')) {
      const webViewPath = Capacitor.convertFileSrc(path);
      const response = await fetch(webViewPath);
      return await response.blob();
    }

    const dataUrl = await convertFilePath(path);
    const response = await fetch(dataUrl);
    return await response.blob();
  } catch (error) {
    console.error('Error getting file as blob:', error);
    throw error;
  }
};

export const listFiles = async (
  directoryPath = 'books',
  dir = Directory.Documents
) => {
  try {
    const result = await Filesystem.readdir({
      path: directoryPath,
      directory: dir,
    });
    return result.files;
  } catch (error) {
    console.error('Error listing files:', error);
    return [];
  }
};
