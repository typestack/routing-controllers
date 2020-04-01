export class FakeService {
    fileMiddlewareCalled = false;
    videoMiddlewareCalled = false;
    questionMiddlewareCalled = false;
    questionErrorMiddlewareCalled = false;
    postMiddlewareCalled = false;

    fileMiddleware() {
        this.fileMiddlewareCalled = true;
    }

    videoMiddleware() {
        this.videoMiddlewareCalled = true;
    }

    questionMiddleware() {
        this.questionMiddlewareCalled = true;
    }

    questionErrorMiddleware() {
        this.questionErrorMiddlewareCalled = true;
    }

    postMiddleware() {
        this.postMiddlewareCalled = true;
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
