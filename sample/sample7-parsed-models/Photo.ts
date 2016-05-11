export class Photo {

    id: number;

    url: string;

    isUrlEmpty() {
        return !this.url;
    }

}
