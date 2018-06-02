import { Controller } from 'egg';

export default class NewsController extends Controller {
  public async list() {
    const { ctx, app } = this;
    const pageSize = app.config.news.pageSize;
    const page = parseInt(ctx.query.page, 10) || 1;

    const idList = await ctx.service.news.getTopStories(page);

    // get itemInfo parallel
    const newsList = await Promise.all(idList.map((id) => ctx.service.news.getItem(id)));
    await ctx.render('news/list.tpl', { list: newsList, page, pageSize });
  }

  public async detail() {
    const { ctx } = this;
    const id = ctx.params.id;
    const newsInfo = await ctx.service.news.getItem(id);
    // get comment parallel
    const commentList = await Promise.all(newsInfo.kids.map((_id) => ctx.service.news.getItem(_id)));
    await ctx.render('news/detail.tpl', { item: newsInfo, comments: commentList });
  }

  public async user() {
    const { ctx } = this;
    const id = ctx.params.id;
    const userInfo = await ctx.service.news.getUser(id);
    await ctx.render('news/user.tpl', { user: userInfo });
  }
}
