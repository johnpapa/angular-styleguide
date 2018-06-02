'use strict';

import * as assert from 'assert';
import { Context } from 'egg';
import { app } from 'egg-mock/bootstrap';

describe('test/app/service/News.test.js', () => {
  let ctx: Context;

  before(() => {
    ctx = app.mockContext();
  });

  it('getTopStories', async () => {
    const list = await ctx.service.news.getTopStories();
    assert(list.length === 30);
  });

  it('getItem', async () => {
    const item = await ctx.service.news.getItem(1);
    assert(item.id && item.title && item.url);
  });
});
