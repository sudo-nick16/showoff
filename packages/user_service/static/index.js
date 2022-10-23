const req = document.querySelector('#req');
const id = document.querySelector('#id');
const name = document.querySelector('#name');
const username = document.querySelector('#username');
const email = document.querySelector('#email');
const pass = document.querySelector('#pass');
const sub = document.querySelector('#submit');

id.value = 1
name.value = 'John Doe';
username.value = 'johndoe';
email.value = 'damn@mail.com'
pass.value = '123456';

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
