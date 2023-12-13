class CorruptedFile extends Error {
    constructor(message) {
      super(message);
      this.name = 'CorruptedFile';
      this.statusCode = 500;
    }
  }
  
  module.exports = CorruptedFile;
  