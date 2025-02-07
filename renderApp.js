import { inputsBox, linkRow, nameInput } from "./main.js"

// в зависимости от isLogin меняем отображение элементов
export const renderApp = (boolean, call) => {
    console.log(inputsBox)
    console.log(linkRow)
    inputsBox.classList.add('hidden')
    if (boolean) {
        inputsBox.classList.remove('hidden')
        call() 
    } else {
        inputsBox.classList.add('hidden')
        linkRow.classList.remove('hidden')
        nameInput.setAttribute("readonly", "readonly")        
        call()
    }
}