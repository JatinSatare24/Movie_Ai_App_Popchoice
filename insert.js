import { openai, supabase } from './config.js';
import movies from './content.js'

console.log(movies)


async function createAndStoreEmbeddings() {
    // 1. Prepare strings for OpenAI (using your actual movie property names)
    const movieStrings = movies.map(movie =>
        `${movie.title}: ${movie.content}`
    );

    console.log(movieStrings)

    // 2. Get the embeddings
    const response = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: movieStrings
    });

    
    console.log(response)

    // 3. Re-assemble to match your DB columns EXACTLY
    const dataToInsert = movies.map((movie, i) => ({
        // Column Name : JS Property Name
        title: movie.title,
        content: movie.content, // Ensure 'description' matches your movie file!
        embedding: response.data[i].embedding
    }));

    
    console.log(dataToInsert)

    // 4. Insert into Supabase
    const { error } = await supabase.from('movies').insert(dataToInsert);

    if (error) {
        console.error('Insert Error:', error.message);
    } else {
        console.log('Success! Data is now in Supabase with content.');
    }
}

createAndStoreEmbeddings()