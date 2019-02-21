
//BUDGET CONTROLLER
let budget = (function () {
    class Expenses {
        constructor(id, description, value) {
            this.id = id;
            this.description = description;
            this.value = value;
            this.percentage = -1;
        }
     };

     Expenses.prototype.calcPercentages = function(totalIncome){
        
        this.percentage = totalIncome>0? Math.round((parseInt(this.value)/totalIncome)*100):-1;
   
    };

    Expenses.prototype.getPercentage = function(){
        return this.percentage
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


        calculatePercentages: function(){
            data.allItems.exp.forEach(element => element.calcPercentages(data.totals.inc))
        },

        getPercentages: function(){
           let arrayPercentages;
           arrayPercentages =  data.allItems.exp.map(element=>element.getPercentage());
           return arrayPercentages;
        },

        getBudget:function(){
            return { 
                budget : data.budget,
                totalIncome : data.totals.inc,
                totalExpenses: data.totals.exp,
                percentage : data.percentage,
            }

        },

        deleteItem: function(type,id){
         let index;
         id = id;
         index =  data.allItems[type].map(element => element.id);
         data.allItems[type].splice(index.indexOf(id),1);
         
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
        budgetExpensePerc: '.budget__expenses--percentage',
        container: '.container',
        percentagesLabel : '.item__percentage',


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
                html = `<div class="item clearfix" id="inc-${obj.id}"> <div class="item__description">${obj.description}</div> <div class="right clearfix"><div class="item__value">+ ${obj.value}</div> <div class="item__delete"><button class="item__delete--btn"><i class="fas fa-times-circle"></i></button></div></div></div>`;
            } else if (type === "exp") {
                element = DOMStrings.exnpensesContainer;
                html = `<div class="item clearfix" id="exp-${obj.id}"> <div class="item__description">${obj.description}</div> <div class="right clearfix"> <div class="item__value">- ${obj.value}</div>  <div class="item__percentage"></div> <div class="item__delete"> <button class="item__delete--btn"><i class="fas fa-times-circle"></i></button> </div> </div> </div>`;

            }

            // Insert the HTML into the DOM 
            document.querySelector(element).insertAdjacentHTML('beforeend', html);

        },

        deleteItem : function(deletedID){
         let element;
        element = document.getElementById(deletedID);
        element.parentNode.removeChild(element);
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
         document.querySelector(DOMStrings.budgetExpensePerc).textContent = (obj.percentage>0? obj.percentage + '%':"---");
        },

        displayPercentages: function(percen){
            let fields,nodeListForeach;

            fields = document.querySelectorAll(DOMStrings.percentagesLabel);
            
            nodeListForeach = function(list,callBack) {
                for (let i =0;i<list.length;i++){
                    callBack(list[i],i)
                }
            };

            nodeListForeach(fields,function(current,index){

                current.textContent = percen[index]>0?percen[index] + '%':"---";
            })


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
        });

        document.querySelector(DomUI.container).addEventListener('click',ctrlRemoveItem)

    };

    let updateBudget = function () {
        let budgetValue;
        /// calculate the budget 
        budgetCtrl.calculateBudget();
        //return the budget
        budgetValue = budgetCtrl.getBudget();
        return budgetValue;
        
    };

    let updatePercentages = function(){
       let percentages;

        // calculate the percentages.
      
        budgetCtrl.calculatePercentages();
    
        // read percetges from the budget controller.

       percentages = budgetCtrl.getPercentages();

        // Update the UI with the new percentages. 
        UIcontroller.displayPercentages(percentages);


    }

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

            // calculates and update for display percentages

            updatePercentages();
        }


    }

    let ctrlRemoveItem = function(event){
        let itemID,splitID,type,id,totalBudget;
        itemID= event.target.parentNode.parentNode.parentNode.parentNode.id;
        if(itemID){

            // split string
            splitID = itemID.split("-");
            type = splitID[0];
            id = parseInt(splitID[1]);
            //

            //delete the item for the data structure
            budgetCtrl.deleteItem(type,id);

            //delete the item for the UI

            UIcontroller.deleteItem(itemID);

            //calculate and update budget 

            totalBudget = updateBudget();

            // display the budget

            UIcontroller.displayBudget(totalBudget);

              // calculates and update for display percentages

              updatePercentages();
        
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