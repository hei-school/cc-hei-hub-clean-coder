class StorageInsufficientCloud extends Error {
    constructor(message) {
      super(message);
      this.name = 'StockageInsuffisantCloud';
      this.statusCode = 507; 
    }
  }
  
export default StorageInsufficientCloud;
  