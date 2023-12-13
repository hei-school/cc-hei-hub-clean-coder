class NotAuthorized extends Error {
    constructor(message) {
      super(message);
      this.name = 'NotAuthorized';
      this.statusCode = 401; 
    }
  }
  
export default NotAuthorized;
  