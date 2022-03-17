import mongoose, { Schema, Document } from "mongoose";

interface TopicDoc extends Document {
  _id: string,
  left: number,
  right: number,
  questions: [number]
}

const TopicsSchema = new Schema({
  _id: {
    type: String,
    required: true
  },
  left: {
    type: Number,
    required: true
  },
  right: {
    type: Number,
    required:true
  },
  questions: [
    {
      type: Number
    }
  ]
},{
  toJSON: {
    transform(doc, ret) {
      delete ret.__v
      delete ret.createdAt
      delete ret.updatedAt
    }
  },
  timestamps: true
})

const Topic = mongoose.model<TopicDoc>('Topics', TopicsSchema)

export { Topic }