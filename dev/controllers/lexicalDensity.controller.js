const nonLexicalWord = require('../models/nonLexicalWord.model.js');

/*
 * Compute the Lexical Density of a given English string.
 * Uses the formula: ld = (# Lexical words / # Total Words)
 * where Lexical Words are defined as any words not contained
 * in a predefined list of Non-Lexical Words.
 */
exports.findComplexity = async (text, mode) => {
    // Remove punctuation from input text including periods, for the overall lexical density
    const sanitizedTextForOLD = removePunctuationFromText(text, true);

    if (mode) { // Compute both the overall and sentence-specific lexical density
        // Remove punctuation from input text not including periods, for the sentence lexical densities
        const sanitizedTextForSLDs = removePunctuationFromText(text, false);

        // Build an array consisting of the lexical density for each sentence in the input text
        const sentenceLDs = [];
        let totalLexicalWords = 0;
        for (sentence of sanitizedTextForSLDs.split('.').filter(Boolean)) {
            const numLexicalWords = await getNumLexicalWords(sentence);
            sentenceLDs.push((numLexicalWords / sentence.split(' ').filter(Boolean).length));
            totalLexicalWords += numLexicalWords;
        }

        // We save having to do additional DB queries by having kept track of the total number
        // of lexical tokens we saw while doing the calculations for each sentence's lexical density value
        const overallLD = (totalLexicalWords / sanitizedTextForOLD.split(' ').filter(Boolean).length).toFixed(2);

        return {
            data: {
                sentence_ld: sentenceLDs.map((sld) => sld.toFixed(2)),
                overall_ld: overallLD,
            }
        };

    } else { // Compute the overall lexical density only
        const numLexicalWords = await getNumLexicalWords(sanitizedTextForOLD)
        const overallLD = (numLexicalWords / sanitizedTextForOLD.split(' ').filter(Boolean).length).toFixed(2);

        return {
            data: {
                overall_ld: overallLD,
            }
        };
    }
};

/*
 * Internal db access method to count the number of lexical
 * words present in a given text string. Converts input text
 * to lower case to remain case-agnostic. Utilizes the count()
 * method on the indexed 'word' model field for performance.
 * Thus, each db call never needs to actually check disk since
 * indices are stored in RAM.
 */
getNumLexicalWords = async (text) => {
    const lexicalWordsSeen = [];
    let numLexicalWords = 0
    for (word of text.split(' ').filter(Boolean)) {
        if (lexicalWordsSeen.includes(word) || !(await nonLexicalWord.find({ word: word.toLowerCase() }).count().exec())) {
            numLexicalWords += 1;
        } 
    }

    return numLexicalWords;
}

/*
 * Simple validation function to ensure that the params to be
 * passed to the findComplexity() function are properly formed
 * and structured.
 */
exports.validateComplexityParams = (text, mode) => {
    if (mode && mode.toLowerCase() !== 'verbose') {
        return {
            status: 400,
            message: 'If included, the `mode` parameter must be set to `verbose`.'
        };
    }

    // Strip out punctuation before testing length
    const sanitizedText = removePunctuationFromText(text, false);

    // Ensure the provided text is within length limits
    if (sanitizedText.split(' ').filter(Boolean).length > 100) {
        return {
            status: 400,
            message: 'Invalid text length. A maximum of 100 separate words may be used.'
        };
    } else if (sanitizedText.length > 1000) {
        return {
            status: 400,
            message: 'Invalid text length. A maximum of 1000 characters may be used, not including punctuation.'
        };
    }

    return false;
};

/* Internal helper method to strip punctuation from a string of text */
removePunctuationFromText = (text, stripPeriods) => {
    const regex = stripPeriods ? /[.,\/#!$%\^&\*;:{}=\-_`~()]/g : /[,\/#!$%\^&\*;:{}=\-_`~()]/g;
    return text.replace(regex, ' ');
}
