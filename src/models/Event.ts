import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEvent extends Document {
  eventName: string;
  date: Date;
  location: string;
  eventType: 'Festival' | 'Public Gathering' | 'Government Event' | 'Community Event';
  description?: string;
  villageCode?: string;
  postOfficeCode?: string;
  district: string;
  scrapedSource: string;
}

const EventSchema: Schema = new Schema({
  eventName: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  eventType: { type: String, enum: ["Festival", "Public Gathering", "Government Event", "Community Event"], required: true },
  description: { type: String },
  villageCode: { type: String },
  postOfficeCode: { type: String },
  district: { type: String, required: true },
  scrapedSource: { type: String, required: true }
});

EventSchema.index({ date: 1 });
EventSchema.index({ villageCode: 1 });
EventSchema.index({ district: 1 });

const Event: Model<IEvent> =
  mongoose.models.Event ||
  mongoose.model<IEvent>('Event', EventSchema, 'events');

export default Event;
