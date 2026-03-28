import { useEffect, useState } from "react";
import "./App.css";

const blogData = [
  {
    id: 1,
    title: "React is Amazing",
    description: "Learn React today",
    author: "Tunde",
  },
  {
    id: 2,
    title: "JavaScript Tips",
    description: "Top 10 JS tricks",
    author: "Cybug",
  },
  {
    id: 3,
    title: "VS Code Setup and React",
    description: "Best extensions ever",
    author: "Amaka",
  },
];

function Navbar({ postCount }) {
  return (
    <div>
      <header>
        <h1>
          Codex | Showing posts <span style={{ color: postCount > 0 ? 'white' : 'red' }}>
  {postCount}
</span>
        </h1>
      </header>
    </div>
  );
}

function BlogPost({ title, description, author }) {
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
      <button onClick={handleLike}>
        {liked ? "❤️ Liked" : "🤍 Like"}
        {likes}
      </button>
    </div>
  );
}

function SearchBar({ searchText, setSearchText }) {
  function handleClear() {
    setSearchText("");
  }

  return (
    <div>
      <input
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        placeholder="Type an Author name..."
      />
      <p>You searched for: {searchText}</p>

      <button onClick={handleClear}>Clear</button>
    </div>
  );
}

// function App() {
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetch("https://jsonplaceholder.typicode.com/posts").then(response => response.json())
//     .then(data => {
//       setPosts(data);
//       setLoading(false);
//     });
//   }, []);

//   if (loading) return <p>Loading posts...</p>;

//   return(
//     <ul>
//       {posts.slice(0, 5).map(post => (
//         <li key={post.id}>{post.title}</li>
//       ))}
//     </ul>
//   );

function JokeFetcher() {
  const [joke, setJoke] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchJokeFromApi = async () => {
    const response = await fetch(
      "https://official-joke-api.appspot.com/jokes/random",
    );
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return { setup: data.setup, punchline: data.punchline };
  };

  const getJoke = async () => {
    setLoading(true);
    try {
      const jokeText = await fetchJokeFromApi();
      setJoke(jokeText);
    } catch (err) {
      console.error(err);
      setJoke("Could not load a joke.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isCancelled = false;

    const loadOnMount = async () => {
      try {
        const jokeText = await fetchJokeFromApi();
        if (isCancelled) return;
        setJoke(jokeText);
      } catch (err) {
        if (isCancelled) return;
        console.error(err);
        setJoke("Could not load a joke.");
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };

    loadOnMount();

    return () => {
      isCancelled = true;
    };
  }, []);

  if (loading) return <p>Loading joke...</p>;

  return (
    <>
      {typeof joke === "object" && joke ? (
        <>
          <p>
            <strong>{joke.setup}</strong>
          </p>
          <p>{joke.punchline}</p>
        </>
      ) : (
        <p>{joke}</p>
      )}

      <button
        onClick={() => {
          getJoke(); // Fetch a new joke when the button is clicked
        }}
      >
        New Joke
      </button>
    </>
  );
}

function App() {
  const [searchText, setSearchText] = useState("");

  const filteredPosts = blogData.filter((post) =>
    post.author.toLowerCase().includes(searchText.toLowerCase()),
  );

  return (
    <div>
      <Navbar postCount={filteredPosts.length} />
      <SearchBar searchText={searchText} setSearchText={setSearchText} />

      {filteredPosts.length === 0 ? (
        <p>No posts found "{searchText}"</p>
      ) : (
        filteredPosts.map((post) => (
          <BlogPost key={post.id} {...post} />
        ))
      )}

      <hr />

      <h2>Random Joke</h2>
      <JokeFetcher />
    </div>
  );
}

// function App() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   return (
//     <div>
//       {isLoggedIn ? (
//         <h1>Welcome back, Tunde! 👋</h1>    // show if TRUE
//       ) : (
//         <h1>Please log in</h1>               // show if FALSE
//       )}

//       <button onClick={() => setIsLoggedIn(!isLoggedIn)}>
//         {isLoggedIn ? "Logout" : "Login"}
//       </button>
//     </div>
//   );
// }

export default App;
