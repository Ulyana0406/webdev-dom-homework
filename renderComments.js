
const commentsBox = document.querySelector('#comments-box')
export const renderCommentList = ({comments, initLikeButtonsListeners, initCommentAnswerListeners, initEditButtonsListeners}) => {
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

    export const initCommentAnswerListeners = (comments) => {
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

    export const initLikeButtonsListeners = (comments) => {
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
          
          renderCommentList({comments, initLikeButtonsListeners, initCommentAnswerListeners, initEditButtonsListeners})
          })
          })
          }

      export  const initEditButtonsListeners = (comments) => {
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
               
               renderCommentList({comments, initLikeButtonsListeners, initCommentAnswerListeners, initEditButtonsListeners});
               })
               })
               }

 