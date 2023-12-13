class FileTooLarge extends Error {
    constructor(message) {
      super(message);
      this.name = 'FileTooLarge';
      this.statusCode = 413; 
    }
  }
  
export default FileTooLarge;
  