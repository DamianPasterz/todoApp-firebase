
function addItem(event) {
    event.preventDefault();
    let text = document.getElementById("todo-input");

    db.collection("todo-items").add({

        text: text.value,
        status: "active"

    })


}

function getItems() {
    db.collection("todo-items").onSnapshot((snapshot) => {
        // console.log(snapshot);
        let items = [];
        snapshot.docs.forEach((doc) => {
            items.push({
                id: doc.id,
                ...doc.data(),

            })
        })
        // console.log(items);
        generateItems(items);
        showAllStatsTodo(items)

    })

}



function generateItems(items) {

    let itemsHTML = "";
    items.forEach((item) => {
        // console.log(item);
        itemsHTML += `
        
        <div class="todo-item">
                    <div class="check">
                        <div data-id="${item.id}" class="check-mark  ${item.status == "completed" ? "checked" : ""}">
                            <img src="./assets/icon-check.svg">
                        </div>
                    </div>
                 <div class="todo-text ${item.status == "completed" ? "checked" : ""}">
                        ${item.text}
             </div>
        </div>
        
        
        
        `

    })

    document.querySelector(".todo-items").innerHTML = itemsHTML;
    createEventLiseners();


}

function createEventLiseners() {
    let todoCheckMarks = document.querySelectorAll(".todo-item .check-mark")
    todoCheckMarks.forEach((checkMark) => {
        checkMark.addEventListener("click", function () {
            markCompleted(checkMark.dataset.id)

        })

    })
}

function markCompleted(id) {//ptaszek
    // console.log("mark completed");
    let item = db.collection("todo-items").doc(id);

    item.get().then(function (doc) {
        if (doc.exists) {
            // console.log("here is the doc", doc.data());
            let status = doc.data().status;
            if (status == "active") {
                item.update({
                    status: "completed",
                })

            } else if (status == "completed") {
                item.update({
                    status: "active",
                })
            }
        }
    })
}

function eventStats() {
    const spanStats = document.querySelectorAll("div.items-statuses span ");

    spanStats.forEach((span) => {

        span.addEventListener("click", () => {

            if (span.classList == "")
                span.classList.add("active")

            else if (span.classList == "active")
                span.classList.remove("active")
        })
    })

}






function counterGenerator(items) {
    let itemsLeft = db.collection("todo-items").onSnapshot((snapshot) => {
        // console.log(snapshot);
        let ab = snapshot.size;
        // console.log(ab);

        itemsHTML = "";
        itemsHTML += `


        <div class="items-left">
        ${ab} items 
        </div>

        `

        document.querySelector(".items-left").innerHTML = itemsHTML;


    })

}



function clearCompletedItems() {
    let clearComponent = document.querySelector(".items-clear span")
    clearComponent.addEventListener("click", () => {



        let todoItems = db.collection("todo-items");
        let todoCompleted = todoItems.where("status", "==", "completed")
            .get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    console.log(doc.id, "=>", doc.data());
                    let item = doc.id;
                    console.log(item);
                    db.collection("todo-items").doc(item).delete();
                }


                )
            })
    })
}


// function schowAllStatsTodo(item) {
//     let statsAll = document.getElementById("all")
//     statsAll.addEventListener("click", getItems())
// }



function showActiveTodo() {
    let statsActive = document.getElementById("active")
    statsActive.addEventListener("click", () => {


        let clearSpanAll = document.getElementById("all");
        clearSpanAll.classList.remove("active");
        let clearSpanCompleted = document.getElementById("completed");
        clearSpanCompleted.classList.remove("active");



        let todoItems = db.collection("todo-items");
        let todoCompleted = todoItems.where("status", "==", "active")
            .get().then((snapshot) => {
                let ab = snapshot.size;
                itemsHTML = "";
                itemsHTML += `


        <div class="items-left">
        ${ab} items 
        </div>

        `

                document.querySelector(".items-left").innerHTML = itemsHTML;

                let items = [];
                snapshot.docs.forEach((doc) => {
                    items.push({
                        id: doc.id,
                        ...doc.data(),

                    })

                })
                console.log(items);
                generateItems(items);



            })


    })



}


function showCompletedTodo() {
    let statsActive = document.getElementById("completed")
    statsActive.addEventListener("click", () => {

        let clearSpanAll = document.getElementById("all");
        clearSpanAll.classList.remove("active");
        let clearSpanActive = document.getElementById("active");
        clearSpanActive.classList.remove("active");

        let todoItems = db.collection("todo-items");
        let todoCompleted = todoItems.where("status", "==", "completed")
            .get().then((snapshot) => {
                let ab = snapshot.size;
                itemsHTML = "";
                itemsHTML += `


        <div class="items-left">
        ${ab} items 
        </div>

        `

                document.querySelector(".items-left").innerHTML = itemsHTML;
                let items = [];
                snapshot.docs.forEach((doc) => {
                    items.push({
                        id: doc.id,
                        ...doc.data(),

                    })
                })
                console.log(items);
                generateItems(items);
            })
    })
}



function showAllStatsTodo() {
    let statsActive = document.getElementById("all")
    statsActive.addEventListener("click", () => {
        db.collection("todo-items").onSnapshot((snapshot) => {

            let clearSpanActive = document.getElementById("active");
            clearSpanActive.classList.remove("active");
            let clearSpanCompleted = document.getElementById("completed");
            clearSpanCompleted.classList.remove("active");

            let ab = snapshot.size;
            itemsHTML = "";
            itemsHTML += `


    <div class="items-left">
    ${ab} items 
    </div>

    `

            document.querySelector(".items-left").innerHTML = itemsHTML;
            // console.log(snapshot);
            let items = [];
            snapshot.docs.forEach((doc) => {
                items.push({
                    id: doc.id,
                    ...doc.data(),

                })
            })
            // console.log(items);
            generateItems(items);
            showAllStatsTodo(items)

        })

    })


}







clearCompletedItems();
getItems();
eventStats();
counterGenerator();
showAllStatsTodo();
showActiveTodo();
showCompletedTodo()
