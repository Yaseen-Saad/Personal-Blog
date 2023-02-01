let blogs = document.querySelector('.blogs')
database.ref(`posts/`).on("value", (e) => {
    posts = e.val()
    Array(...posts).map((ele, i) => {
        let post = document.createElement('article'),
            image = document.createElement('img'),
            title = document.createElement('h2'),
            div1 = document.createElement('div'),
            div2 = document.createElement('div'),
            category = document.createElement('span'),
            date = document.createElement('span'),
            author = document.createElement('span'),
            link = document.createElement('a'),
            attachment=[],
            text = document.createElement('p');
           async function fetch(){
                let storageRef = firebase.storage().ref(`images/${i}/${ele.image}`);
                await storageRef.getDownloadURL().then(function(url) {
                    image.src = url;
                });
            }
            link.setAttribute('href', "./posts.html" + `?id=${i}`)
            fetch()
            let dateSpan = new Date(ele.date).toUTCString().split(":")[0].slice(0, -2);
            title.innerText = ele.title
            text.innerText = ele.body
            author.innerText = ele.author
            date.innerText = dateSpan
            category.innerText = ele.category
            link.innerText = "continue reading"
            div1.append(category, date, author)
            div2.append(link)
            post.append(image, title, div1, text, div2)
            blogs.append(post)
            splitp()
    })
})









