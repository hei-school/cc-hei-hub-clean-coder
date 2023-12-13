class FilenameInvalid extends Error {
    constructor(message) {
      super(message);
      this.name = 'FilenameInvalid';
      this.statusCode = 400; 
    }
  }
  
  module.exports = FilenameInvalid;
  