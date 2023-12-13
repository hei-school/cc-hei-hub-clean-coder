export const isValidFilename = (filename) => {
    const validFilenameRegex = /^[0-9]*$/;
    return validFilenameRegex.test(filename);
  };