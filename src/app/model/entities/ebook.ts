export default class Ebook {
    id: number;
    title: string;
    author: string;
    description: string;
    coverImage: string;
    fileType: FileType; // Enum para indicar o tipo de arquivo (PDF, EPUB, etc.)
    file: File; // Representação do arquivo (PDF, EPUB, etc.)
    pageCount: number;
    favorite: boolean;
    progress: number;
    ownerId: number; // ID do usuário que possui o eBook
    collectionId?: number; // ID opcional da coleção à qual o eBook pertence

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
        collectionId?: number
    ) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.description = description;
        this.coverImage = coverImage;
        this.fileType = fileType;
        this.file = file;
        this.pageCount = pageCount;
        this.favorite = favorite;
        this.progress = progress;
        this.ownerId = ownerId;
        this.collectionId = collectionId;
    }
}

// Enum para os tipos de arquivo suportados
export enum FileType {
    PDF = 'pdf',
    EPUB = 'epub',
    MOBI = 'mobi'
}
