class CorruptedFile extends Error {
    constructor(message) {
      super(message);
      this.name = 'CorruptedFile';
      this.statusCode = 500;
    }
  }

export default CorruptedFile;
  