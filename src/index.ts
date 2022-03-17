import express from "express";
import mongoose from "mongoose"
import { PORT, MONGO_URI } from "./config";
import { addQuestions, addTopics } from "./AddData"
import { getQuestions } from "./TopicController";

// starts main server
const startServer = async () => {
  const app = express()
  try {
    await mongoose.connect(MONGO_URI)
    console.log('DB Connected...')
  } catch (error) {
    console.log(error)
  }
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use('/search',getQuestions)
  app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`)
  })
}

startServer()