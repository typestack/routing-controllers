export class FakeService {
  fileMiddlewareCalled = false;
  videoMiddlewareCalled = false;
  questionMiddlewareCalled = false;
  questionErrorMiddlewareCalled = false;
  postMiddlewareCalled = false;

  fileMiddleware() {
    this.fileMiddlewareCalled = true;
    console.log('fake service!');
  }

  videoMiddleware() {
    this.videoMiddlewareCalled = true;
    console.log('fake service!');
  }

  questionMiddleware() {
    this.questionMiddlewareCalled = true;
    console.log('fake service!');
  }

  questionErrorMiddleware() {
    this.questionErrorMiddlewareCalled = true;
    console.log('fake service!');
  }

  postMiddleware() {
    this.postMiddlewareCalled = true;
    console.log('fake service!');
  }

  reset() {
    this.fileMiddlewareCalled = false;
    this.videoMiddlewareCalled = false;
    this.questionMiddlewareCalled = false;
    this.questionErrorMiddlewareCalled = false;
    this.postMiddlewareCalled = false;
  }
}

export const defaultFakeService = new FakeService();
