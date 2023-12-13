class FileTooLarge extends Error {
    constructor(message) {
      super(message);
      this.name = 'FileTooLarge';
      this.statusCode = 423; 
    }
  }
  
  module.exports = FileTooLarge;
  