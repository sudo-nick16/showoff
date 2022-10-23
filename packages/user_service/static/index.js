const req = document.querySelector('#req');
const id = document.querySelector('#id');
const name = document.querySelector('#name');
const username = document.querySelector('#username');
const email = document.querySelector('#email');
const pass = document.querySelector('#pass');
const sub = document.querySelector('#submit');
const change = document.querySelector('#change');


const setValues = () => {
    let i = parseInt(localStorage.getItem('ind'));
    i = i+1
    id.value = Math.floor(Math.random() * 1000);
    name.value = 'Nick' + i;
    username.value = 'sudonick' + i;
    email.value = 'nick' + i + '@gmail.com';
    pass.value = '123456';
    localStorage.setItem('ind', JSON.stringify(i));
}

const ind = localStorage.getItem('ind');
if (!ind) {
    localStorage.setItem('ind', JSON.stringify(4));
    setValues()
}else{
    setValues();
}


change.addEventListener('click', (e) => {
    e.preventDefault();
    setValues();    
});

sub.addEventListener('click', (e) => {
  e.preventDefault();
  console.log("registering", req.value);
  if(typeof req.value != "string"){
    throw new Error("MAN FUCK JS")
  }
  const data = { id: id.value, name: name.value, password: pass.value, email: email.value, username: username.value };
  fetch('http://localhost:4001/api/users/', {
    method: req.value,
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' }
  })
    .then(res => res.json())
    .then(data => console.log(data));
})
