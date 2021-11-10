const gallery = document.getElementById('gallery');
const searchBar = document.querySelector('.search-container');
const DEFAULT_RANDOM_USERS = 'https://randomuser.me/api/?results=12&nat=au,ca,gb,nz,us';


/*  =============================
         HELPER FUNCTIONS
    =============================
*/

function summonCards(users){
    for(let user of users){
    let card = `
        <div class="card">
            <div class="card-img-container">
                <img class="card-img" src="${user.picture.large}" alt="profile picture">
            </div>
            <div class="card-info-container">
                <h3 id="${user.name.first}-${user.name.last}" class="card-name cap">${user.name.first} ${user.name.last}</h3>
                <p class="card-text">${user.email}</p>
                <p class="card-text cap">${user.location.city}, ${user.location.state}</p>
            </div>
        </div>
    `;
    gallery.insertAdjacentHTML('beforeend', card);
    }   
}
function summonModal(users, id){
    const user = users.filter(result => `${result.name.first}-${result.name.last}` === id)[0];
    const h3List = document.querySelectorAll('.card h3');
    let cards =[];
    for(let h3 of h3List){
        cards.push(h3.id)
    }
    const index = cards.indexOf(`${user.name.first}-${user.name.last}`);
    console.log(index);
    const birthday = () => {
        const date = user.dob.date.slice(0,10)
        const splitDate = date.split('-');
        return `${splitDate[1]}/${splitDate[2]}/${splitDate[0]}`
    }
    let modal = `
        <div class="modal-container">
            <div class="modal">
                <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                <div class="modal-info-container">
                    <img class="modal-img" src="${user.picture.large}" alt="profile picture">
                    <h3 id="name" class="modal-name cap">${user.name.first} ${user.name.last}</h3>
                    <p class="modal-text">${user.email}</p>
                    <p class="modal-text cap"${user.location.city}</p>
                    <hr>
                    <p class="modal-text">${user.phone}</p>
                    <p class="modal-text">${user.location.street.number} ${user.location.street.name}, ${user.location.city}, ${user.location.state} ${user.location.postcode}</p>
                    <p class="modal-text">Birthday: ${birthday()}</p>
                </div>
            </div>
            <div class="modal-btn-container">
                <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                <button type="button" id="modal-next" class="modal-next btn">Next</button>
            </div>
        </div>`
    gallery.insertAdjacentHTML('beforebegin', modal);
    document.getElementById('modal-close-btn')
        .addEventListener('click', (e) => document.querySelector(".modal-container").remove())

    document.getElementById('modal-prev')
        .addEventListener('click', () => {
            if(index > 0){
                let id = cards[index - 1]
                document.querySelector(".modal-container").remove()
                summonModal(users, id)
            }
        })

    document.getElementById('modal-next')
        .addEventListener('click', () => {
            if(index < cards.length - 1){
                let id = cards[index + 1]
                document.querySelector(".modal-container").remove()
                summonModal(users, id)
                
            }
        })
    
}

const search =`
    <form action="#" method="get">
        <input type="search" id="search-input" class="search-input" placeholder="Search...">
        <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    </form>`;
searchBar.insertAdjacentHTML('beforeend', search)
/*  =============================
         FETCH FUNCTIONS
    =============================
*/

async function fetchUsers(url){
    const response = await fetch(url);
    const results = await response.json();
    return results
}
const usersPromise = fetchUsers(DEFAULT_RANDOM_USERS)
/*  =============================
         Function Calls
    =============================
*/
usersPromise.then(data => {
    summonCards(data.results);
})

/*  =============================
         EVENT LISTENERS
    =============================
*/
gallery.addEventListener('click', e => {
    if(e.target.className === 'card'){
        const id = e.target.querySelector('h3').id;
        usersPromise.then(data => {
            const users = data.results
            summonModal(users, id);
        })

    }
})
searchBar.addEventListener('submit', e => {
    e.preventDefault();
    let value = e.target.querySelector('input').value.toLowerCase();
    usersPromise.then(data => {
        let users = data.results.filter(result => {
            let name = `${result.name.first.toLowerCase()} ${result.name.last.toLowerCase()}`
            return name.includes(value);
        });
        gallery.innerHTML = '';
        summonCards(users);
    })
})



