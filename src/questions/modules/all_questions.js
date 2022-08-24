import genericQuestions from './genericQuestions.js';
import app from './app.js';
import apk from './apk.js';

const all_questions = {
    getAllQuestions(){
        return [
            genericQuestions,
            app,
            apk,
        ]
    }
}
const {
    getAllQuestions
} = all_questions;

export { getAllQuestions };
export default all_questions;