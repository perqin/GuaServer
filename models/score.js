/**
 * Created by perqin on 17-2-11.
 */

var mongoose = require('mongoose');
var scoreSchema = mongoose.Schema({
    student_id: {
        type: String
    },
    course_id: {
        type: String
    },
    course_name: {
        type: String
    },
    score: {
        type: String
    },
    reveal_date: {
        type: Date
    }
});
var Score = mongoose.model('Score', scoreSchema);
module.exports = Score;
