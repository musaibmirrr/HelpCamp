const natural = require('natural')
const analyzer = new natural.SentimentAnalyzer('English', natural.PorterStemmer, 'afinn');
const tokenizer = new natural.WordTokenizer();
module.exports.analyzePolarity = function (text) {
    const tokenArray = text.body.split(" ");
    const sentiment = analyzer.getSentiment(tokenArray);
    return sentiment;
}



