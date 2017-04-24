import { WebpagePage } from './app.po';

describe('webpage App', function() {
  let page: WebpagePage;

  beforeEach(() => {
    page = new WebpagePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
