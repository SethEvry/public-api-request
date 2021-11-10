const gallery = document.getElementById('gallery');
const DEFAULT_RANDOM_USERS = 'https://randomuser.me/api/?results=12';


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
        const user = users.filter(result =>`${result.name.first}-${result.name.last}` === id)[0]
        const index = users.indexOf(user);
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
                        <p class="modal-text">${user.location.street}, ${user.location.city}, ${user.location.state} ${user.location.postcode}</p>
                        <p class="modal-text">Birthday: 10/21/2015 ${user.dob.date}</p>
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
                let id = `${users[index-1].name.first}-${users[index-1].name.last}`
                document.querySelector(".modal-container").remove()
                summonModal(users, id)
            }
        })
    document.getElementById('modal-next')
        .addEventListener('click', () => {
            if(index < users.length){
                let id = `${users[index+1].name.first}-${users[index+1].name.last}`
                document.querySelector(".modal-container").remove()
                summonModal(users, id)
            }
        })
    
}


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



