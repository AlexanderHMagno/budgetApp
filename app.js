
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

    let calculateTotal = function (type) {

        let sum = 0;
        data.allItems[type].forEach(element => sum += element.value);
        data.totals[type] = sum;

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
        },
        budget: 0,
        percentage: -1,
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
        },


        calculateBudget: function () {
            //calculate total income and exp
            calculateTotal('exp');
            calculateTotal('inc');
            // calculate the budget
            data.budget = data.totals.inc - data.totals.exp;
            //calculate the % of income that we spent

            data.percentage = data.totals.inc >0? Math.round((data.totals.exp / data.totals.inc) * 100):-1;
        },

        getBudget:function(){
            return { 
                budget : data.budget,
                totalIncome : data.totals.inc,
                totalExpenses: data.totals.exp,
                percentage : data.percentage,
            }

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
        budgetLabel : '.budget__value',
        budgetIncome : '.budget__income--value',
        budgetExpense: '.budget__expenses--value',
        budgetExpensePerc: '.budget__expenses--percentage'


    }

    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMStrings.inputType).value,//will be either inc or exp
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value),
            }


        },

        getListItem: function (obj, type) {

            let html, element;
            // create HTML string with placeholder text 

            if (type === "inc") {
                element = DOMStrings.incomeContainer;
                html = `<div class="item clearfix" id="income-${obj.id}"> <div class="item__description">${obj.description}</div> <div class="right clearfix"><div class="item__value">+ ${obj.value}</div> <div class="item__delete"><button class="item__delete--btn"><i class="fas fa-times-circle"></i></button></div></div></div>`;
            } else if (type === "exp") {
                element = DOMStrings.exnpensesContainer;
                html = `<div class="item clearfix" id="expense-${obj.id}"> <div class="item__description">${obj.description}</div> <div class="right clearfix"> <div class="item__value">- ${obj.value}</div>  <div class="item__percentage">21%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="fas fa-times-circle"></i></button> </div> </div> </div>`;

            }

            // Insert the HTML into the DOM 
            document.querySelector(element).insertAdjacentHTML('beforeend', html);

        },

        getClearField: function () {
            let fields, fieldsArr;
            fields = document.querySelectorAll(DOMStrings.inputDescription + "," + DOMStrings.inputValue);

            fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach((element, index, array) => {
                element.value = ""

            });

            fieldsArr[0].focus();
        },

        displayBudget:function(obj){

         document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
         document.querySelector(DOMStrings.budgetIncome).textContent = obj.totalIncome;
         document.querySelector(DOMStrings.budgetExpense).textContent = obj.totalExpenses;
         document.querySelector(DOMStrings.budgetExpensePerc).textContent = obj.percentage + '%';
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

    };

    let updateBudget = function () {
        let budgetValue;
        /// calculate the budget 
        budgetCtrl.calculateBudget();
        //return the budget
        budgetValue = budgetCtrl.getBudget();
        return budgetValue;
        
    };

    let ctrlAddItem = function () {
        let input, newItem, totalBudget;

        //get the field input data
        input = UiCtrl.getInput();

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            //Add the item  to the budget controller

            newItem = budget.addItem(input.type, input.description, input.value);

            //Add the Item  to the UI 

            UIcontroller.getListItem(newItem, input.type);

            //clear the fields 

            UIcontroller.getClearField();

            //calculate and update budget 

            totalBudget = updateBudget();

            // display the budget

            UIcontroller.displayBudget(totalBudget);
        }


    }


    return {
        init: function () {
            console.log("Progam has started")
            setupEventListeners();
        }
    };

})(budget, UIcontroller);

controller.init();