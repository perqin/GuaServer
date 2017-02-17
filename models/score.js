/**
 * Created by perqin on 17-2-11.
 */

var mongoose = require('mongoose');
var scoreSchema = mongoose.Schema({
    studentId: {
        type: String
    },
    courseId: {
        type: String
    },
    courseName: {
        type: String
    },
    score: {
        type: String
    },
    revealDate: {
        type: Date
    }
});
var Score = mongoose.model('Score', scoreSchema);
module.exports = Score;
