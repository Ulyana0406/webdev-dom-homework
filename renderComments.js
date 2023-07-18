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