import React, {useState, useRef, useEffect} from 'react';
import './Form.scss';

const formFields = [
  {
    'name': 'name',
    'type': 'text',
    'value': 'ФИО'
  },
  {
    'name': 'phone',
    'type': 'tel',
    'value': 'Телефон'
  },
  {
    'name': 'mail',
    'type': 'email',
    'value': 'email'
  },
  {
    'name': 'location',
    'type': 'text',
    'value': 'Адрес'
  }
]
const boundenFields = ['name', 'phone', 'mail'];

function Form({members}) {
  const [form, setForm] = useState({});
  const [requiredFields, setRequiredFields] = useState([]);
  const formRef = useRef();

  useEffect(() => {
    let arr = [];
    if (formRef.current) {
      for (let i = 0; i < boundenFields.length; i++) {
        arr.push(formRef.current.elements[boundenFields[i]])
      }
    }
    setRequiredFields([...arr])
  }, [])

  const validateForm = (e, re, value) => {
    let checkForm = 0;

    if (!re.test(String(e.target.value).toLowerCase())) {
      e.target.className = 'form-item__input form-item__input_rejected';
    } else {
      e.target.className = 'form-item__input';
      setForm({...form, [e.target.name]: value});
    }

    requiredFields.forEach(el => {
      if (el.className === 'form-item__input form-item__input_rejected' || el.value === '') {
        checkForm++;
        el.className = 'form-item__input form-item__input_rejected';
      }
    });
    formRef.current.elements.submit.disabled = checkForm > 0;
  }

  const focusOut = e => {

    const fieldName = e.target.name;
    const value = e.target.value;

    switch (fieldName) {
      case 'name':
        const name = /[a-zA-Zа-яёА-ЯЁ]/u;
        const nameValue = value.replace(/\b\w/g, (w) => w.toUpperCase());
        validateForm(e, name, nameValue);
        break;
      case 'phone':
        const phone = /^((8|\+7)[\- ]?)?(\(?\d{3,4}\)?[\- ]?)?[\d\- ]{5,10}$/g;
        let phoneMask = '+x (xxx) xxx-xx-xx';
        value.replace(/[\s\-()]/g, '')
            .split('')
            .forEach(num => phoneMask = phoneMask.replace('x', num))
        validateForm(e, phone, phoneMask);
        break;
      case 'mail':
        const mail = /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/;
        validateForm(e, mail, value);
        break;
      case 'location':
        setForm({...form, [fieldName]: value});
        break;
      default:
        break;
    }
  }

  const submitForm = e => {
    e.preventDefault();
    let name = form.name.replace(/\b\s/g, '.').replace(/\s/g, '').split('.');
    if (name.length === 4) name = `${name[0]} ${name[1][0]}. ${name[2][0]}.`;
    else if (name.length === 3) name = `${name[0]} ${name[1][0]}.`;
    else name = form.name;
    const data = {
      ...members,
      [name]: {...form}
    }
    if (name in members && members[name].name === form.name) alert('Данное имя уже есть в списке контактов');
    else {
      fetch('http://localhost:3001/members', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      })
          .then(() => {
            for (let i = 0; i < formRef.current.elements.length - 1; i++) {
              formRef.current.elements[i].value = '';
            }
          })
    }
  }

  return (
      <form className="form" ref={formRef} onSubmit={submitForm}>
        <div className="form-wrap">
          <h2 className="form__name">Карточка сотрудника</h2>
          {formFields.map(field => (
              <div className={'form-item'} key={field['name']}>
                <p className={`form-item__text`}>{field['value']}</p>
                <input className={`form-item__input`}
                       type={field['type']} name={field['name']} autoComplete={'off'} spellCheck={'false'}
                       onBlur={focusOut}/>
              </div>
          ))}
          <input className={'form__submit'} name={'submit'} type="submit" value={'Внести'} disabled={true}/>
        </div>
      </form>
  )
}

export default Form;