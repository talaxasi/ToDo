import React, { useState, useRef, useEffect } from 'react';
import './ToDos.scss';
import write from '../icons/write.png';
import call from '../icons/call.png';
import meet from '../icons/meet.png';
import remove from '../icons/remove.png';


function checkString(str, members, buttons) {
  const strLength = str.split('/').length;

  if (strLength === 1) return {act: [], name: '', text: str};

  str = str.replace(/^\/+/g).replace(/\s{2,}/g, ' ').split('/');
  const objMembers = {};
  for(let key in members) objMembers[key.toLowerCase().replace(/\s+/g, '')] = members[key];

  const keysSourceMembers = Object.keys(members);
  const keysMembers = Object.keys(objMembers);
  const keysButtons = Object.keys(buttons);
  const arrActions = str[0].toLowerCase().split(' ');

  let name = str[1].trim();
  let act = [];

  const indexNameMembers = keysMembers.indexOf(name.toLowerCase().replace(/\s+/g, ''));
  const sourceName = keysSourceMembers[indexNameMembers] || null;
  // const dataMember = members[sourceName] || null;
  name = sourceName || name;

  arrActions.forEach(action => {if (keysButtons.indexOf(action) !== -1) act.push([buttons[action][0], [buttons[action][1]]])});
  if (act.length <= 0) name = str[0];

  if (strLength === 2) {
    if (indexNameMembers < 0 && act.length > 0) return 'Укажите имя из списка сотрудников или добавьте описание';
    if (act.length > 0) return {act: act, name: name, text: ''};
    else {
      let text = str[1];
      return {act: [], name: name, text: text}
    }
  }
  const text = str[2].trim();
  if(act.length === 0) act = [];

  return {act, name, text};
}

const test2 = {
  'Олег Юрьевич' : {
    'phone' : '1-111-111-11-11',
    'mail' : 'testOleg@mail.ru',
    'location' : 'prospect'
  },
  'Бранислав Иванович' : {
    'phone' : '2-222-222-22-22',
    'mail' : 'testBranislav@mail.ru',
    'location' : 'street'
  },
  'Антон Антонов' : {
    'phone' : '3-333-333-33-33',
    'mail' : 'testAnton@mail.ru',
    'location' : 'square'
  },
  'Бано' : {
    'phone' : '4-444-444-44-44',
    'mail' : 'testBano@mail.ru',
    'location' : 'boulevard'
  }
}

const buttons = {
  'позвонить': [call, 'phone'],
  'написать': [write, 'mail'],
  'встретиться': [meet, 'location']
};

function ToDos() {
  const [toDoCards, setToDoCard] = useState([]);
  const domRef = useRef();
  const barRef = useRef();

  function addToDoCard(e) {
    if (e.key === 'Enter' && e.target.value.replace(/\s+/g, '') !== '') {
      const toDoCard = checkString(e.target.value, test2, buttons);
      if (typeof toDoCard === 'string') alert(toDoCard);
      else {
        setToDoCard([...toDoCards, toDoCard]);
        e.target.value = '';
      }
    }
  }

  function deleteToDoCard(e) {
    const delIndex = +e.target.offsetParent.id;
    setToDoCard(toDoCards.filter((card, i) => i !== delIndex));
  }

  function buttonAction(e) {
    const name = e.target.dataset.name;
    const action = e.target.dataset.action;
    if(test2[name]) alert(test2[name][action])
  }

  function doTest(e) {
    console.log(barRef.current.style)
  }

  useEffect(() => {
    if (toDoCards.length === 1) domRef.current.firstElementChild.className = 'todo-card';
    if (toDoCards.length === 2) domRef.current.firstElementChild.className = 'todo-card todo-card_one-elem';
    if (toDoCards.length === 3) domRef.current.firstElementChild.className = 'todo-card todo-card_two-elem';
  }, [toDoCards])

  return (
    <div className={'Todos'}>

      <div onClick={doTest} className="progress-bar">
        <div className="progress-bar__circle">
          <p className="progress-bar__text">100%</p>
        </div>
        <div className="bar">
          <div className="bar__mask"/>
          <div className="bar__left" ref={barRef}/>
          <div className="bar__right"/>
          <div className="bar__shadow"/>
        </div>
      </div>

      <div className={'todo-list'}>
        <input className={'todo-list__input'} type={'text'} onKeyDown={addToDoCard}/>

        <div ref={domRef} className={'todo-list__wrap-todos'}>
          {toDoCards.map((card, i) => (
            <div className={'todo-card'} key={i.toString()} id={i}>

              <div className={'todo-card__buttons-group'}>
                {card.act.map((act, i) => (
                    <button key={i} className={'todo-card__button'} onClick={buttonAction}>
                      <img src={act[0]} data-name={card.name} data-action={act[1]}/>
                    </button>))}
              </div>

              <p className={'todo-card__name'}>{card.name}</p>
              <p className={'todo-card__text'}>{card.text}
                <span className={'todo-card__text-hover'}>{card.text}</span>
              </p>

              <button className={'button-remove'} onClick={deleteToDoCard}> <img src={remove}/> </button>
            </div>
        ))}
        </div>

      </div>
    </div>
  );
}


export default ToDos;