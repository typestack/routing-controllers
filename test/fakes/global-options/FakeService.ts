export class FakeService {
    fileMiddlewareCalled = false;
    videoMiddlewareCalled = false;
    questionMiddlewareCalled = false;
    questionErrorMiddlewareCalled = false;
    postMiddlewareCalled = false;

    fileMiddleware(): void {
        this.fileMiddlewareCalled = true;
    }

    videoMiddleware(): void {
        this.videoMiddlewareCalled = true;
    }

    questionMiddleware(): void {
        this.questionMiddlewareCalled = true;
    }

    questionErrorMiddleware(): void {
        this.questionErrorMiddlewareCalled = true;
    }

    postMiddleware(): void {
        this.postMiddlewareCalled = true;
    }

    reset(): void {
        this.fileMiddlewareCalled = false;
        this.videoMiddlewareCalled = false;
        this.questionMiddlewareCalled = false;
        this.questionErrorMiddlewareCalled = false;
        this.postMiddlewareCalled = false;
    }
}

export const defaultFakeService = new FakeService();
