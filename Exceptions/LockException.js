class LockException extends Error {
    constructor(message) {
      super(message);
      this.name = 'LockException';
      this.statusCode = 423; 
    }
  }
  
export default LockException;
  