import { getComments } from "./api.js"
import { postComments } from "./api.js"
const nameInput = document.querySelector('#name-input')
const commentInput = document.querySelector('#comment-input')
const addButton = document.querySelector('#add-button')
const commentsBox = document.querySelector('#comments-box')

//const currentTime = new Date();
//const currentDate = `${date.toLocaleDateString('ru-RU', optionsForDate)}.${String(date.getFullYear()).slice(2)} ${fullTime(date.getHours())}:${fullTime(date.getMinutes())}`;
const renderCommentList = () => {
const commentsHtml = comments.map((comment, index) => {
  return `<li class="comment">
       <div class="comment-header">
       <div>${comment.name}</div>
       <div>${comment.date}</div>
       </div>
            <div class="comment-body">
            <div data-answer='${index}' class="comment-text">
            ${(comment.isEdit) ? `<textarea class="comment-edit">${comment.text}</textarea>` : `${comment.text}` }
            </div>
                  <button id='edit-button' data-index='${index}' class="add-edit-button">${comment.isEdit ? `Сохранить` : 'Редактировать'}</button>
                   </div>
                          <div class="comment-footer">
                          <div class="likes">
                          <span class="likes-counter">${comment.likes}</span>
                          <button data-like='${index}' class="like-button ${(comment.isLiked) ? `-active-like` : ''}"></button>
                          </div>
                          </div>
   </li>
`
}).join('')


commentsBox.innerHTML = commentsHtml.replaceAll("→", "<div class='quote'>").replaceAll("←", "</div class='quote'>");


initLikeButtonsListeners();
initEditButtonsListeners();
initCommentAnswerListeners();
}

let comments =[]

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
                renderCommentList();
                        }).then(()=>{
                        //addButton.disabled= false;
                        //addButton.textContent="Написать";
                        document.getElementById('add-form-disable').style.display = 'flex';
                            })
                            .finally(()=>{
                            hideCommentsListLoader()
                            })
                      };

getCommentList()
document.getElementById('comment-render').style.display = 'none';

const sanitizeHtml= (htmlString)=>{
return htmlString
.replaceAll("&", "&amp;")
.replaceAll("<", "&lt;")
.replaceAll(">", "&gt;")
.replaceAll('"', "&quot;");
};
getCommentList();


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
                        renderCommentList();
                        nameInput.value = ''
                        commentInput.value = ''
                                }).catch((error)=>{
                                alert(error.message)
                                console.warn(error);
                                });

                        };


addButton.addEventListener('click', () => {
addComment()
renderCommentList()
nameInput.value = ''
commentInput.value = ''
addButton.classList.add('add-form-button_disable')
})
// Функция создания ответа на комментарий
const initCommentAnswerListeners = () => {
const commentAnswer = document.querySelectorAll(".comment-text")
commentAnswer.forEach((answer, index) => {
answer.addEventListener('click', () => {
if(answer.children.length == 0) { //Дополнительная проверка, чтоб не отрабатывал клик на редактируемый комментарий
commentInput.value = `→${comments[index].userName}

${comment[index].text}←
`
}
})
})
}

// Функция создания коллекции и навешивания ивентов на все кнопки Like
const initLikeButtonsListeners = () => {
const likeButtons = document.querySelectorAll('.like-button')
likeButtons.forEach((likeButton, index) => {
likeButton.addEventListener('click', () => {
if (comments[index].isLiked === false ) {
comments[index].isLiked = true;
comments[index].likes += 1
} else {
comments[index].isLiked = false;
comments[index].likes -= 1

}

renderCommentList()
})
})
}
//Функция создания коллекции и навешивания ивентов на все кнопки РЕДАКТИРОВАТЬ и СОХРАНИТЬ
// Так же логика измений кнопки с РЕДАКТИРОВАТЬ на СОХРАНИТЬ и обратно
const initEditButtonsListeners = () => {
const editButtons = document.querySelectorAll('.add-edit-button')
editButtons.forEach((editButton, index) => {
editButton.addEventListener('click', () => {
const editCommentText = document.querySelector('.comment-edit')
if (comments[index].isEdit) {
if (!editCommentText.value == '') {
comments[index].isEdit = false
comments[index].text = editCommentText.value
} else {
comments[index].isEdit = false
comments[index].text = "Комментарий не может быть пустым"
}
} else {
comments[index].isEdit = true
}

renderCommentList();
})
})
}

//РЕНДЕРИМ НАШ СПИСОК КОММЕНТАРИЕВ
renderCommentList();

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
function fullTime(number) {
if (String(number).length < 2) {
return number = `0${number}`
} else {
return number = number
}
}
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

//логика кнопки добавления комментария