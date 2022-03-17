import { Request, Response, NextFunction } from "express";
import { getRecord } from "./AddData";
import { Topic } from "./TopicModel";

export const getParentIndexSetRight = async (row: number, column: number) => {
  if (column < 1) {
    const parent = await Topic.findById("Biology")
    if (parent !== null) {
      return parent.right;
    }
  }
  const topic = getRecord(row,column)
  const parent = await Topic.findById(topic)
  if (parent !== null) {
    return parent.right;
  }
  return -1;
}

export const addTopicHelper = async (row:number, column: number) => {
  let parentRight = await getParentIndexSetRight(row,column-1)
  if (parentRight == -1) {
    await addTopicHelper(row,column-1)
  }
  parentRight = await getParentIndexSetRight(row,column-1)
  const topic = getRecord(row,column)
  await addTopic(topic, parentRight)
}

export const addTopic = async (topic: string, parentRight: number) => {
  console.log("Adding Topic: " + topic)
  const existingTopic = await Topic.findById(topic)
  if (existingTopic == null) {
    await Topic.updateMany({ right: {$gte: parentRight}}, { $inc : { 'right' : 2 }})
    await Topic.updateMany({ left: {$gt: parentRight}}, { $inc : { 'left' : 2 }})
    await Topic.create({
      _id: topic,
      left: parentRight,
      right: parentRight + 1,
      questions: []
    })
  }
}

export const addQuestion = async (topic: string, quesNum: number) => {
  const existingTopic = await Topic.findById(topic)
  if (existingTopic != null) {
    await Topic.updateOne({_id: topic }, { $push : { questions: quesNum }})
    console.log("Added Question Number: " + quesNum + " to topic: " + topic)
    return
  }
  console.log("Cannot add Question Number: " + quesNum + " to topic: " + topic)
}

export const getQuestions = async (req: Request, res: Response, next: NextFunction) => {
  let topic = req.query.q
  topic = topic.toString().trim()
  if(topic) {
    const existingTopic = await Topic.findById(topic)
  if (existingTopic !== null) {
    let questions: Array<number> = [];
    questions.push(...existingTopic.questions)
    const topics = await Topic.find({ left: { $gt: existingTopic.left }, right: {$lt: existingTopic.right }}, { questions: 1, _id: 0})
    topics.forEach(top => {
      questions.push(...top.questions)
    })
    questions = [...new Set(questions)]
    questions.sort(function(a, b){return a-b});
    return res.status(200).json(questions)
  }
  return res.status(400).json({"message": "Topic not found"})
  }
  return res.status(400).json({"message": "No Query"})
}