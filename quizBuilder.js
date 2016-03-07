var Randomizer = require('./randomizer');

var questionModules = [
    require('./sample-paq'),
    //require('../paq-change-of-base'),
    //require('paq-fr-change-of-base'),
    //require('paq-mc-change-of-base'),
];

var questionModuleLookup = {};
exports.questionTypes = [];

for (var mod in questionModules) {
    questionModuleLookup[questionModules[mod].schema.title] = questionModules[mod];
    exports.questionTypes.push(questionModules[mod].schema.title);
}

for (var mod in questionModules) {
    if ('custom' in questionModules[mod].schema) {
        for (var cf in questionModules[mod].schema.custom) {
            vali.customFormats[cf] = questionModules[mod].schema.custom[cf];
        }
    }
}

var quizDescriptorSchema = {
    '$schema': 'http://json-schema.org/draft-04/schema#',
    type: 'object',
    required: ['version', 'questions'],
    additionalProperties: false,
    
    properties: {
        'version': {
            type: 'string',
        },
        'questions': {
            type: 'array',
            items: {anyOf: questionModules.map(function (m) {
                return {
                    type: 'object',
                    required: ['question', 'parameters'],
                    additionalProperties: false,
                    
                    properties: {
                        'question': {
                            type: 'string',
                            enum: [m.schema.title],
                        },
                        'repeat': {
                            type: 'integer',
                            minimum: 1,
                        },
                        'parameters': m.schema,
                    },
                };
            })},
        },
    },
};

var validates = require('ajv')({
    //useDefaults: true,
    v5: true,
    allErrors: true,
    verbose: true,
    format: 'full',
}).compile(quizDescriptorSchema);

exports.validateQuizDescriptor = function (qd) {
    if (validates(qd)) {
        return [];
    }
    return validates.errors;
}

exports.build = function (qd, seed) {
    if (exports.validateQuizDescriptor(qd).length > 0) {
        throw new Error("Invalid quiz descriptor");
    }
    var quiz = [];
    var rand = new Randomizer(seed);
    for (var qi in qd.questions) {
        qx = qd.questions[qi];
        for (var n = 0; n < (qx.repeat || 1); n++) {
            quiz.push(questionModuleLookup[qx.question].generate(qx.parameters, rand));
            rand.advance();
        }
    }
    return quiz;
}
