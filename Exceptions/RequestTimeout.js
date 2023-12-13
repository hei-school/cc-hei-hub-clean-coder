class RequestTimeout extends Error {
    constructor(message) {
      super(message);
      this.name = 'RequestTimeout';
      this.statusCode = 408; 
    }
  }
  
export default RequestTimeout;
  