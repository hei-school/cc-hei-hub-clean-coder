class ServerDown extends Error {
    constructor(message) {
      super(message);
      this.name = 'ServerDown';
      this.statusCode = 504; 
    }
  }
  
export default ServerDown;
  