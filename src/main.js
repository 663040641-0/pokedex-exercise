import './style.css'
import generations from "./data/generation.js";

let pageOps = '';
const tabs = document.querySelectorAll('.tab-button');
let selectedGen = 1;
const pageOp = document.querySelectorAll('.page-button');
const itemPerPage = document.querySelector('#itemPerPage');
let itemsPerPage = 10;

const  card = document.querySelector(".card");
const dialog = document.querySelector(".myDialog");
const dialogExit = document.querySelector(".dialog-exit");
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

let limitPage = 10;

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

//item display per page
itemPerPage.addEventListener('change', (e) => {
    itemsPerPage = itemPerPage.value;
    console.log(itemsPerPage);
})

//previous page and next page
pageOp.forEach(pageBut => {
    pageBut.addEventListener('click', (e) => {
        if (pageBut.value === 'pre') {
            console.log(`${pageBut.value} clicked`);
        }
        else {
            console.log(`${pageBut.value} clicked`);
        }
    })
})

//dialog
card.addEventListener('click', () => {
    dialog.showModal();
});

dialogExit.addEventListener('click', () => {
    dialog.close();
})

dialog.addEventListener('click', (e) => {
    const rect = dialog.getBoundingClientRect();
    const isInDialog =
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width;
    if (!isInDialog) {
        dialog.close();
    }
});

dialogInfo.innerHTML = about;

//dialog About and Base stats
infoButton.forEach(but => {
    but.addEventListener('click', () => {
        infoButton.forEach(b => {
            b.classList.remove('border-b-2', 'border-blue-500', 'font-bold', 'bg-white');
        });
        but.classList.add('border-b-2', 'border-blue-500', 'font-bold', 'bg-white');

        selectedData = but.getAttribute('value');
        if (selectedData === 'baseStat') {
            dialogInfo.innerHTML = baseStat;
        } else {
            dialogInfo.innerHTML = about;
        }
    });
});

