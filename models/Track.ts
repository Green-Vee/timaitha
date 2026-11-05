import { Schema, model, models } from "mongoose";

export interface ITrack {
  _id?: string;
  title: string;
  artist: string;
  genre?: string;
  coverUrl: string;
  audioUrl: string;
  duration?: number;
  downloadCount: number;
  createdAt: Date;
}

const TrackSchema = new Schema<ITrack>({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  genre: { type: String, default: "General" },
  coverUrl: { type: String, required: true },
  audioUrl: { type: String, required: true },
  duration: { type: Number, default: 0 },
  downloadCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default models.Track || model<ITrack>("Track", TrackSchema);
