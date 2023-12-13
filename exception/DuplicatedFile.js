class DuplicatedFile extends Error {
    constructor(message) {
      super(message);
      this.name = 'DuplicatedFile';
      this.statusCode = 400; 
    }
  }
  
export default DuplicatedFile;
  