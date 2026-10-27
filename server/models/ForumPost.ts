import mongoose, { Schema, Document } from 'mongoose';

export interface IComment {
  id: string;
  authorName: string;
  authorRole: string;
  content: string;
  isExpert: boolean;
  createdAt: Date;
}

export interface IForumPost extends Document {
  author: mongoose.Types.ObjectId;
  authorName: string;
  authorRole: string;
  authorRegion?: string;
  title: string;
  content: string;
  cropCategory: string;
  tags: string[];
  likes: number;
  likedBy: string[];
  comments: IComment[];
  createdAt: Date;
}

const ForumPostSchema = new Schema<IForumPost>({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  authorName: { type: String, required: true },
  authorRole: { type: String, default: 'farmer' },
  authorRegion: { type: String, default: '' },
  title: { type: String, required: true },
  content: { type: String, required: true },
  cropCategory: { type: String, required: true },
  tags: [{ type: String }],
  likes: { type: Number, default: 0 },
  likedBy: [{ type: String }],
  comments: [
    {
      id: { type: String, required: true },
      authorName: { type: String, required: true },
      authorRole: { type: String, default: 'farmer' },
      content: { type: String, required: true },
      isExpert: { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export const ForumPost = mongoose.models.ForumPost || mongoose.model<IForumPost>('ForumPost', ForumPostSchema);
