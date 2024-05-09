export default class Ebook {
  id: number;
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

  constructor(
    id: number,
    title: string,
    author: string,
    description: string,
    coverImage: string,
    fileType: FileType,
    file: File,
    pageCount: number,
    favorite: boolean,
    progress: number,
    ownerId: number,
    filePath: string,
    fileUrl: string,
    collectionId?: number
  ) {
    this.id = id;
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
  }
}
export enum FileType {
  PDF = 'pdf',
  EPUB = 'epub',
  MOBI = 'mobi'
}
