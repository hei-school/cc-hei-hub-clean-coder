class NotImplemented extends Error {
    constructor(message) {
      super(message);
      this.name = 'NotImplemented';
      this.statusCode = 501; 
    }
  }
  
  module.exports = NotImplemented;
  