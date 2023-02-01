let showpassword = Array(
  ...document.querySelectorAll("main.login>section section form p span")
);
document.querySelector(".upload > h2").addEventListener("paste", handlePaste);
document
  .querySelector(".upload > p:nth-of-type(1)")
  .addEventListener("paste", handlePaste);

function handlePaste(e) {
  e.preventDefault();
  let text = e.clipboardData.getData("text/plain");
  document.execCommand("insertText", false, text);
}

showpassword.map((ele) => {
  ele.onclick = () => {
    Array(...ele.children).map((eye) => eye.classList.toggle("active"));
    if (ele.children[1].classList.contains("active")) {
      ele.parentNode.children[0].type = "text";
    } else ele.parentNode.children[0].type = "password";
  };
});
let formTogller = Array(...document.querySelectorAll("main >section > div>p"));
let forms = Array(...document.querySelectorAll("main >section > section form"));
formTogller.map((ele) => {
  ele.onclick = (e) => {
    formTogller.map((element) => element.classList.remove("active"));
    forms.map((form) =>
      form.getAttribute("name") == e.target.getAttribute("id")
        ? form.classList.add("active")
        : form.classList.remove("active")
    );
    e.target.classList.add("active");
  };
});
async function putFiles(postid, files, ref) {
  for (let i = 0; i < files.length; i++) {
    let File = files[i];
    let storageRef = await firebase
      .storage()
      .ref(ref + "/" + postid + "/" + File.name);
    let task = storageRef.put(File);
    loadder.classList.add("active");
    task.on("state_changed", function (snapshot) {
      progress = (snapshot.bytesTransferred * 100) / snapshot.totalBytes;
      console.log(progress);
    });
    if (i == files.length - 1) {
      await task.on("state_changed", function (snapshot) {
        progress = (snapshot.bytesTransferred * 100) / snapshot.totalBytes;
        if (progress == 100) {
          loadder.classList.remove("active");
        }
      });
    }
  }
}
function putPost(id, components, name, fileName, title, body, category) {
  database.ref("posts/" + id).set({
    image: fileName,
    date: Date.now(),
    author: name,
    category: category ? category : 0,
    attachments: components ? components : false,
    title: title,
    body: body,
  });
}
function logged(email, name) {
  if (sessionStorage.getItem("logged")) {
    email = sessionStorage.getItem("email");
    name = sessionStorage.getItem("name");
  } else {
    sessionStorage.setItem("logged", true);
    sessionStorage.setItem("email", email);
    sessionStorage.setItem("name", name);
  }
  document.querySelector(".login").remove();
  document.querySelector(".upload").style.display = "flex";

  attachbutton.onclick = () => {
    attachment.click();
  };
  let files,
    postid,
    reader,
    posts,
    categoryChoice = "Life Style",
    attach,
    category = document.querySelector("select"),
    fileName,
    attachName = [],
    image = document.querySelector("input[type = file]:not(#attachment)");
  attachment.onchange = (e) => {
    list.innerHTML = "";
    attach = e.target.files;
    attachName.push(e.target.value.split(/(\\|\/)/g).pop());
    lies = document.createElement("ul");
    Array(...attach).map((ele) => {
      li = document.createElement("li");
      li.innerText = ele.name;
      lies.append(li);
      attachName.push(ele.name);
    });
    p = document.createElement("p");
    p.innerText = "YOUR ATTACHMENTS :";
    list.append(p, lies);
  };
  category.addEventListener("change", function () {
    categoryChoice = this.value;
  });
  console.log(image);
  database.ref("posts/").on("value", (e) => {
    postid = Object.keys(e.val()).length;
    posts = e.val();
  });
  upload.onclick = () => {
    image.click();
  };
  image.onchange = (e) => {
    files = e.target.files;
    fileName = e.target.value.split(/(\\|\/)/g).pop();
    reader = new FileReader();
    reader.onload = () => {
      upload.children[0].style.display = "none";
      upload.children[1].setAttribute("src", reader.result);
    };
    reader.readAsDataURL(files[0]);
  };
  let done = document.querySelector(".upload>button");
  done.onclick = (e) => {
    let body = document.querySelector(".upload > p:nth-of-type(1)").innerText;
    let title = document.querySelector(".upload > h2").innerText;
    if (files) {
      putFiles(postid, files, "images");
      if (attach) {
        putFiles(postid, attach, "attachments");
      }
      if (title.length < 100) {
        if (body.length < 2000) {
          loadder.classList.add("active");
          putPost(
            postid,
            attachName,
            name,
            fileName,
            title,
            body,
            categoryChoice
          );
        } else {
          alert(
            "The Max Charecters Of Post Is 2000 And You Have Enterd" +
              body.length
          );
        }
      } else {
        alert(
          "The Max Charecters Of Title Is 100 And You Have Enterd" +
            title.length
        );
      }
    } else {
      upload.children[0].innerText = "Please Choose An Image";
      upload.children[0].style.color = "#ed4f32";
    }
  };
}
if (sessionStorage.getItem("logged")) {
  logged();
}
function validateLogIn(e) {
  e.preventDefault();
  let email = forms[0].children[0].value.trim(),
    password = forms[0].children[1].children[0].value.trim(),
    usersss = 0,
    alert = document.querySelector(".alert"),
    userName;
  alert.innerText = "";
  database.ref(`users/`).on("value", (e) => {
    let users = e.val();
    for (const key in users) {
      if (Object.hasOwnProperty.call(users, key)) {
        const user = users[key];
        user.email == email ? (usersss++, (userName = user.name)) : "";
      }
    }
    if (usersss) {
      let passssss = 0;
      for (const key in users) {
        if (Object.hasOwnProperty.call(users, key)) {
          const user = users[key].password;
          user == password ? passssss++ : "";
        }
      }
      if (passssss) {
        logged(email, userName);
      } else {
        alert.innerText = "Wrong password";
      }
    } else {
      alert.innerText = "please enter a valid email";
    }
  });
}
forms[0].onsubmit = (e) => validateLogIn(e);

let sign = forms[1];
let gender = Array(
  ...document.querySelectorAll(
    "main.login>section section form[name=signup] div div img"
  )
);
gender.map((ele) => {
  ele.onclick = (e) => {
    gender.map((elee) => {
      elee.classList.remove("active");
      e.target.classList.add("active");
    });
  };
});
function validateSignIn(e) {
  e.preventDefault();
  let isgender = 0;
  let data = Array(
      ...document.querySelectorAll(
        "main.login>section section form[name=signup] input:not([type=submit])"
      )
    ),
    firstName = data[0],
    lastName = data[1],
    email = data[2],
    password = data[3],
    passwordConf = data[4],
    error = document.querySelector("p.signUpError");
  genderM_F = gender
    .map((ele) =>
      ele.classList.contains("active") ? ele.getAttribute("value") : ""
    )
    .filter((ele) => ele != "")
    .join();

  if (
    /\w+/gi.test(firstName.value.trim()) &&
    /\w+/gi.test(lastName.value.trim()) &&
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
      email.value.trim()
    ) &&
    /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/gi.test(
      password.value.trim()
    ) &&
    passwordConf.value.trim() === password.value.trim() &&
    genderM_F
  ) {
    async function fetchcc() {
      await database.ref("users/" + user + "/").set({
        name: firstName.value.trim() + " " + lastName.value.trim(),
        email: email.value.trim(),
        password: password.value.trim(),
        gender: genderM_F,
      });
      error.classList.remove("active");
      firstName.value = "";
      lastName.value = "";
      email.value = "";
      password.value = "";
      passwordConf.value = "";
    }
    let existed = 0;
    for (const key in users) {
      if (Object.hasOwnProperty.call(users, key)) {
        const ele = users[key].email;
        if (ele === email.value.trim()) {
          existed++;
        }
      }
    }
    if (!existed) {
      error.classList.remove("active");
      fetchcc();
    } else {
      error.classList.add("active");
      error.innerText = "User Already Existed";
    }
  } else {
    error.classList.add("active");
  }
}

sign.onsubmit = (e) => validateSignIn(e);
