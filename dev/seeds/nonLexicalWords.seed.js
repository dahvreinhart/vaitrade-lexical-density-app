const NonLexicalWordModel = require('mongoose').model('NonLexicalWord');

/*
 * Simple seeding function which is run on startup to ensure that the DB
 * is populated with the list of non-lexical words needed for the
 * complexity calculation.
 */
module.exports.seedNonLexicalWords = async function() {
    const existingObjects = await NonLexicalWordModel.count().exec()
    const shouldLog = process.env.NODE_ENV === 'development';

    if (existingObjects) {
        if (shouldLog) console.log('DATABSE IS CURRENTLY POPULATED - NO SEEDING');
    } else {
        if (shouldLog) console.log('DATABASE IS CURRENTLY UNPOPULATED - BEGINNING DATABASE SEEDING');

        for (nlw of nonLexicalWords) {
            await NonLexicalWordModel.create({ word: nlw });
        }

        const newObjects = await NonLexicalWordModel.count().exec()

        if (shouldLog) console.log(`SEEDING COMPLETE - ${newObjects} NEW ITEMS CREATED`);
    }
}

// To add or remove words, alter this list, flush the database and then restart the app
const nonLexicalWords = [
    "to",
    "got",
    "is",
    "have",
    "and",
    "although",
    "or",
    "that",
    "when",
    "while",
    "a",
    "either",
    "more",
    "much",
    "neither",
    "my",
    "that",
    "the",
    "as",
    "no",
    "nor",
    "not",
    "at",
    "between",
    "in",
    "of",
    "without",
    "I",
    "you",
    "he",
    "she",
    "it",
    "we",
    "they",
    "anybody",
    "one",
];
