import './style.css'

const tabs = document.querySelectorAll('.tab-button');
let selectedGen = 1;

const  card = document.querySelector(".card");
const dialog = document.querySelector(".myDialog");
const dialogExit = document.querySelector("#dialog-exit");
const infoButton = document.querySelectorAll(".info-button");
let selectedData = "about";
const about =
    `<h1>Species - </h1>
    <h1>Height - </h1>
    <h1>Weight - </h1>
    <h1>Abilities - </h1>
    `;
const baseStat =
    `<h1>HP - </h1>
    <h1>Attack - </h1>
    <h1>Defense - </h1>
    <h1>Sp.Atk - </h1>
    <h1>Sp.Def - </h1>
    <h1>Speed - </h1>
    <h1>Total - </h1>
    `;
const dialogInfo = document.querySelector(".dialog-info");

//gen selected
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => {
            t.classList.remove('border-b-2', 'border-blue-500', 'font-bold', 'bg-white');
        });
        tab.classList.add('border-b-2', 'border-blue-500', 'font-bold', 'bg-white');

        selectedGen = tab.getAttribute('data-gen');
        console.log('Selected Generation:', selectedGen);
    });
});

//dialog
card.addEventListener('click', () => {
    card.classList.remove('card')
    card.classList.add('card-clicked');
    dialog.showModal();
});

dialogExit.addEventListener('click', () => {
    dialog.close();
})
dialogInfo.innerHTML = about;

//dialog About and Base stats
infoButton.forEach(but => {
    but.addEventListener('click', () => {
        but.classList.add('bg-gray-500');

        selectedData = but.getAttribute('value');
        console.log('Now you see', selectedData);
        if (selectedData === 'baseStat') {
            dialogInfo.innerHTML = baseStat;
        }
        else  {
            dialogInfo.innerHTML = about;
        }
    });
});
