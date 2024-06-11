
const li1 = document.getElementById("li1");
const btn1 = document.getElementById("btn1");
const shower = document.getElementById("shower");
const listId = "AQMkADAwATMwMAItMWYxNC04Y2U0LTAwAi0wMAoALgAAA8uNLzcGhbdHjhnMKBY42HoBALWCHmmTzCdFi8NoB6pstOEABKXjwZ4AAAA=";

const words = [
    {
        "word": "hello",
        "partOfSpeech": "verb",
        "definition": "To greet"
    },
    {
        "word": "registration",
        "partOfSpeech": "noun",
        "definition": "The act of signing up or registering for something."
    }
]

function add(word, text) {
    if (word.children.length === 0) {
        const newNode = document.createElement("pre");
        newNode.textContent = text;

        word.appendChild(newNode);
    } else {
        word.removeChild(word.lastChild);
    }
}

function shortPOS(pos) {
    if ("noun" === pos)
        return "n";
    if (pos === "adjective")
        return "adj";
    if (pos === "verb")
        return "v";
}

for (let i in words) {
    const newListItem = document.createElement("li");
    newListItem.classList.add("word");
    const content = `${words[i]["word"]} (${shortPOS(words[i]["partOfSpeech"])})`;
    newListItem.textContent = content;

    const body = words[i]["definition"];
    newListItem.addEventListener("click", (event) => {
        add(event.currentTarget, body);
    });

    shower.appendChild(newListItem);
}

// async function main() {
//     let client_id = "haahs";
//     let client_secret = "ahhah";
//     let refresh_token = "ahheh";
//     const grant_type = "refresh_token";
//     const scope = "Tasks.ReadWrite";
//     let access_token = "Tasks.ReadWrite";

//     await fetch("./json/vole_phi.json")
//         .then((response) => response.json())
//         .then((json) => {
//             client_id = json["client_id"];
//             client_secret = json["client_secret"];
//             refresh_token = json["refresh_token"];
//         });

//     var formBody = [
//         `${encodeURIComponent("client_id")}=${encodeURIComponent(client_id)}`,
//         `${encodeURIComponent("client_secret")}=${encodeURIComponent(client_secret)}`,
//         `${encodeURIComponent("refresh_token")}=${encodeURIComponent(refresh_token)}`,
//         `${encodeURIComponent("grant_type")}=${encodeURIComponent(grant_type)}`,
//         `${encodeURIComponent("scope")}=${encodeURIComponent(scope)}`
//     ];
//     formBody = formBody.join("&");

//     console.log(formBody);

//     await fetch("https://login.microsoftonline.com/common/oauth2/v2.0/token", {
//         method: "POST",
//         headers: {
//             "Content-type": "application/x-www-form-urlencoded;charset=UTF-8"
//         },
//         body: formBody
//     }).then((response) => {
//         console.log(response);
//         if (!response.ok) {
//             console.log('dumaloiroi');
//         }
//         return response.json();
//     }).then((json) => {
//         console.log(json);
//         access_token = json["access_token"];
//         console.log(access_token);
//     })
// }

// main()

async function main() {
    const config = {
        auth: {
            clientId: "fb00ce00-b4fb-4902-8276-10ba22372a0d",
            authority: "https://login.microsoftonline.com/common/",
            redirectUri: "http://localhost:5500/index.html"
        },
    };

    var client = new Msal.UserAgentApplication(config);
    var request = {
        scopes: ['tasks.readwrite']
    }

    let loginResponse = await client.loginPopup(request);
    console.log(loginResponse);
    let tokenResponse = await client.acquireTokenSilent(request);
    console.dir(tokenResponse);

    let payload = await fetch("https://graph.microsoft.com/v1.0/me/todo/lists", {
        headers: {
            "Authorization": "Bearer " + tokenResponse.accessToken
        }
    })
    let result = await payload.json();
    console.log(result);
}

main();