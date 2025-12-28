import React, { memo, useDeferredValue, useState } from 'react';
import './App.css'


function App() {

  const clickBtn = (e: React.MouseEvent) => {
    console.log(e, 1);
    setTimeout(() => {
      console.log(e, 2);
    }, 2000);
  }

  return (
    <>
      <button onClick={clickBtn}>test</button>
    </>
  );
}

export default App