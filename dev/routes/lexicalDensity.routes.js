const express = require('express');
const router = express.Router();

const ldController = require('../controllers/lexicalDensity.controller')

/* GET a simple homepage. */
router.get('/', function (req, res, next) {
    res.send('VAI Trade application coding assignment. Navigate to `/complexity` to test API endpoint.');
});

/* 
 * GET the complexity of a given English string.
 * Accepts 2 optional arguments:
 *  'mode' (query): if set to 'verbose', compute both the overall lexical density and the sentence-specific lexical density
 *  'text' (query): the text for which the lexical analysis should be performed
 * 
 * If no text is provided, a simple info page is provided.
 * All parameters must be URL encoded.
 */
router.get('/complexity', async function (req, res, next) {
    // Extract query parameters
    const mode = req.query.mode;
    const text = req.query.text;

    // No text - display info page
    if (!text) {
        return res.send(`
            No calculation text supplied.
            To conduct a lexical density analysis, send a string contained in the 'text' query parameter to this endpoint.
            You may also supply the 'mode' query parameter with the value of 'verbose' to calculate both the overall
            lexical density and the sentence-specific lexical density.

            Example: /complexity?mode=verbose&text=the%20quick%20brown%20fox%20jumps%20over%20the%20lazy%20dog
        `);
    }

    // validate params in validation function
    const validationError = ldController.validateComplexityParams(text, mode)
    if (validationError) return next(validationError);

    // Compute the lexical density/complexity of the provided text string
    const complexityData = await ldController.findComplexity(text, mode)

    res.send(complexityData);
});

module.exports = router;
