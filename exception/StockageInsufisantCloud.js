class StockageInsuffisantCloud extends Error {
    constructor(message) {
      super(message);
      this.name = 'StockageInsuffisantCloud';
      this.statusCode = 507; 
    }
  }
  
  module.exports = StockageInsuffisantCloud;
  