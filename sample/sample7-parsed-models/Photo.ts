export class Photo {
  public id: number;

  public url: string;

  public isUrlEmpty() {
    return !this.url;
  }
}
