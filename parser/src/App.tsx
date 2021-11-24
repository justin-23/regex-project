import React from 'react';
import './App.css';
import FancyTextarea from './FancyTextarea';
function App() {
  return (
    <div className="App">
      <div id="holder">
        <div id="gui">
          <FancyTextarea contents="" placeholder="Enter regex here..."/>
          <FancyTextarea contents="" placeholder="Enter test string here..."/>
        </div>
      </div>
    </div>
  );
}

export default App;
