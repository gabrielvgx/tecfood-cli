import genericQuestions from './genericQuestions.js';
import algoritmo from './algoritmo.js';
import app from './app.js';
import apk from './apk.js';
import basedev from './basedev.js';
import birt from './birt.js';
import mongo from './mongo.js';

const all_questions = {
    getAllQuestions(){
        return [
            genericQuestions,
            app,
            apk,
            algoritmo,
            basedev,
            birt,
            mongo
        ]
    }
}
const {
    getAllQuestions
} = all_questions;

export { getAllQuestions };
export default all_questions;