const urlParams = new URLSearchParams(window.location.search),
  id = urlParams.get("id"),
  blogs = document.querySelector(".posts");
let attach = [];

async function fetchPost() {
  let postData;
  await database.ref("posts/" + id).on("value", (snap) => {
    postData = snap.val();
    let storageRef = firebase.storage().ref(`images/${id}/${postData.image}`);
    storageRef.getDownloadURL().then(function (url) {
      console.log(url);
    });
  });
}
function represent(ele, i, linked) {
  let post = document.createElement("article"),
    image = document.createElement("img"),
    title = document.createElement("header"),
    div1 = document.createElement("div"),
    div2 = document.createElement("div"),
    category = document.createElement("span"),
    date = document.createElement("span"),
    author = document.createElement("span"),
    link = document.createElement("a"),
    text = document.createElement("p");
  let storageRef = firebase.storage().ref(`images/${i}/${ele.image}`);
  storageRef.getDownloadURL().then(function (url) {
    image.src = url;
  });
  if (ele.attachments) {
    for (let index = 0; index < ele.attachments.length; index++) {
      const attachments = ele.attachments[index];
      attach.push(attachments);
    }
  }
  link.setAttribute("href", "./posts.html" + `?id=${i}`);
  let dateSpan = new Date(ele.date).toUTCString().split(":")[0].slice(0, -2);
  title.innerText = ele.title;
  text.innerText = ele.body;
  author.innerText = ele.author;
  date.innerText = dateSpan;
  category.innerText = ele.category;
  link.innerText = "continue reading";
  div1.append(category, date, author);
  linked
    ? (text.innerText = text.innerText.split(".").join(".\n"),blogs.append(title, image, div1, text, div2),
      attach ? addAttach(attach) : "")
    : (div2.append(link),
      post.append(title, image, div1, text, div2),
      blogs.append(post),
      loadder.classList.remove("active"));
  splitp();
}

async function logged() {
  await database.ref(`posts/`).on("value", (e) => {
    represent(e.val()[id], id, 1);
  });
}
if (id != null) {
  logged();
} else {
  database.ref(`posts/`).on("value", (e) => {
    let posts = e.val();
    Array(...posts).map((ele, i) => {
      represent(ele, i, 0);
    });
  });
}
async function addAttach(attach) {
  let div2 = document.createElement("div");
  for (let index = 0; index < attach.length; index++) {
    const attachment = attach[index];
    let storageRef = firebase.storage().ref(`attachments/${id}/${attachment}`);
    await storageRef.getDownloadURL().then(function (attachLink) {
      let download = document.createElement("a");
      download.href = attachLink;
      download.innerText = "attachment " + index;
      div2.append(download);
    });
    blogs.append(div2);
    loadder.classList.remove("active");
  }
}
