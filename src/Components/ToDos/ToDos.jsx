import React, {useState, useRef, useEffect} from 'react';
import Form from "../Form/Form";
import './ToDos.scss';
import write from '../../icons/write.png';
import call from '../../icons/call.png';
import meet from '../../icons/meet.png';
import remove from '../../icons/remove.png';

function checkString(str, members, buttons) {
  const strLength = str.split('/').length;

  if (strLength === 1) return {act: [], name: '', text: str};

  str = str.replace(/^\/+/g).replace(/\s{2,}/g, ' ').split('/');
  const objMembers = {};
  for (let key in members) objMembers[key.toLowerCase().replace(/\s+/g, '')] = members[key];

  const keysSourceMembers = Object.keys(members);
  const keysMembers = Object.keys(objMembers);
  const keysButtons = Object.keys(buttons);
  const arrActions = str[0].toLowerCase().split(' ');

  let name = str[1].trim();
  let act = [];

  const indexNameMembers = keysMembers.indexOf(name.toLowerCase().replace(/\s+/g, ''));
  const sourceName = keysSourceMembers[indexNameMembers] || null;
  name = sourceName || name;

  arrActions.forEach(action => {
    if (keysButtons.indexOf(action) !== -1) act.push([buttons[action][0], [buttons[action][1]]])
  });
  act.splice(3);
  if (act.length <= 0) name = str[0];

  if (strLength === 2) {
    if (indexNameMembers < 0 && act.length > 0) return 'Укажите имя из списка сотрудников или добавьте описание';
    if (act.length > 0) {
      act.splice(3);
      return {act: act, name: name, text: ''};
    }
    else {
      let text = str[1];
      return {act: [], name: name, text: text}
    }
  }
  const text = str[2].trim();
  if (act.length === 0) act = [];

  return {act, name, text};
}

const buttons = {
  'позвонить': [call, 'phone'],
  'написать': [write, 'mail'],
  'встретиться': [meet, 'location']
};

function ToDos() {
  const [toDoCards, setToDoCards] = useState([]);
  const [members, setMembers] = useState({});
  const [toggle, setToggle] = useState(0);
  const todoRef = useRef();
  const inputRef = useRef();
  const toggleFormWrap = useRef();
  const toggleRef = useRef();

  function addToDoCard(str) {
    const toDoCard = checkString(str, members, buttons);
    if (typeof toDoCard === 'string') alert(toDoCard);
    else {
      setToDoCards([...toDoCards, toDoCard]);
      setToLocalStorage(toDoCard);
      inputRef.current.value = '';
    }
    todoRef.current.className = "todo-list__wrap-todos todo-list__wrap-todos_down";
  }

  function deleteToDoCard(e) {
    if (e.animationName === 'delete-todo-card') {
      setToDoCards(toDoCards.filter((card, i) => i !== +e.target.id));
      setToLocalStorage();
      e.target.className = 'todo-card';
    }
  }

  function setToLocalStorage() {
    try {
      localStorage.setItem('todos', JSON.stringify(toDoCards));
    } catch (e) {
      console.log(e)
    }
  }

  function animationDeleteCard(e) {
    e.target.offsetParent.className += ' todo-card_delete';
  }

  function toSourceClassName() {
    todoRef.current.className = "todo-list__wrap-todos";
  }

  function addFromInput(e) {
    if (e.key === 'Enter' && e.target.value.replace(/\s+/g, '') !== '') addToDoCard(e.target.value);
  }

  function buttonAction(e) {
    const name = e.target.dataset.name;
    const action = e.target.dataset.action;
    if (members[name]) alert(members[name][action])
  }

  function toggleForm(e) {
    if (toggle === 0 || toggle === 2) setToggle(1);
    if (toggle === 1) setToggle(2);
  }

  function info(e) {
    const className = e.target.className;
    const infoStr = e.target.innerHTML;
    const inputValue = inputRef.current.value;
    const actionDisabled = 'info-action__item info-action__item_disabled';
    const nameDisabled = 'info-name__item info-name__item_disabled';
    const nameSelected = 'info-name__item info-name__item_selected';

    if (className.includes('action')) {
      if (inputValue === '') {
        inputRef.current.value = `${infoStr} / `;
        e.target.className = actionDisabled;
      } else if (inputValue.indexOf('/') === inputValue.lastIndexOf('/') && className === 'info-action__item') {
        inputRef.current.value = inputValue.replace(/\//g, ` ${infoStr} / `);
        e.target.className = actionDisabled;
      }
    }
    if (className.includes('name')) {
      if (inputValue.includes('/') && className === 'info-name__item') inputRef.current.value += `${infoStr} / `;
      const nameList = e.target.offsetParent.childNodes;
      for (let i = 0; i < nameList.length; i++) {
        nameList[i].className = nameDisabled;
      }
      e.target.className = nameSelected;
    }
    if (className.includes('note')) {
      if (e.target.previousSibling.value === '') {
        alert('Введите заметку');
        return null;
      }
      inputRef.current.value += e.target.previousSibling.value;
      e.target.previousSibling.value = '';
      addToDoCard(inputRef.current.value);
    }
  }

  useEffect(() => {
    const todos = localStorage.getItem('todos');
    try {
      if (todos) setToDoCards(JSON.parse(todos));
    }catch (e) {
      console.log(e)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(toDoCards))
  }, [toDoCards])

  useEffect(() => {
    if (toggle === 1) {
      toggleFormWrap.current.className = 'todo-list__form-wrap todo-list__form-wrap_active';
      toggleRef.current.className = 'todo-list__toggle-form todo-list__toggle-form_active';
    }
    if (toggle === 2) {
      toggleFormWrap.current.className = 'todo-list__form-wrap todo-list__form-wrap_hidden';
      toggleRef.current.className = 'todo-list__toggle-form todo-list__toggle-form_hidden';
    }
  }, [toggle])

  useEffect(() => {
    fetch('http://localhost:3001/members')
        .then(response => response.json())
        .then(data => {
          setMembers(data)
        })
  }, [])

  useEffect(() => {
    if (toDoCards.length === 1) todoRef.current.firstElementChild.className = 'todo-card';
    if (toDoCards.length === 2) todoRef.current.firstElementChild.className = 'todo-card todo-card_one-elem';
    if (toDoCards.length === 3) todoRef.current.firstElementChild.className = 'todo-card todo-card_two-elem';
  }, [toDoCards])

  return (
      <div className={'Todos'}>
        <div className={'todo-list'}>
          <div className="todo-list__info" key={toDoCards.length + '01'}>

            <div className="info-action">
              <p className="info-action__tag">Действие</p>
              <div className="info-action__item-group">
                {Object.keys(buttons).map(action => <p className={"info-action__item"} onClick={info}
                                                       key={action}>{action}</p>)}
              </div>
            </div>

            <div className="info-name">
              <p className="info-name__tag">Имя адресата</p>
              <div className="info-name__item-group">
                {Object.keys(members).map(name => <p className={'info-name__item'} onClick={info}
                                                     key={name}>{name}</p>)}
              </div>
            </div>

            <div className="info-note">
              <p className="info-note__tag">Заметка</p>
              <div className="info-note__item-group">
                <textarea className={'info-note__textarea'}/>
                <button className={'info-note__button'} onClick={info}/>
              </div>
            </div>
          </div>

          <input className={'todo-list__input'} type={'text'} onKeyDown={addFromInput} ref={inputRef}/>

          <div className="todo-list__wrap-scroll">
            <div ref={todoRef} className={"todo-list__wrap-todos"} onAnimationEnd={toSourceClassName}>
              {toDoCards.map((card, i) => {
                if (card.name === '' && card.act.length === 0) return (
                    <div className={'todo-card'} key={i.toString()} id={i} onAnimationEnd={deleteToDoCard}>
                      <p className={'todo-card__text'} style={{width: '92%'}}>{card.text}
                        <span className={'todo-card__text-hover'}>{card.text}</span>
                      </p>
                      <button className={'todo-card__button-remove'} onClick={animationDeleteCard}><img alt={'X'} src={remove}/>
                      </button>
                    </div>
                )
                return (
                    <div className={'todo-card'} key={i.toString()} id={i} onAnimationEnd={deleteToDoCard}>

                      <div className={'todo-card__buttons-group'}>
                        {card.act.map((act, i) => (
                            <button key={i} className={'todo-card__button'} onClick={buttonAction}>
                              <img alt={'O'} src={act[0]} data-name={card.name} data-action={act[1]}/>
                            </button>))}
                      </div>

                      <p className={'todo-card__name'}>{card.name}</p>
                      <p className={'todo-card__text'}>{card.text}
                        <span className={'todo-card__text-hover'}>{card.text}</span>
                      </p>

                      <button className={'todo-card__button-remove'} onClick={animationDeleteCard}><img alt={'X'} src={remove}/>
                      </button>
                    </div>
                )
              })}
            </div>
          </div>
          <div className="todo-list__bottom-shadow"/>
          <button className="todo-list__toggle-form" onClick={toggleForm} ref={toggleRef} key={toggle + 1}/>
          <div className="todo-list__form-wrap" ref={toggleFormWrap} key={toggle}>
            <Form members={members}/>
          </div>
        </div>
      </div>
  );
}

export default ToDos;