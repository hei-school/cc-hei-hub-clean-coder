class TooManyRequests extends Error {
    constructor(message) {
      super(message);
      this.name = 'TooManyRequests';
      this.statusCode = 429; 
    }
  }
  
  module.exports = TooManyRequests;
  