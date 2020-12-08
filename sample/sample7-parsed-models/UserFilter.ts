export class UserFilter {
  keyword: string;

  hasKeyword(): boolean {
    return this.keyword && this.keyword.length > 2;
  }
}
