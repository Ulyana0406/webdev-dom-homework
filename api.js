const host = "https://wedev-api.sky.pro/api/v2/uliana-ustinova/comments"

export let token;

export const setToken =(newToken)=>{
token =newToken
};

export function getComments(){
  return  fetch(host, {
        method: "GET",
        headers:{
         Authorization:`Bearer ${token}`
         },
           }).then((response) => {
           return response.json();
           });
};

export function postComments({text,name}){
   return fetch(host, {
       method: "POST",
       headers:{
       Authorization:`Bearer ${token}`
       },
       body: JSON.stringify({
       date: new Date(),
       likes:0,
       isLiked: false,
       text: text,
       name: name,
       })
    });
};

export function login(login, password) {
   return fetch("https://wedev-api.sky.pro/api/user/login", {
       method: "POST",
       body : JSON.stringify({
           login: login,
           password: password,
       })
   })
   .then((response) => {
       //если статус 201 просто продолжаем цепочку промисов
       if (response.status === 201) {
           return response.json()
       // в ином случае проверяем код статуса и по разному обрабатываем
       } else {
           //просто попробовать на практике switch/case
           switch (response.status) {
               case 400: throw new Error('Неправильный логин или пароль!')
               case 500: throw new Error('Сервер упал')
               default: throw new Error('Что-то пошло не так, попробуйте позже')
           }
       }

   })
}


//Регистрация
export function registration(login, password, userName) {
   return fetch("https://wedev-api.sky.pro/api/user", {
       method: "POST",
       body : JSON.stringify({
           login: login,
           name: userName,
           password: password,
       })
   })
   .then((response) => {
       //если статус 201 просто продолжаем цепочку промисов
       if (response.status === 201) {
           alert('Вы успешно зарегистрировались!')
           return response.json()
       // в ином случае проверяем код статуса и по разному обрабатываем
       } else {
           //просто попробовать на практике switch/case
           switch (response.status) {
               case 400: throw new Error('Пользователь с таким логином уже сущетсвует!')
               case 500: throw new Error('Сервер упал')
               default: throw new Error('Что-то пошло не так, попробуйте позже')
           }
       }

   })
}