import GitServer from "./GitServer.js";
import { http } from '../index.js'

class Github extends GitServer {
  constructor () {
    super();
  }

  /**
   * 搜索仓库
   */
  async searchRepo (data) {
    return await http('search/repositories', {
      data,
      token: this.token
    })
  }

  /**
   * 搜索tags
   */
  async searchTags (fullName) {
    return await http(`repos/${fullName}/tags`, {})
  }
}

export default Github;
