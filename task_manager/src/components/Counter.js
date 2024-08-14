import React, { useState, useEffect } from 'react';

function Counter(){
  const [counter, setCounter] = useState(0);

  return(
    <>
      <h2>Counter: {counter}</h2>
      <button onClick={() => setCounter(counter + 1)}>Increment</button>
      <button onClick={() => setCounter(counter - 1)}>Decrement</button>
    </>
  );
};

export default Counter;