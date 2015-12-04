var expect = require("chai").expect;
var MoodleExporter = require('../../MoodleExporter');
var xml2js = require('xml2js');

describe('MoodleExporter', function() {
	var seed = 'abcd1234';

	describe('generateMoodleXML(questionType, count, questionName)', function() {

		describe('throwing errors', function() {

			describe('unimplemented questionType', function() {

				it('should throw an error.', function() {
					expect(function(){MoodleExporter.generateMoodleXML('someRandomQuestionType', 1, 'Question Name', seed)})
					.to.throw(Error);
				});

			});

			describe('invalid seed', function() {

				it("should throw an error", function() {
					expect(function() { MoodleExporter.generateMoodleXML('mc-change-of-base', 1, 'Question Name', '1234');})
					.to.throw(Error);
				});

			});
		});

		describe('successful conversion', function() {
			var xmlResult, xmlString;
			var questionType, count, questionName;


			describe('general requirements', function() {

				beforeEach(function(done) {
					questionType = 'mc-change-of-base';
					count = 2;
					questionName = 'Sample Question Name';

					var qd = {
					    "version" : "0.1",
					    "questions": [{
						    "question": questionType,
						    "repeat": count,
						}]
					};

					xmlString = MoodleExporter.generateMoodleXML(qd, seed);
					xml2js.parseString(xmlString, function (err, result) {
						xmlResult = result;
						done();
					});
				});

				describe('xml quiz tag', function() {
					it('should set the quiz tag', function() {
						expect(xmlResult.quiz).to.exist;
					});
				});

				describe('xml question', function() {
					it('should have the # of questions specified by the count parameter', function() {
						expect(xmlResult.quiz.question.length).to.equal(count);
					});
				});
			});


			describe('different formats', function() {

				describe('multiple choice format', function() {

					beforeEach(function(done) {
						questionType = 'mc-change-of-base';
						count = 2;
						questionName = 'Sample Question Name';

						var qd = {
						    "version" : "0.1",
						    "questions": [{
							    "question": questionType,
							    "repeat": count,
							}]
						};
						xmlString = MoodleExporter.generateMoodleXML(qd, seed);
						xml2js.parseString(xmlString, function (err, result) {
							xmlResult = result;
							done();
						});
					});

					describe('xml question type', function() {
						it('should have set the question type attribute to multichoice', function() {
							for (var i = 0; xmlResult.quiz.question.length > i; i++)
								expect(xmlResult.quiz.question[i].$.type).to.equal('multichoice');
						});
					});
				});

				describe('input format', function() {

					beforeEach(function(done) {
						questionType = 'fr-change-of-base';
						count = 2;
						questionName = 'Sample Question Name';
						var qd = {
						    "version" : "0.1",
						    "questions": [{
							    "question": questionType,
							    "repeat": count,
							}]
						};
						xmlString = MoodleExporter.generateMoodleXML(qd, seed);
						xml2js.parseString(xmlString, function (err, result) {
							xmlResult = result;
							done();
						});
					});

					describe('xml question type property', function() {

						it('should have set the question type attribute to shortanswer', function() {
							for (var i = 0; xmlResult.quiz.question.length > i; i++)
								expect(xmlResult.quiz.question[i].$.type).to.equal('shortanswer');
						});

					});

					describe('question.answer.text', function() {

						it('should exist', function() {
							expect(xmlResult.quiz.question[0].answer[0].text).to.exist;
						});

					});
				});
			});

		});

	});
});















