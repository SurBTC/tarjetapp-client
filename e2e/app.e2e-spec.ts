import { TestBootPage } from './app.po';

describe('test-boot App', function() {
  let page: TestBootPage;

  beforeEach(() => {
    page = new TestBootPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
