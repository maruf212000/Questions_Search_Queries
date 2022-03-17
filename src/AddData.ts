import { addQuestion, addTopic, addTopicHelper, getParentIndexSetRight } from "./TopicController";
var TopicsArray;
var QuestionsArray;

// returns particular feild from Questions and Topics - Topics.csv file
export const getRecord = (row: number, column: number) => {
  return TopicsArray[row][column];
}


// Add all the topics to database from Questions and Topics - Topics.csv file
export const addTopics = async () => {
  var fs = require('fs'); 
  var { parse } = require('csv-parse');
  var parser = parse({columns: true}, async function (err, rec) {
    TopicsArray = rec;
    TopicsArray.forEach( obj => {
      Object.keys(obj).forEach(k => {
        obj[k] = obj[k].trim();
        if(obj[k] == '') {
          delete obj[k]
        }
      })
    })

    const startTime = new Date();
    console.log("Start Time: " + startTime)
    await addTopic("Biology", 1)
    for (var index in TopicsArray) {
      const length = Object.keys(TopicsArray[index]).length
      let i = 1;
      await addTopicHelper(parseInt(index), length)
    }
    const endTime = new Date()
    console.log("End Time: " + endTime)
    console.log("Total Time Taken: " + (endTime.valueOf() - startTime.valueOf()))
  });
  fs.createReadStream(__dirname+'/Questions and Topics - Topics.csv').pipe(parser);
}


// Add all the questions to database from Questions and Topics - Questions.csv file
export const addQuestions = async () => {
  var fs = require('fs'); 
  var { parse } = require('csv-parse');
  var parser = parse({columns: true}, async function (err, rec) {
    QuestionsArray = rec
    QuestionsArray.forEach( obj => {
      Object.keys(obj).forEach(k => {
        obj[k] = obj[k].trim();
        if(obj[k] == '') {
          delete obj[k]
        }
      })
    })
    for (let index in QuestionsArray) {
      const length = Object.keys(QuestionsArray[index]).length
      for (let ind = 1;ind<length;ind++) {
        await addQuestion(QuestionsArray[index][ind], QuestionsArray[index][0])
      }

    }
  });
  fs.createReadStream(__dirname+'/Questions and Topics - Questions.csv').pipe(parser);
}