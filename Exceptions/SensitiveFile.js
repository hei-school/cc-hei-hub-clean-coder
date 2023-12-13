class SensitiveFile extends Error {
    constructor(message) {
      super(message);
      this.name = 'SensitiveFile';
      this.statusCode = 403; 
    }
  }
  
export default SensitiveFile;
  