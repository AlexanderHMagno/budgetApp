
//BUDGET CONTROLLER
let budget = (function () {
    class Expenses {
        constructor(id, description, value) {
            this.id = id;
            this.description = description;
            this.value = value;
        }
    }

    class Income {
        constructor(id, description, value) {
            this.id = id;
            this.description = description;
            this.value = value;
        }
    }

    // will keep all the info for display on the screen. 
    let data = {
        allItems: {
            exp: [],
            inc: [],
        },
        totals: {
            exp: 0,
            inc: 0,
        }
    };

    return {
        addItem: function (type, desc, val) {
            let item, ID;

            //create a new id. 
            if (data.allItems[type].length == 0) { ID = 0 } else { ID = data.allItems[type][data.allItems[type].length - 1].id + 1; }

            if (type === "exp") {
                item = new Expenses(ID, desc, val);
            } else {
                item = new Income(ID, desc, val);
            }

            // creating a new item in array. 
            data.allItems[type].push(item);

            //return the new Item 
            return item;
        }
    }
})(); //iife


//UI CONTROLLER
let UIcontroller = (function () {

    let DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: ".add__btn",
        incomeContainer: '.income__list',
        exnpensesContainer: '.expenses__list',
        
    }

    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMStrings.inputType).value,//will be either inc or exp
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: document.querySelector(DOMStrings.inputValue).value,
            }


        },

        getListItem: function (obj, type) {

            let html,element;
            // create HTML string with placeholder text 

            if (type === "inc") {
                element = DOMStrings.incomeContainer;
                html = `<div class="item clearfix" id="income-${obj.id}"> <div class="item__description">${obj.description}</div> <div class="right clearfix"><div class="item__value">+ ${obj.value}</div> <div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`;
            } else if (type === "exp") {
              element= DOMStrings.exnpensesContainer;
                html = `<div class="item clearfix" id="expense-${obj.id}"> <div class="item__description">${obj.description}</div> <div class="right clearfix"> <div class="item__value">- ${obj.value}</div>  <div class="item__percentage">21%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>`;
            
            }
           
            // Insert the HTML into the DOM 
document.querySelector(element).insertAdjacentHTML('beforeend',html);

        },

        getDom: function () {
            return DOMStrings;
        }
    }
    //
})();



//GLOBAL CONTROLLER
let controller = (function (budgetCtrl, UiCtrl) {

    let setupEventListeners = function () {
        let DomUI = UiCtrl.getDom();
        document.querySelector(DomUI.inputBtn).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function (event) {
            event.keyCode == 13 ? ctrlAddItem() : "";
        })

    }

    let ctrlAddItem = function () {
        let input, newItem;

        //get the field input data
        input = UiCtrl.getInput();
        console.log(input);

        //Add the item  to the budget controller

        newItem = budget.addItem(input.type, input.description, input.value);
 
        //Add the Item  to the UI 

        UIcontroller.getListItem(newItem,input.type);

    }


    return {
        init: function () {
            console.log("Progam has started")
            setupEventListeners();
        }
    };

})(budget, UIcontroller);

controller.init();