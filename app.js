/*---------------EVENTS---------------*/
document.addEventListener('DOMContentLoaded', ()=>{
    fetchMissions();
    loadModal();
});

/*---------------VARIABLES & SELECTORS---------------*/

const urlFetchMission = 'https://api.spacexdata.com/v3/launches';
const containerMissions = document.getElementById('container-missions');
const titleModal = document.getElementById('exampleModalLabel');
let bodyModal = document.querySelector('.modal-body');

/*---------------FUNCTIONS CARDS---------------*/

async function fetchMissions() {
    try {
        // fetch(urlFetchMission)
        // .then( response => {
        //     // console.log(response);
        //     return response.json()
        // })
        // .then(data => {
        //     //console.log(data);
        //     showMissions(data);
        // });

        const response = await fetch(urlFetchMission);
        const data = await response.json();

        showMissions(data);
        
    } catch (error) {
        console.error('Something was wrong!');
    };
};

function showMissions(missions) {
    //console.log(missions);
    let html = '';
    
    missions.forEach(mission => {
        //console.log(mission);
        
        const {mission_name, launch_year, flight_number} = mission
        const {mission_patch} = mission.links;

        html += `
        <div class="card text-center" style="width: 18rem;">
            <img src="${mission_patch}" class="card-img-top" alt="">
            <div class="card-body">
                <h5 class="card-title">${mission_name}</h5>
                <p class="card-text">Launch year: ${launch_year}</p>
            
                <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" title="${mission_name}" flight_number="${flight_number}">
                ABOUT
                </button>
            </div>
        </div>
        `;
         
    });

    containerMissions.innerHTML = html;
};


/*---------------FUNCTIONS MODAL---------------*/
function loadModal() {
    containerMissions.addEventListener('click', loadDetailsModal)
};

function loadDetailsModal(event) {

    /*-----Se destructura la informacion del boton que agregamos antes-----*/

    const flightNumber = event.target.getAttribute('flight_number');

    fetchLModal(flightNumber)
};

async function fetchLModal(flight) {
    try {
        const response = await fetch(`https://api.spacexdata.com/v3/launches/${flight}`)
        const datas = await response.json();

        modalInformation(datas);
    } catch (error) {
        console.error('Something was wrong!');
    };

};

function modalInformation(data) {
    // console.log(data); //En este caso 'data' es el objeto
    //console.log(data.rocket.rocket_name);

    const {rocket_name} = data.rocket;
    const {rocket_type} = data.rocket;
    const {land_success} = data.rocket.first_stage.cores[0];
    const {youtube_id} = data.links;

    bodyModal.innerHTML = `

    <table class="table">
        <thead>
        <iframe width="465" height="315" src="https://www.youtube.com/embed/${youtube_id}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            <tr>
                <th>Cohete:</th>
                <th id="rocketName">${rocket_name}</th>
            </tr>
            <tr>
                <th>Tipo Cohete:</th>
                <th id="rocketType">${rocket_type}</th>
            </tr>
            <tr>
                <th>Exito Lanzamiento:</th>
                <th id="launchSuccess">${land_success}</th>
            </tr>
        </thead>
    </table>

    `;
};