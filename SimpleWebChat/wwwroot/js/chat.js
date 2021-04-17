var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

var isUsernameEmpty = true;
var isMessageEmpty = true;

connection.on("ReceiveMessage", (username, message) => {
    var descriptionTerm = document.createElement("dt");
    var description = document.createElement("dd");

    descriptionTerm.className = "font-weight-bold text-left col-sm-1";
    descriptionTerm.textContent = username + ": ";

    description.className = "font-weight-normal text-left col-sm-11";
    description.textContent = message;

    var messageList = document.getElementById("messages");

    messageList.appendChild(descriptionTerm);
    messageList.appendChild(description);
});

connection.start().catch((err) => {
    return console.error(err.toString());
});

document.getElementById("sendButton").addEventListener("click", () => {
    var userElement = document.getElementById("username");
    var messageElement = document.getElementById("message");

    var user = userElement.value;
    var message = messageElement.value;

    connection.invoke("SendMessage", user, message).then(() => {
        messageElement.value = "";
        document.getElementById("sendButton").disabled = true;
    }).catch((err) => {
        return console.error(err.toString());
    });
});

document.getElementById("username").addEventListener("input", inputListener);
document.getElementById("message").addEventListener("input", inputListener);

function inputListener() {
    var sendButton = document.getElementById("sendButton");

    var isValueEmpty = this.value == "";

    if (this.id == "username") {
        isUsernameEmpty = isValueEmpty;
        console.log("Changing username");
    }
    else if (this.id == "message") {
        isMessageEmpty = isValueEmpty;
        console.log("Changing message");
    }

    sendButton.disabled = isUsernameEmpty || isMessageEmpty;
}