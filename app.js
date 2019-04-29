var budgetcontroller = (function(){

    var Expense =function(id,description,value){
        this.id=id;
        this.description=description;
        this.value=value;
    }

    var Income =function(id,description,value){
        this.id=id;
        this.description=description;
        this.value=value;
    }
     
    var calctotal=function(type){
     var sum=0;
        data.allitems[type].forEach(function(cur) {
         sum = sum + cur.value;
         data.totals[type]=sum;
     });
    }
    var data={
        allitems:{
        exp:[],
        inc:[]
    },
    totals:{
        exp:0,
        inc:0
    },
    budget:0,
    percentage:-1
}
    return {
        additem:function(type,des,value){
            var item,id;   
              
            //creating new id
            if(data.allitems[type].length>0){
             id=data.allitems[type] [data.allitems[type].length-1].id + 1;
            }
            else
            {
                id=0;
            }
            if(type==="exp"){
                item = new Expense(id,des,value); 
            }
            else if(type==="inc"){
                item = new Income(id,des,value);
            }
             
            //push into data structure
            data.allitems[type].push(item);

            return item;
        },


        deleteitem:function(type,id){
               var ids,index;
            ids=data.allitems[type].map(function(current){
                 return current.id;
            });
            index=ids.indexOf(id);
            if(index!== -1){
                data.allitems[type].splice(index,1);
            }
        },
        calcbudget:function(){
                      
            calctotal('exp');
            calctotal('inc');

            data.budget = data.totals.inc - data.totals.exp;
            if(data.totals.inc > 0)
            {
            data.percentage = Math.round((data.totals.exp / data.totals.inc)*100);
            }
            else{
                data.percentage=-1;
            }   
        },
      getbudget:function(){
          return {
               budget:data.budget,
               totalinc:data.totals.inc,
               totalexp:data.totals.exp,
               percentage:data.percentage
          };
      },
   
//returning the data strucure

    testing:function(){
        console.log(data);
    }
    };

    }) ();


var uicontroller = (function(){
    
return{

    getinput:function(){
        return{
        type: document.querySelector('#type').value,
        inputfield: document.querySelector('#ifield').value,
        value:parseFloat(document.querySelector('#value').value)
        };
    },

    additemlist:function(obj,type){
        var html,newhtml,element;
          //create html string with placeholder text
          if(type==="inc")
          {
          html='<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="item__value">%value%</div><div class="item__del--btn"><button type="button" class="buttondel"><img src="del2.png" class="rounded-circle" alt="Smiley face" ></button></div></div>';
          element='.income__list';  
         }
          else if(type==="exp")
          {
          html='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="item__value">%value%</div><div class="item__del--btn"><button type="button" class="buttondel"><img src="del2.png" class="rounded-circle" alt="Smiley face" ></button></div></div>';
          element='.expenses__list';   
        }
          //replace the placeholder with some real data
         
          newhtml=html.replace('%id%',obj.id);
          newhtml=newhtml.replace('%description%',obj.description);
          newhtml=newhtml.replace('%value%',obj.value);
           document.querySelector(element).insertAdjacentHTML('beforeend',newhtml);
        },

        clearfield:function(){
          
            document.getElementById("ifield").value="";
            document.getElementById("value").value="";
            document.getElementById("ifield").focus();
        },
       deletelistitem:function(selectorID){

        var el=document.getElementById(selectorID);
        el.parentNode.removeChild(el);
       },

        displaybudget:function(obj){
           
        document.querySelector('#total').textContent=obj.budget;
        document.querySelector('#income').textContent=obj.totalinc;
        document.querySelector('#expense').textContent=obj.totalexp;
        }

};
})();


var controller=(function(budctrl,uictrl){

    var seteventlisteners = function()  {
        document.querySelector('.button').addEventListener('click',ctrladditem);
          
        document.addEventListener('keypress',function(event){
        
        if(event.which===13||event.keyCode===13) 
        {
            ctrladditem(); 
        }
        });
        document.querySelector('.footer').addEventListener('click',ctrldelitem)
    };

    var date=function(){
        var now, months,day, month, year;
            
        now = new Date();
        //var christmas = new Date(2016, 11, 25);
        day=now.getDate();
        months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        month = now.getMonth();
        
        year = now.getFullYear();
        document.querySelector('#date').textContent =day+'-'+ months[month] + '-' + year;
    };

    var updatebudget=function(){
      
        budctrl.calcbudget();
        var budget = budctrl.getbudget();
        uictrl.displaybudget(budget);
    };


    var ctrldelitem=function(event){
        var itemid,splitid,type,ID;
    itemid=event.target.parentNode.parentNode.parentNode.id;
    
    if(itemid){
        splitid=itemid.split('-');
        type=splitid[0];
        ID=parseInt(splitid[1]);
        budctrl.deleteitem(type,ID)
         uictrl.deletelistitem(itemid);

        updatebudget();
    }
    };

    var ctrladditem = function(){
        var input,item; 
        
        input=uictrl.getinput();
        if(input.description !== "" && !isNaN(input.value) && input.value>0)
        { 

         item=budctrl.additem(input.type,input.inputfield,input.value);
        
         uictrl.additemlist(item,input.type);
         uictrl.clearfield();
         updatebudget();
        }
    };

     return{
         init:function(){
             console.log("application has started");
             seteventlisteners();
             date();
         }
         
     };
    
})(budgetcontroller,uicontroller);

controller.init();


{/* <a class="btn-floating btn-sm blue-gradient"><i class="fas fa-star"></i></a> */}