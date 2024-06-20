function articleTemplate(article) {
    const author = article["authorLink"].split('/').at(-1);

    return `
    <div class="article">
        <a href="${article["redirectLink"]}"><img src="${article["imgSource"]}"></a>
        <div>
            <a href="${article["redirectLink"]}"><h3 class="title">${article["title"]}</h3></a>
            <p class="brief">${article["brief"]}</p>
            <div class="credits">
                <a class="author" href="${article["authorLink"]}">» ${author}</a>
                <p class="date">${article["date"]}</p>
            </div>
        </div>
    </div>
    `;
}

const articles = [
    {
        "imgSource": "img/github101.png",
        "title": "Github 101",
        "brief": "This is a guide to use Git for beginners, this article includes some tips and tricks helpful for using Git and Github for source control",
        "authorLink": "https://github.com/votranphi",
        "date": "18/6/2024",
        "redirectLink": "Github101/index.html",
    }
]

const articleList = document.getElementById("articles");

for (let article of articles) {
    $('#articles').append(articleTemplate(article));
}