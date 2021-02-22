const API_URL = 'https://awaclawczyk.xyz/nurupo';
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
          var img = document.createElement("img");
          img.src =  API_URL+"/uploads?id="+createdNurupo;
          document.querySelector(".nurupos").prepend(img);
          img = null;
          setTimeout(()=> {
            loadingElement.style.display = 'none';
            form.style.display = '';}, 100);
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
            var div = document.createElement("h3");
            div.innerHTML = element[0];
            container.appendChild(div);
            var img = document.createElement("img");
            img.src = API_URL + "/uploads?id="+element[1];
            container.appendChild(img);
            img = null; 
            div = document.createElement("small");
            div.innerHTML = element[2];
            container.appendChild(div);
            document.querySelector(".nurupos").appendChild(container);
        });
    })
};
loadNurupos();
