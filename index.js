var moodleExporter = require('./MoodleExporter');
var quizBuilder = require('./quizBuilder');

module.exports.list = function (type) {
	var listers = {
		'questionType': function () {
			return quizBuilder.questionTypes;
		}
	};
	if (!(type in listers)) {
		throw 'Illegal Argument: ' + type;
	}
	return listers[type]();
}

module.exports.check = function(type, value) {
	var checkers = {
		'seed': function () {
		    return true;
		},
		'questionType': function (v) {
		    return v in quizBuilder.questionTypes;
		}
	};
	if (!(type in checkers)) {
		throw 'Illegal Argument: ' + type;
	}
	return checkers[type](value);
}

module.exports.generate = function(type, qd, seed) {
	var formatters = {
	    'json': JSON.stringify,
	    'moodleXML': moodleExporter.generateMoodleXML
	};
	if (!(type in formatters)) {
		throw 'Illegal Argument: ' + type;
	}
	return formatters[type](quizBuilder.build(JSON.parse(qd), seed));
}

module.exports.validate = function(type, value) {
	var validators = {
		'qd': quizBuilder.validateQuizDescriptor
	};
	if (!(type in validators)) {
		throw 'Illegal Argument: ' + type;
	}
	return validators[type](JSON.parse(value));
}








