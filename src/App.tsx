import './App.style.scss';
import Form from './components/Form';

function App() {
  return (
    <div className="app">
      <h1 className="title">Sign In Form</h1>
      <Form />
      <span className="bg-icon bg-icon--left"></span>
      <span className="bg-icon bg-icon--right"></span>
    </div>
  );
}

export default App;
