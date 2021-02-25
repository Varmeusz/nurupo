const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:5001' : 'https://awaclawczyk.xyz/nurupo';
const form = document.querySelector('form');
const loadingElement = document.querySelector('.loading');
loadingElement.style.display = "none";

form.addEventListener('submit', async (e) =>{
    e.preventDefault();
    const formData = new FormData(form);
    const name = formData.get("name");
    const content = formData.get("content");
    const post = {
        name,
        content
    };
    form.style.display = 'none';
    loadingElement.style.display = '';
    fetch(API_URL+"/nurupo", {
        method: 'POST',
        body: (formData),
        headers:{
            
        },
    }).then(response => response.json())
      .then(createdNurupo => {
        var container = document.createElement("div");
        var header = document.createElement("h3");
        var img = document.createElement("img");
        var small = document.createElement("small");
        header.innerHTML = element[0];
        container.appendChild(header);

        img.src = API_URL + "/uploads?id="+createdNurupo._id;
        container.appendChild(img);

        small.innerHTML = createdNurupo.created;
        container.appendChild(small);

        document.querySelector(".nurupos").prepend(container);
        setTimeout(()=> {
            loadingElement.style.display = 'none';
            form.style.display = '';
        }, 100);
      })
});

loadNurupos = (e) =>{
    var ids = [];
    fetch(API_URL+"/nurupos", {
        method: 'GET',
    }).then(response => response.json())
      .then(nuruposArr => {
        ids = nuruposArr;
        console.log(ids);
        ids.forEach(element => {
            var container = document.createElement("div");
            var header = document.createElement("h3");
            var img = document.createElement("img");
            var small = document.createElement("small");

            header.innerHTML = element[0];
            container.appendChild(header);

            img.src = API_URL + "/uploads?id="+element[1];
            container.appendChild(img);

            small.innerHTML = element[2];
            container.appendChild(small);

            document.querySelector(".nurupos").appendChild(container);
        });
    })
};
loadNurupos();
