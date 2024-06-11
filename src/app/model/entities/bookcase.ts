export default class Bookcase {
  bookcasename: string;
  books: string[];
  userId: string;
  docId?: string;

  constructor(bookcasename: string, userId: string) {
    this.bookcasename = bookcasename;
    this.books = [];
    this.userId = userId;
  }
}
