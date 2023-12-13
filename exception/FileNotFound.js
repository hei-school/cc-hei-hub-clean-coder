class FileNotFound extends Error {
    constructor(message) {
      super(message);
      this.name = 'FileNotFound';
      this.statusCode = 404; 
    }
  }
  
  module.exports = FileNotFound;
  