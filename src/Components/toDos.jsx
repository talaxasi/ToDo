import React from 'react';
import './ToDos.scss';

const test = 'написать позвонить встретиться. Олег Юрьевич, завтра в обед';

export const checkWord = str => {
  const words = {
    'позвонить': '&#9742;',
    'написать': '&#9993;',
    'встретиться': '&#9203;'
  };
  let result = []
  const arr = str.split('.')[0].split(' ');
  for (let key in words) {
    let index = arr.indexOf(key);
    arr.forEach(word => {
      let count = 0;
      for (let i = 0; i < word.length; i++) {
        key.indexOf(word[i]) !== -1 ? count++ : null;
      }
      const percent = (100 * count) / word.length;
      if (percent > 65) result.push(words[key])
    })
  }
  return result;
}

function ToDos() {
  return (
    <div className={'ToDos'}>
      <h1>hello</h1>
    </div>
  );
}


export default ToDos;