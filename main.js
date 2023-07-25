import { getComments } from "./api.js"
import { postComments } from "./api.js"
import { renderCommentList} from "./renderComments.js"
import { sanitizeHtml } from "./sanitizeHtml.js"
import { initCommentAnswerListeners } from "./renderComments.js"
import { initEditButtonsListeners } from "./renderComments.js"
import { initLikeButtonsListeners } from "./renderComments.js"
import { loginPageRender } from "./loginPage.js"
import { setToken } from "./api.js"
import { renderApp } from "./renderApp.js"
import { checkToken } from "./checkToken.js"

export const nameInput = document.querySelector('#name-input')
export const commentInput = document.querySelector('#comment-input')
export const addButton = document.querySelector('#add-button')
export const commentsBox = document.querySelector('#comments-box')
export const loadingCommentsBox = document.querySelector('#loading-comments')
export const loadingHeadBox = document.querySelector('#loading-head')
export const inputsBox = document.querySelector('.add-form')
export const linkRow = document.querySelector('#login-row')




export let comments = []
//const currentTime = new Date();
//const currentDate = `${date.toLocaleDateString('ru-RU', optionsForDate)}.${String(date.getFullYear()).slice(2)} ${fullTime(date.getHours())}:${fullTime(date.getMinutes())}`;

export let isLoadingToComments = false
export let isLoadingToStartApp = true

//переменная показывающая авторизован ли пользователь
export let isLogin = false

//функция для измения статуса из других модулей
export const setIsLogin = (newValue) => {
    isLogin = newValue
}


export const initAnsverEvent = ({ listElementData, commentTextareaElement, listElement, initLikeEvent, initRedactorEvent, initDeleteEvent, enterComment, nameInputElement, renderListElement }) => {
    for (const comment of document.querySelectorAll('.comments')) {
    comment.addEventListener('click', () => {
    const index = comment.dataset.index;
    const commentText = `${listElementData[index].name}: "${listElementData[index].comment}"`;
    
    commentTextareaElement.value = `QUOTE_BEGIN ${commentText} QUOTE_END`;
    
    renderListElement({ listElement, listElementData, initLikeEvent, initRedactorEvent, initDeleteEvent, initAnsverEvent, commentTextareaElement, enterComment, nameInputElement });
    })
    }
    }
 
const startAt=Date.now();
console.log('Начинаем делать запрос')

function showCommentsListLoader(){
const loader= document.querySelector('#comments-list-loading')
loader.classList.remove("hidden");
}
function hideCommentsListLoader(){
const loader= document.querySelector('#comments-list-loading')
loader.classList.add("hidden");
}

checkToken(() => {
  renderApp(isLogin, () => {   
    getCommentList()
  })
})


function getCommentList(){
    //addButton.disabled= true;
    //addButton.textContent="Элемент добавляется...";
      showCommentsListLoader();
      getComments().then((responseData) => {
               console.log (responseData);
                      const appComments= responseData.comments.map((comment) =>{
                      return{
                      date:`${(new Date(comment.date).getDate().toString().padStart(2, "0")) + "." + (new Date(comment.date).getMonth() + 1).toString().padStart(2, "0") + "." + (new Date(comment.date).getFullYear() - 2000) + " " + (new Date(comment.date).getHours().toString().padStart(2, "0")) + ":" + (new Date(comment.date).getMinutes().toString().padStart(2, "0"))}` ,
                      likes:comment.likes,
                      isLiked: false,
                      text: comment.text,
                      name: comment.author.name,
                };
              });
                comments= appComments;
                renderCommentList({comments,  initLikeButtonsListeners, initCommentAnswerListeners, initEditButtonsListeners});
                        }).then(()=>{
                        //addButton.disabled= false;
                        //addButton.textContent="Написать";
                        
                            })
                            .finally(()=>{
                            hideCommentsListLoader()
                            })
                      };

getCommentList()
document.getElementById('comment-render').style.display = 'none';

function addComment() {
document.getElementById('comment-render').style.display = 'flex';
document.getElementById('add-form-disable').style.display = 'none';
postComments({
text: sanitizeHtml(commentInput.value),
name: sanitizeHtml(nameInput.value)
}).then((response)=>{
           console.log(response);
               if (response.status===201) {
              document.getElementById('comment-render').style.display = 'none';
              return response.json();
                   }if(response.status === 400){
                   throw new Error('Количество символов в сообщении должно быть больше 3')
                   } else {
                   throw new Error ("Кажется что-то пошло не так, попробуйте позже");
                   };
                       }).then(()=>{
                        getCommentList();
                        renderCommentList({comments, initLikeButtonsListeners, initCommentAnswerListeners, initEditButtonsListeners});
                        nameInput.value = ''
                        commentInput.value = ''
                                }).catch((error)=>{
                                alert(error.message)
                                console.warn(error);
                                });

                        };


addButton.addEventListener('click', () => {
addComment()
renderCommentList({comments, initLikeButtonsListeners, initCommentAnswerListeners, initEditButtonsListeners})
nameInput.value = ''
commentInput.value = ''
addButton.classList.add('add-form-button_disable')
})
// Функция создания ответа на комментарий


// Функция создания коллекции и навешивания ивентов на все кнопки Like

//Функция создания коллекции и навешивания ивентов на все кнопки РЕДАКТИРОВАТЬ и СОХРАНИТЬ
// Так же логика измений кнопки с РЕДАКТИРОВАТЬ на СОХРАНИТЬ и обратно


//РЕНДЕРИМ НАШ СПИСОК КОММЕНТАРИЕВ
renderCommentList({comments,  initLikeButtonsListeners, initCommentAnswerListeners, initEditButtonsListeners});

//ВСЕ ОСТАЛЬНЫЕ ФУНКЦИИ НА СТАТИЧЕСКИХ ЭЛЕМЕНТАХ

// Выключение кнопки при не соблюдении условий
function disableBtn() {
if (!nameInput.value == '' && !commentInput.value == '') {
addButton.classList.remove('add-form-button_disable')
} else {
addButton.classList.add('add-form-button_disable')
}
}

// функция подправки времени.
//function fullTime(number) {
//if (String(number).length < 2) {
//return number = `0${number}`
//} else {
//return number = number
//}
//}

// Перекрашиваем поле и включаем/отлючаем кнопку в инпуте имени
nameInput.addEventListener('input', () => {
disableBtn()
nameInput.classList.remove('add-form-name_error')
})

nameInput.addEventListener('blur', () => {
if (nameInput.value == '') {
nameInput.classList.add('add-form-name_error')
} else {
nameInput.classList.remove('add-form-name_error')
}
})

// Перекрашиваем поле и включаем/отлючаем кнопку в инпуте комментариев
commentInput.addEventListener('input', () => {
disableBtn()
commentInput.classList.remove('add-form-comment_error')
})

commentInput.addEventListener('blur', () => {
if (commentInput.value == '') {
commentInput.classList.add('add-form-comment_error')
} else {
commentInput.classList.remove('add-form-comment_error')
}
})


linkRow.addEventListener('click', () => {
  loginPageRender(() => {
    getCommentList()
  })
})
//логика кнопки добавления комментария

