export class FakeService {
  public fileMiddlewareCalled = false;
  public postMiddlewareCalled = false;
  public questionErrorMiddlewareCalled = false;
  public questionMiddlewareCalled = false;
  public videoMiddlewareCalled = false;

  public fileMiddleware() {
    this.fileMiddlewareCalled = true;
    console.log('fake service!');
  }

  public postMiddleware() {
    this.postMiddlewareCalled = true;
    console.log('fake service!');
  }

  public questionErrorMiddleware() {
    this.questionErrorMiddlewareCalled = true;
    console.log('fake service!');
  }

  public questionMiddleware() {
    this.questionMiddlewareCalled = true;
    console.log('fake service!');
  }

  public reset() {
    this.fileMiddlewareCalled = false;
    this.videoMiddlewareCalled = false;
    this.questionMiddlewareCalled = false;
    this.questionErrorMiddlewareCalled = false;
    this.postMiddlewareCalled = false;
  }

  public videoMiddleware() {
    this.videoMiddlewareCalled = true;
    console.log('fake service!');
  }
}

export const defaultFakeService = new FakeService();
