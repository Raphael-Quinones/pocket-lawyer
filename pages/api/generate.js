import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
//Interpret the dream that I will type in the next line:
//Tell me some funny believable false facts about the topic I will type

const basePromptPrefix = "Gather everything you can about Philippine Laws. Every single detail, and then answer the question specifically in the next line with practical solutions and how to overcome that particular legal problem in the Philippines. Make the answer as detailed as possible. Include the law's name, number, etc. Answer in Tagalog. ";
const generateAction = async (req, res) => {
    //Run first prompt
    console.log(`API: ${basePromptPrefix}${req.body.userInput}\n`)

    const baseCompletion = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [{role: "user", content: `${basePromptPrefix}${req.body.userInput}` }],
        temperature: 0.7,
        max_tokens: 400
    });

    const basePromptOutput = baseCompletion.data.choices[0].message.content;
    console.log(basePromptOutput)

    res.status(200).json({ output: "Sorry not available"});
};

export default generateAction