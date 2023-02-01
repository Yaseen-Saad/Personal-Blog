let toTop = document.querySelector('.toTop'),
    nav = document.querySelector('nav'),
    loadder = document.getElementById('loadder'),
    page = location.href.split("/")[location.href.split("/").length - 1].split(".")[0],
    firebaseConfig = {
        apiKey: "AIzaSyAgDzPGX86UzUdFwDWqVThL5OOwEuBsPWI",
        authDomain: "deci-1.firebaseapp.com",
        databaseURL: "https://deci-1-default-rtdb.firebaseio.com",
        projectId: "deci-1",
        storageBucket: "deci-1.appspot.com",
        messagingSenderId: "750852675878",
        appId: "1:750852675878:web:c52d9a8a8e83fa0d7d49e7",
        measurementId: "G-BS29GCNDVY"
    };
firebase.initializeApp(firebaseConfig);
let database = firebase.database(),
    user,
    users
database.ref(`users/`).on("value", (e) => {
    user = Object.keys(e.val()).length;
    users = e.val()
})
toTop.onclick = () => {
    scrollTo({ top: 0, behavior: "smooth" })
}
onscroll = () => {
    if (scrollY >= 300) {
        toTop.classList.add('active')
    }
    else {
        toTop.classList.remove('active')
    }
}

function splitp(){
    let parargraphs = Array(...document.querySelectorAll('article > p'))
if (parargraphs)
    parargraphs.map(p => {
        if (p.innerText.split("")[p.innerText.length - 1] =="."&&
        p.innerText.split("")[p.innerText.length - 2] =="."&&
        p.innerText.split("")[p.innerText.length - 3] =="." ) {
            
        }else{
            p.innerText = p.innerText.split(" ").slice(0, 65).join(" ") + "...";
        }
    })
}