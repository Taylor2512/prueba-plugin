export type CommentAnchor = {
  x: number;
  y: number;
};

export type PdfCommentReply = {
  id: string;
  authorId?: string | null;
  authorName?: string | null;
  authorColor?: string | null;
  text: string;
  createdAt: number;
  resolved?: boolean;
};

export type PdfComment = {
  id: string;
  fileId?: string | null;
  pageNumber?: number;
  anchor: CommentAnchor;
  fieldId?: string | null;
  schemaUid?: string | null;
  authorId?: string | null;
  authorName?: string | null;
  authorColor?: string | null;
  text: string;
  createdAt: number;
  resolved: boolean;
  replies: PdfCommentReply[];
};

export type TopLevelPdfCommentEntry = {
  id: string;
  anchor: PdfComment['anchor'] & {
    id?: string;
    fileId?: string | null;
    pageNumber?: number;
    fieldId?: string | null;
    schemaUid?: string | null;
    authorId?: string | null;
    authorName?: string | null;
    authorColor?: string | null;
    resolved?: boolean;
  };
  comment: PdfComment;
};
