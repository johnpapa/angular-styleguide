'use strict';

import * as cheerio from 'cheerio';
import { app, assert } from 'egg-mock/bootstrap';

describe('test/app/controller/news.test.ts', () => {
  it('should GET /news', async () => {
    const result = await app.httpRequest().get('/news').expect(200);
    const $ = cheerio.load(result.text);
    const listItem = $('.news-view .item');
    assert(listItem.length === app.config.news.pageSize);
  });

  it('should GET /news/item/:id', async () => {
    await app.httpRequest()
    .get('/news/item/1')
    // just a example, use regex to test part of dom string, but should be strong characteristic
    .expect(/\/news\/item\/1/)
    .expect(200);
  });

  it('should GET /news/user/:id', async () => {
    await app.httpRequest()
    .get('/news/user/activatedgeek')
    // just a example, use regex to test part of dom string, but should be strong characteristic
    .expect(/<span class="label">user:<\/span> activatedgeek/)
    .expect(200);
  });
});
