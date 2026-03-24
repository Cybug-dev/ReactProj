import './App.css';

function Navbar() {
  return (
    <div>
      <header>
        <h1>Codex</h1>
      </header>
    </div>
  );
}

function BlogPost() {
  return (
    <div>
      <h3>Technology Of This Current World</h3>
      <p>
        You can also "escape into JavaScript" from JSX attributes, but you have
        to use curly braces instead of quotes. For example, className="avatar"
        passes the "avatar" string as the CSS class, but {'src={user.imageUrl}'}
        reads the JavaScript user.imageUrl variable value, and then passes that
        value as the src attribute.
      </p>
    </div
  );
}

function App() {
  return (
    <div>
      <Navbar />
      <BlogPost />
      <BlogPost />
      <BlogPost />
    </div>
  );
}

export default App;
