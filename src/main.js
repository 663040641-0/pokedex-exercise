import './style.css'
import generations from "./data/generation.js";

let pageOps = '';
const tabs = document.querySelectorAll('.tab-button');
let selectedGen = 1;
const pageOp = document.querySelectorAll('.page-button');
const itemPerPage = document.querySelector('#itemPerPage');

const pContent = document.querySelector('#pokemon-card-container');
const  card = document.querySelector(".card");
const dialog = document.querySelector(".myDialog");
const dialogExit = document.querySelector(".dialog-exit");
const infoButton = document.querySelectorAll(".info-button");
let selectedData = "about";
let currentGen = generations.find(g => g.id === 1);
let currentPage = 0;
let itemsPerPages = 10;

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
const bodyElement = document.querySelector('body');

//theme mode selection
const modeSelection = document.querySelector("#dark-mode-select");
let mode = 'system'
modeSelection.addEventListener("change", () => {
    mode = modeSelection.value;

    if (mode === 'system') {
        bodyElement.classList.add('bg-white', 'dark:bg-gray-800', 'text-black', 'dark:text-white');
        bodyElement.classList.remove('bg-black', 'text-white');

        tabs.forEach(tab => {
            tab.classList.add('bg-white', 'dark:bg-gray-800', 'hover:bg-gray-200', 'dark:hover:bg-black');
            tab.classList.remove('bg-gray-800', 'hover:bg-black');
        });
    } else if (mode === 'light') {
        bodyElement.classList.add('bg-white', 'text-black');
        bodyElement.classList.remove('bg-black', 'text-white', 'dark:bg-gray-800', 'dark:text-white');

        tabs.forEach(tab => {
            tab.classList.add('bg-white', 'hover:bg-gray-200');
            tab.classList.remove('bg-gray-800', 'hover:bg-black', 'dark:bg-gray-800', 'dark:hover:bg-black');
        });
    } else {
        bodyElement.classList.add('bg-gray-800', 'text-white');
        bodyElement.classList.remove('bg-white', 'text-black', 'dark:bg-gray-800', 'dark:text-white');

        tabs.forEach(tab => {
            tab.classList.add('bg-gray-800', 'hover:bg-black');
            tab.classList.remove('bg-white', 'hover:bg-gray-200', 'dark:bg-gray-800', 'dark:hover:bg-black');
        });
    }

    console.log("Theme mode is:", mode);
});


//gen selected
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => {
            t.classList.remove('border-b-2', 'border-blue-500', 'font-bold' );
        });
        tab.classList.add('border-b-2', 'border-blue-500', 'font-bold');

        const genId = Number(tab.getAttribute('data-gen'));
        currentGen = generations.find(g => g.id === genId);
        currentPage = 0;
        renderCurrentPage();
    });

});

const genSelect = document.querySelector("#gen-select");
genSelect.addEventListener('change', () => {
    selectedGen = Number(genSelect.value);
    currentGen = generations.find(g => g.id === selectedGen);
    currentPage = 0;
    renderCurrentPage();
});


//item display per page
itemPerPage.addEventListener('change', (e) => {
    itemsPerPage = parseInt(e.target.value);
    currentPage = 0;
    renderCurrentPage();
});

//previous page and next page
let itemsPerPage = 10;
pageOp.forEach(pageBut => {
    pageBut.addEventListener('click', () => {
        const maxPages = Math.ceil(currentGen.all / itemsPerPage);

        if (pageBut.value === 'pre' && currentPage > 0) {
            currentPage--;
            renderCurrentPage();
        } else if (pageBut.value === 'next' && currentPage < maxPages - 1) {
            currentPage++;
            renderCurrentPage();
        }
    });
});
//render pages
async function renderCurrentPage() {
    const startId = currentGen.offset + 1 + currentPage * itemsPerPage;
    const endId = Math.min(currentGen.offset + currentGen.all + 1, startId + itemsPerPage);

    pContent.innerHTML = '';

    for (let id = startId; id < endId; id++) {
        await fetchPokemon(id, pContent);
    }
}

//dialog
document.addEventListener('click', function (e) {
    const card = e.target.closest('.card');
    if (card) {
        const dialog = card.nextElementSibling.querySelector('dialog');
        if (!dialog) return;

        // ✅ Reset dialog to "About" on open
        const pokemon = JSON.parse(dialog.dataset.pokemon);
        const dialogInfo = dialog.querySelector('.dialog-info');
        const infoButtons = dialog.querySelectorAll('.info-button');

        // Update content
        dialogInfo.innerHTML = `
      <h1>Species - ${pokemon.species}</h1>
      <h1>Height - ${pokemon.height}</h1>
      <h1>Weight - ${pokemon.weight}</h1>
      <h1>Abilities - ${pokemon.abilities.join(', ')}</h1>
    `;

        // Reset button styles
        infoButtons.forEach(b => {
            b.classList.remove('border-b-2', 'border-blue-500', 'font-bold', 'bg-white');
        });

        const aboutButton = dialog.querySelector('.info-button[value="about"]');
        if (aboutButton) {
            aboutButton.classList.add('border-b-2', 'border-blue-500', 'font-bold', 'bg-white');
        }

        dialog.showModal();
    }

    // Exit button handling
    if (e.target.classList.contains('dialog-exit')) {
        e.target.closest('dialog')?.close();
    }
});

document.addEventListener('click', function (e) {
    const dialog = e.target.closest('dialog');
    if (!dialog) return;

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
document.addEventListener('click', (e) => {
    const infoBtn = e.target.closest('.info-button');
    if (!infoBtn) return;

    const selectedData = infoBtn.getAttribute('value');
    const dialog = infoBtn.closest('dialog');
    const dialogInfo = dialog.querySelector('.dialog-info');

    if (!dialogInfo) return;

    const pokemon = JSON.parse(dialog.dataset.pokemon);

    if (selectedData === 'baseStat') {
        dialogInfo.innerHTML = Object.entries(pokemon.stats).map(([key, value]) => {
            const label = key.replace(/([A-Z])/g, ' $1').toUpperCase(); // spAtk → SP ATK
            const percent = Math.round((value / 255) * 100);

            return `
      <div class="stat-row mb-2">
        <span class="stat-label inline-block w-24 font-bold">${label}</span>
        <div class="stat-bar-container bg-gray-300 w-full h-6 rounded-full overflow-hidden inline-block align-middle">
          <div class="stat-bar bg-blue-500 text-white text-sm h-full flex items-center justify-end pr-2" style="width: ${percent}%;">
            ${value}
          </div>
        </div>
      </div>
    `;
        }).join('') + `
    <div class="stat-total font-bold mt-4">Total: ${pokemon.totalStat}</div>
  `;
    }
    else {
        dialogInfo.innerHTML = `
      <h1>Species - ${pokemon.species}</h1>
      <h1>Height - ${pokemon.height}</h1>
      <h1>Weight - ${pokemon.weight}</h1>
      <h1>Abilities - ${pokemon.abilities.join(', ')}</h1>
    `;
    }
});



//create card
function createCardAndDialog(pokemon) {
    return `
    <div class="card type-${pokemon.types[0]}">
      <div class="card-title">
        <h1>${pokemon.name}</h1>
        <h1>#${pokemon.id.toString().padStart(3, '0')}</h1>
        <div>
          ${pokemon.types.map(type => `<h2 class="card-type">${type}</h2>`).join('')}
        </div>
      </div>
      <img src="${pokemon.imgUrl}" alt="${pokemon.name}" width="60%" height="60%" />
    </div>
    <div class="dialog-container">
      <dialog class="myDialog type-${pokemon.types[0]}" data-pokemon='${JSON.stringify(pokemon)}'>
        <button class="dialog-exit"> close </button>
        <div class="dialog-title">
          <h1>#${pokemon.id.toString().padStart(3, '0')}</h1>
          <h1>${pokemon.name}</h1>
          <div class="dialog-element">
            ${pokemon.types.map(type => `<h2 class="card-type">${type}</h2>`).join('')}
          </div>
        </div>
        <div class="dialog-img">
          <img src="${pokemon.imgUrl}" alt="${pokemon.name}" width="300" height="300" />
        </div>
        <div class="dialog-white-plate">
          <div class="dialog-info-button">
            <button value="about" class="info-button w-full hover:bg-gray-200">About</button>
            <button value="baseStat" class="info-button w-full hover:bg-gray-200">Base stats</button>
          </div>
          <div class="dialog-info"></div>
        </div>
      </dialog>
    </div>
  `;
}



//fetch function
async function fetchPokemon(id, container, signal) {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`, { signal });
    const data = await res.json();

    const statMap = {
        hp: "hp",
        attack: "attack",
        defense: "defense",
        "special-attack": "spAtk",
        "special-defense": "spDef",
        speed: "speed"
    };

    const stats = {};
    let total = 0;

    data.stats.forEach(s => {
        const key = statMap[s.stat.name];
        const value = s.base_stat;
        stats[key] = value;
        total += value;
    });

    const pokemon = {
        name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
        id: data.id,
        types: data.types.map(t => t.type.name),
        imgUrl: data.sprites.front_default,
        species: data.species.name,
        height: data.height + '0',
        weight: data.weight,
        abilities: data.abilities.map(a => a.ability.name),
        stats: stats,
        totalStat: total
    };

    container.insertAdjacentHTML('beforeend', createCardAndDialog(pokemon));
}


//gen to fetch
const gen1 = generations.find(g => g.id === 1);
const gen2 = generations.find(g => g.id === 2);
const gen3 = generations.find(g => g.id === 3);
const gen4 = generations.find(g => g.id === 4);
const gen5 = generations.find(g => g.id === 5);
const gen6 = generations.find(g => g.id === 6);
const gen7 = generations.find(g => g.id === 7);
const gen8 = generations.find(g => g.id === 8);
const gen9 = generations.find(g => g.id === 9);

//load at first web load
document.addEventListener('DOMContentLoaded', () => {
    const defaultGen = generations.find(g => g.id === 1);
    bodyElement.classList.add('bg-white', 'dark:bg-gray-800', 'text-black', 'dark:text-white');
    if (defaultGen) {
        const defaultTab = document.querySelector(`.tab-button[data-gen="1"]`);
        tabs.forEach(tab => {
            tab.classList.add('bg-white', 'dark:bg-gray-800', 'hover:bg-gray-200', 'dark:hover:bg-black');
            tab.classList.remove('bg-gray-800', 'hover:bg-black');
        });
        if (defaultTab) {
            defaultTab.classList.add('border-b-2', 'border-blue-500', 'font-bold');
        }
        currentPage = 0;
        renderCurrentPage();
    }
});

