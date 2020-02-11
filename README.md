# Vaitrade Lexical Density App
A simple app for computing the lexical density of a string of text.

First-Time Operation Instructions:
- Clone or download this repository to your favourite directory
- In your terminal, navigate to the `vaitrade-lexical-density-app/dev` directory
- Run `npm install`
- Ensure you have MongoDB downloaded and running if needed
- Run `npm run start`
- In your browser, navigate to `localhost:3000` and observe the welcome message
- Navigate to `localhost:3000/complexity` and observe info message
- For additional information on how to hit the endpoint, see the Additional Operation Instructions below

Additional Operation Instructions:

The endpoint requires two parameters in order for a lexical analysis to take place; `mode` and `text`. These parameters are both supplied in the query field of the request.
The `mode` parameter must either be unset or have the value of `verbose`. If set to `verbose`, this will trigger the lexical density calculation of each individual sentence within the supplied text in addition to the overall lexical density of the text. If `mode` is unset, only the overall lexical density will be calculated. The `text` parameter contains the URL-encoded textual string to be analysed. This string cannot be more than 100 words or 1000 characters in length.

    An example call would look like:
    /complexity?mode=verbose&text=the%20quick%20brown%20fox%20jumps%20over%20the%20lazy%20dog

    NOTE: In the above example, the `mode` parameter is set to `verbose` and the `text` parameter corresponds to the plain-text string 'the quick brown fox jumps over the lazy dog'.

Testing:
- In your terminal, navigate to the `vaitrade-lexical-density-app/dev` directory
- Run `npm run test`
- Observe test output in the terminal

Dependancies:
- NodeJS / npm
- MongoDB
