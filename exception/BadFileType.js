class BadFileType extends Error {
    constructor(message) {
      super(message);
      this.name = 'BadFileType';
      this.statusCode = 400; 
    }
  }
  
export default BadFileType;
  