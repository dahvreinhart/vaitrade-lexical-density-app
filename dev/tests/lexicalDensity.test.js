const request = require('supertest');
const ldwModel = require('../models/nonLexicalWord.model');
const app = require('../app')

describe('Test the Lexical Density routes and controller functions', () => {

    describe('GET `/`', () => {

        it('should succeed and return a defined welcome message', () => {
            return request(app)
                .get('/')
                .expect(200)
                .then(res => {
                    expect(res.text).toBeDefined();
                })
        });

    });

    describe('GET `/complexity`', () => {

        it('should succeed and return an info message with no body when no parameters are defined', () => {
            return request(app)
                .get('/complexity')
                .query()
                .expect(200)
                .then(res => {
                    expect(res.text).toBeDefined();
                    expect(res.body).toEqual({});
                })
        });

        it('should succeed and return an info message with no body when no text is defined, but a mode is defined', () => {
            return request(app)
                .get('/complexity')
                .query({ mode: 'verbose' })
                .expect(200)
                .then(res => {
                    expect(res.text).toBeDefined();
                    expect(res.body).toEqual({});
                })
        });

        it('should succeed with expected value when only text is defined with single sentence', () => {
            const inputText = 'The quick brown fox jumps over the lazy dog.';
            return request(app)
                .get(`/complexity`)
                .query({ text: inputText })
                .expect(200)
                .then(res => {
                    expect(res.body).toEqual({
                        data: {
                            overall_ld: '0.78'
                        }
                    });
                })
        });

        it('should succeed with expected value when mode is verbose and text is defined with single sentence', () => {
            const inputText = 'The quick brown fox jumps over the lazy dog.';
            return request(app)
                .get(`/complexity`)
                .query({ mode: 'verbose', text: inputText })
                .expect(200)
                .then(res => {
                    expect(res.body).toEqual({
                        data: {
                            sentence_ld: ['0.78'],
                            overall_ld: '0.78'
                        }
                    });
                })
        });

        it('should succeed with expected value when only text is defined with multiple sentences', () => {
            const inputText = 'The quick brown fox jumps over the lazy dog. This is another sentence.';
            return request(app)
                .get(`/complexity`)
                .query({ text: inputText })
                .expect(200)
                .then(res => {
                    expect(res.body).toEqual({
                        data: {
                            overall_ld: '0.77'
                        }
                    });
                })
        });

        it('should succeed with expected value when mode is verbose and text is defined with multiple sentences', () => {
            const inputText = 'The quick brown fox jumps over the lazy dog. This is another sentence.';
            return request(app)
                .get(`/complexity`)
                .query({ mode: 'verbose', text: inputText })
                .expect(200)
                .then(res => {
                    expect(res.body).toEqual({
                        data: {
                            sentence_ld: ['0.78', '0.75'],
                            overall_ld: '0.77'
                        }
                    });
                })
        });

        it('should succeed with expected value when there are lots of punctuation characters and mode is undefined', () => {
            const inputText = 'The quick /brown $fox jumps *over the lazy dog.';
            return request(app)
                .get(`/complexity`)
                .query({ text: inputText })
                .expect(200)
                .then(res => {
                    expect(res.body).toEqual({
                        data: {
                            overall_ld: '0.78'
                        }
                    });
                })
        });

        it('should succeed with expected value when there are lots of punctuation characters and mode is verbose', () => {
            const inputText = 'The quick /brown $fox jumps *over the lazy dog. This %%%is another (sentence).';
            return request(app)
                .get(`/complexity`)
                .query({ mode: 'verbose', text: inputText })
                .expect(200)
                .then(res => {
                    expect(res.body).toEqual({
                        data: {
                            sentence_ld: ['0.78', '0.75'],
                            overall_ld: '0.77'
                        }
                    });
                })
        });

        it('should fail with textual info message when mode is an invalid value', () => {
            const inputText = 'The quick brown fox jumps over the lazy dog.';
            return request(app)
                .get(`/complexity`)
                .query({ mode: 'INVALID', text: inputText })
                .expect(400)
                .then(res => {
                    expect(res.body).toEqual({});
                    expect(res.text).toContain('ERROR');
                })
        });

        it('should fail with message when text has too many words', () => {
            const inputText = `
                This text has over 100 words in it.
                This text has over 100 words in it.
                This text has over 100 words in it.
                This text has over 100 words in it.
                This text has over 100 words in it.
                This text has over 100 words in it.
                This text has over 100 words in it.
                This text has over 100 words in it.
                This text has over 100 words in it.
                This text has over 100 words in it.
                This text has over 100 words in it.
                This text has over 100 words in it.
                This text has over 100 words in it.
            `;
            return request(app)
                .get(`/complexity`)
                .query({ text: inputText })
                .expect(400)
                .then(res => {
                    expect(res.body).toEqual({});
                    expect(res.text).toContain('ERROR');
                })
        });

        it('should fail with message when text has too many characters', () => {
            const inputText = `
                Thistexthasover1000charactersinit Thistexthasover1000charactersinit
                Thistexthasover1000charactersinit Thistexthasover1000charactersinit
                Thistexthasover1000charactersinit Thistexthasover1000charactersinit
                Thistexthasover1000charactersinit Thistexthasover1000charactersinit
                Thistexthasover1000charactersinit Thistexthasover1000charactersinit
                Thistexthasover1000charactersinit Thistexthasover1000charactersinit
                Thistexthasover1000charactersinit Thistexthasover1000charactersinit
                Thistexthasover1000charactersinit Thistexthasover1000charactersinit
                Thistexthasover1000charactersinit Thistexthasover1000charactersinit
                Thistexthasover1000charactersinit Thistexthasover1000charactersinit
                Thistexthasover1000charactersinit Thistexthasover1000charactersinit
                Thistexthasover1000charactersinit Thistexthasover1000charactersinit
                Thistexthasover1000charactersinit Thistexthasover1000charactersinit
                Thistexthasover1000charactersinit Thistexthasover1000charactersinit
                Thistexthasover1000charactersinit Thistexthasover1000charactersinit
                Thistexthasover1000charactersinit Thistexthasover1000charactersinit
                Thistexthasover1000charactersinit Thistexthasover1000charactersinit
            `;
            return request(app)
                .get(`/complexity`)
                .query({ text: inputText })
                .expect(400)
                .then(res => {
                    expect(res.body).toEqual({});
                    expect(res.text).toContain('ERROR');
                })
        });

    });

});
