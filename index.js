import { openai, supabase } from './config.js';

const question1 = document.getElementById('question1');
const question2 = document.getElementById('question2');
const question3 = document.getElementById('question3');
const letsGo = document.getElementById('letsgo');

letsGo.addEventListener('click', () => {
    // FIX 1: Use .value to get the text, and use the correct names
    const fullInput = `User favorite movie is ${question1.value}, wants something specifically in the ${question2.value} time, and they are interested in ${question3.value}.`;

    main(fullInput);
});

async function main(input) {
    letsGo.textContent = "Loading..."

    const embedding = await createEmbedding(input);
    const match = await findNearestMatch(embedding);
    // Now 'match' will actually contain the movie text!
    await getChatCompletion(match, input);
}

async function createEmbedding(input) {
    const embeddingResponse = await openai.embeddings.create({
        model: "text-embedding-3-small", // Recommendation: Use '3-small' for 2026 projects
        input
    });
    return embeddingResponse.data[0].embedding;
}

async function findNearestMatch(embedding) {
    const { data } = await supabase.rpc('match_movies', {
        query_embedding: embedding,
        match_threshold: 0.50,
        match_count: 3 // Set to 3 to get a better variety
    });


    // FIX 2: You MUST return the data, or 'main' gets nothing!
    return data.map(movie => movie.content).join('\n');
}

const chatMessages = [{
    role: 'system',
    content: `You are an enthusiastic movie expert who loves recommending movies to people. You will be given two pieces of information - some context about movies and a question. Your main job is to formulate a short answer to the question using the provided context. If you are unsure and cannot find the answer in the context, say, "Sorry, I don't know the answer." Please do not make up the answer.` // Your Scrimba system prompt here
}];

async function getChatCompletion(text, query) {
    chatMessages.push({
        role: 'user',
        content: `Context: ${text} Question: ${query}`
    });


    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: chatMessages,
        temperature: 0.5
    });

    // FIX 3: Output the answer to the screen instead of just the console
    document.getElementById('app-container').style.display = 'none';
    document.getElementById('main').innerHTML =
        `
    <div id="render-app-container">
            <div id="logo-container">
                <img src="popcorn.png" alt="smiling popcorn">
                <h1>PopChoice</h1>
            </div>

            <div id="recommended-movie">
                <div id="poster">

                </div>
                <div id="movie-details">
                    <h3 id="title"></h3>
                    <p id="details"></p>
                </div>
            </div>

            <div id="button-container">
                <button id="goAgain">Go Again</button>
            </div> 
    `
    document.getElementById('details').innerText = response.choices[0].message.content;

    document.getElementById('goAgain').addEventListener('click', () => {
        window.location.reload()
    })
}