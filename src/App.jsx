import { useState } from 'react';
import './App.css';

const blogData = [
  { id: 1, title: "React is Amazing", description: "Learn React today", author: "Tunde" },
  { id: 2, title: "JavaScript Tips", description: "Top 10 JS tricks", author: "Cybug" },
  { id: 3, title: "VS Code Setup and React", description: "Best extensions ever", author: "Amaka" },
];

function Navbar() {
  return (
    <div>
      <header>
        <h1>Codex</h1>
      </header>
    </div>
  );
}

function BlogPost({ title, description, author}) {
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);

  function handleLike() {

    if (!liked) {
      setLikes(likes + 1);
      setLiked(true);
    } else {
      setLikes(likes - 1);
      setLiked(false);
    }
  }

  return (
    <div>
      <h3>{title}</h3>
      <p>{description}</p>
      <small>Written by: {author}</small>
      <br />
      <button onClick={handleLike}>{liked ? "❤️ Liked": "🤍 Like"}{likes}</button>
    </div>
  );
}


function SearchBar({ searchText, setSearchText }) {

  function handleClear() {
    setSearchText("");
  }

  return(
    <div>
      <input 
      value={searchText}
      onChange={(e) => setSearchText(e.target.value)}
       placeholder='Type an Author name...' />
      <p>You searched for: {searchText}</p>

      <button onClick={handleClear}>Clear</button>
    </div>
  )

}



function App() {
  const [searchText, setSearchText] = useState("");

  
   const filteredPosts = blogData.filter(post =>
    post.author.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div>
      <Navbar />

      <SearchBar searchText={searchText} setSearchText={setSearchText} />

        {filteredPosts.map(post => (
            <BlogPost
          key={post.id} {...post}
        />
        ))}

    </div>

  );
}

export default App; 
