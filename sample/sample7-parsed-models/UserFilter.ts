export class UserFilter {
  public keyword: string;

  public hasKeyword(): boolean {
    return this.keyword && this.keyword.length > 2;
  }
}
