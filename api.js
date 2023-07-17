export function getComments(){
  return  fetch("https://wedev-api.sky.pro/api/v1/uliana-ustinova/comments", {
        method: "GET"
           }).then((response) => {
           return response.json();
           });
};

export function postComments(text,name){
   return fetch("https://wedev-api.sky.pro/api/v1/uliana-ustinova/comments", {
       method: "POST",
       body: JSON.stringify({
       date: new Date(),
       likes:0,
       isLiked: false,
       text: text ,
       name: name,
       })
    });
};