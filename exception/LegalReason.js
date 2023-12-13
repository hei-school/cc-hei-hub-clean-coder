class LegalReason extends Error {
    constructor(message) {
      super(message);
      this.name = 'LegalReason';
      this.statusCode = 451; 
    }
  }
  
export default LegalReason;
  