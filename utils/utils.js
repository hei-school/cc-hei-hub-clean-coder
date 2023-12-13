export const isValidFilename = (filename) => {
    const validFilenameRegex = /^[a-zA-Z0-9-_]+$/;
    return validFilenameRegex.test(filename);
  };