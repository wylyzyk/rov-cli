import Command from "@rovls/command";
import { getGitPlatform, Github, log, makeInput, makeList } from "@rovls/utils";

const NEXT_PAGE = "next_page";
const PREV_PAGE = "prev_page";

class InstallCommand extends Command {
  get command () {
    return 'install'
  }

  get description () {
    return 'install project'
  }

  get options () {
  }

  async action () {
    await this.generateGitAPI();
    await this.searchGitAPI();
  }

  async generateGitAPI () {
    let platform = getGitPlatform();
    if (!platform) {
      platform = await makeList({
        message: "请选择 Git 平台",
        choices: [
          { name: "github", value: "github" },
          { name: "gitee", value: "gitee" }
        ]
      })
    }
    log.verbose('platform', platform)
    let gitAPI;
    if (platform === 'github') {
      gitAPI = new Github();
    } else {
      // gitAPI = new Gitee();
    }
    gitAPI.savePlatform(platform)
    await gitAPI.init()
    this.gitAPI = gitAPI;
  }

  async searchGitAPI () {
    // 1. 生成搜索关键词和开发语言
    this.q = await makeInput({
      message: "请输入搜索关键词",
      validate (val) {
        if (val.length > 0) {
          return true
        }
        return '请输入搜索关键词'
      }
    })
    this.language = await makeInput({
      message: "请输入开发语言"
    })
    log.verbose('params', this.q, this.language, this.gitAPI.getPlatform())
    this.page = 1
    this.perPage = 10
    await this.doSearch()
  }

  async doSearch () {
    let searchResult = null;
    let count = null;
    let list = null;
    const platform = this.gitAPI.getPlatform()
    if (platform === 'github') {
      // 生成搜索参数
      const params = {
        q: `${ this.q }+language:${ this.language ? this.language : '' }`,
        order: "desc",
        sort: "stars",
        per_page: 5,
        page: this.page
      }
      searchResult = await this.gitAPI.searchRepo(params)
      count = searchResult.total_count;
      list = searchResult.items.map(item => ({
        name: `${ item.full_name }(${ item.description })`,
        value: item.full_name
      }));
    }
    // 判断当前页是否达到最大页数
    if (this.page * this.perPage < count) {
      list?.push({
        name: "下一页",
        value: NEXT_PAGE
      })
    }
    if (this.page > 1) {
      list?.unshift({
        name: "上一页",
        value: PREV_PAGE
      })
    }
    const keyword = await makeList({
      message: `请选择要下载的项目, 共${ count }条数据`,
      choices: list
    })

    if (keyword === NEXT_PAGE) {
      await this.nextPage()
    } else if (keyword === PREV_PAGE) {
      await this.prevPage()
    } else {
      // 下载项目
    }
  }

  async nextPage () {
    this.page++;
    await this.doSearch()
  }

  async prevPage () {
    this.page--;
    await this.doSearch()
  }
}

function Install (instance) {
  return new InstallCommand(instance)
}

export default Install;
