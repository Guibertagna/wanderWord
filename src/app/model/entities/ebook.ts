export default class Ebook {
  docId: string;
  title: string;
  author: string;
  description: string;
  coverImage: string;
  fileType: FileType;
  file: File;
  pageCount: number;
  favorite: boolean;
  progress: number;
  collectionId?: number;
  filePath: string;
  fileUrl: string;
  ownerId : string;

  constructor(
    docId: string,
    title: string,
    author: string,
    description: string,
    coverImage: string,
    fileType: FileType,
    file: File,
    pageCount: number,
    favorite: boolean,
    progress: number,
    ownerId: string,
    filePath: string,
    fileUrl: string,
    collectionId?: number
  ) {
    this.docId = docId
    this.title = title;
    this.author = author;
    this.description = description;
    this.coverImage = coverImage; // Inicializar a propriedade coverImage
    this.fileType = fileType;
    this.file = file;
    this.pageCount = pageCount;
    this.favorite = favorite;
    this.progress = progress;
    this.filePath = filePath;
    this.fileUrl = fileUrl;
    this.collectionId = collectionId;
    this.ownerId = ownerId;
  }
}
export enum FileType {
  PDF = 'pdf',
  EPUB = 'epub',
  MOBI = 'mobi'
}

