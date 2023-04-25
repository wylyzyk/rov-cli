import GitServer from "./GitServer.js";
import { http } from '../index.js'

class Github extends GitServer {
  constructor () {
    super();
  }

  async searchRepo (data) {
    return await http('search/repositories', {
      data,
      token: this.token
    })
  }
}

export default Github;
