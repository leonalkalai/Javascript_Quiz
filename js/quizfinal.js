"use strict";

window.addEventListener("load",()=> { 
    getData();  
});

let point = 0;
let points = 0;
let correct_answers = [];
let errormessage = $('h1');

const encode=(str)=>str.replace(/[&<>'"]/g, HTMLentity => ({'&': '&amp;','<': '&lt;','>': '&gt;',"'": '&#39;','"': '&quot;'}[HTMLentity])); //keep special characters

let array_shift = (arr)=>arr.filter(index => index - this[this.length - 1]); // remove last element from 2d array

function removelastTwoItems(arr){arr.splice(arr.length - 2, 1); arr.pop(); return arr;}; //remove last two elements from array

const percentage = (p, t) =>  parseInt((p / t) * 100); //calculate percentage

const reward=(percentage)=>{ //display message to user in relation to the correct answers percentage 
    if (percentage>80){return "Μπράβο";}else if(percentage<80&&percentage>=50){return "Συνέχισε την προσπάθεια";}else if(percentage<50){return "Δυστυχώς";}
}

const emoji = (percentage)=>{ //display each emoji in relation to the correct answers percentage 
    if ((percentage<=100)&&(percentage>80)){return "grin-alt"; }
    else if ((percentage<=80)&&(percentage>=50)){ return "meh-rolling-eyes";}
    else return "frown-open";
    };

const shuffleElements = (el) => { //function to shuffle elements and append again
    let elements = $(el).children();
    while (elements.length) {
        $(el).append(elements.splice(Math.floor(Math.random() * elements.length), 1)[0]);
    }
}

$(document).on ("click", "#restart_button", function () {
    window.location.replace(self.location); //restart quiz
});

$(document).ready ( function () { // on click radio change to checked
    $(document).on ("click", ".question.tab", function (e) {
            e.preventDefault();
            e.stopPropagation();
            $(this).children("input[type='radio']").prop('checked', true).trigger("change");    // on click answer trigger checked 
    });
});

$("input[type='radio']").change(function(){ // disables other answers to be clicked if user clickes on one
    $("input[type='radio']").prop("disabled", true);
    var $el = $(this);
    if ($el.is(":checked")) {
        $el.siblings().prop("disabled", true);
    }
    else {
        $el.siblings().prop("disabled",false);
    }
});  

function checkAnswer() { // check answer
    $("input[type='radio']").change(function(){
        $('input[type="radio"]').parent(".question.tab").removeClass('checked');
        $("input[type='radio']").not(this).parent('.question.tab').addClass('notchecked');
        $('input[type="radio"]').each(function () {
            if (this.checked) {
                $(this).parent(".question.tab").removeClass('notchecked').toggleClass('checked'); 
                let radioValue = $(this).val();
                if(radioValue){ 
                point = $(this).parent('p').next(".hidden").html();
                let user_answer = $(this).val(); // print answer
                let correct_answer = $(this).closest('ul').closest('li').children('.correctanswer').html();
                let thecorrect_answer = $(this).closest('ul').closest('li').find('h3').html();  // print question
                    if ($(this).parent(".question.tab").hasClass("checked")) {
                        correct_answers.push([point,thecorrect_answer,user_answer,correct_answer]);
                    }
                      else{
                          return;
                      }
                    return correct_answers; 
                }   
            }    
        });
    });  
}

let test_results = (data) => { // display test results and restart
    let sum = correct_answers.reduce((result,current)=>parseInt(result)+parseInt(current),0);  
    $('#sum').html(`
        <p>${ reward(percentage(sum,data.length))}! Aπάντησες σωστά ${sum} στις ${data.length} ερωτήσεις <i class="far fa-${emoji(percentage(sum,data.length))}"></i></p>
    `);

    $("#btn_prev").hide();

    $('#restart').html(`
    <div class="popup">
      <div class="content">
         <button type='button' id='restart_button' class='btn btn-success'>Restart</button>
     </div>
     </div>
    `);

    $("#main > .container").html( `
    <ul id="answerlist">
        <li><h3 class="dashedbordercolored">Αποτελέσματα</h3>
        <ul id="results" class="grid">
            ${ correct_answers.map((el,index) => 
                `
                    <li class="item">
                        <div><h4>Ερώτηση <p class="answerindex">[ ${index+1} ]</p></h4><p class="question result">${encode(el[1])}</p/></div> 
                        <div><h4 class=answer ${el[0]==1?'white':'red'}>Απαντήσατε ${el[0]==1?"σωστά":"λάθος"}<i class="far fa-${el[0]==1?"check":"times"}-circle"></i></h4>
                        <p class="question result">${encode(el[2])}</p/></div>   
                        <div><h4>Σωστή απάντηση</h4><p class="question result">${el[3]}</p/></div>  
                    </li> 
                        <div class="colorblock"></div>   
            `).join("\n")}
            </ul>
        </li>
        </ul>
        `
        );    
}

const getData = function() { // start getdata with fetch
    const url = 'js/questions.json';
    fetch(url)
        .then(res => res.json())
        .then(data => {      
        let current_page = 1;
        let questions_per_page = 1;
        let numPages = ()=> Math.ceil(data.length / questions_per_page);
        changePage(1);
        let pageNumber = numPages();
        $('#pagecounter').html(`<h2 id="pagenumber"> Ερώτηση: <span id="page">1</span> / <span class="aqua">${pageNumber}</span></h2>`);
        $('#pagetotal').html(`Σύνολο ερωτήσεων: ${pageNumber}`);  
 
        function prevPage()
        {
            removelastTwoItems(correct_answers);   
            if (current_page > 1) {
                    current_page--;
                    changePage(current_page);     
            }  
        }
        
        function nextPage()
        {
            if (current_page < numPages()) { 
                current_page++;
                changePage(current_page); 
            } 
        }
      
        function changePage(page) //start changepage
        {
            let btn_prev = $("#btn_prev");
            let questions = $("#main > .container");
            let page_span = $("#page");
            let answerslist = "#answerlist > li > ul"; // path of elements to be shuffled as a string value

            page < 1 ? page = 1  : page > numPages ? page = numPages:null;
            for (let i = (page-1) * questions_per_page; i < (page * questions_per_page); i++) {
                questions.html( `
                <ul id="answerlist">
                        <li><h3 class="dashedbordercolored">${data[i].question}</h3>
                        ${data[i].answers.map(answer => {
                            if (answer.correct){
                                return(`<p class="correctanswer hidden">${encode(answer.text)}</p>`)
                            }
                        }).join("\n")}
                        <ul>
                            ${data[i].answers.map(answer => 
                            `
                            <li>
                                <p class="question tab"><input type="radio" class="hidden" id="${answer.text}" name="answer" value="${answer.text}"><label for="${answer.text}">${encode(answer.text)}</label><br>   
                                </p>
                                <p class="hidden">${answer.correct?points=1:points=0}</p>
                            </li>`).join("\n")}
                        </ul>
                    </li>
                </ul>
               `)

               shuffleElements(answerslist); //shuffle elements
               checkAnswer(); 

               $("input[type='radio']").change(function(){ // change page on each answer clicked 
                $('input[type="radio"]').each(function () {
                        if (this.checked) {
                            setTimeout(() => {
                                nextPage();
                            }, 1000);
                        }
                    });
                });
               
            }
     
            page_span.html(page);
            page == 1?btn_prev.hide():btn_prev.show();
            
            $("input[type='radio']").change(function(){
                if($('input[type="radio"]').is(":checked")) {  
                    if( page_span.html()==data.length.toString()){
                        $('#pagetotal').hide();
                        $('#pagecounter').hide();
                        setTimeout(() => {
                            test_results(data); //display rest results
                        }, 1000); 
                    }
                }
                else{
                    return;
                }
            }); 
        } // end changepage

        $('#btn_prev').click( function(e) { // go to previus question
            e.preventDefault();
            $("#btn_prev").removeClass("animate__animated animate__infinite animate__heartBeat done").blur();
            correct_answers.push(array_shift(correct_answers));  // push array values minus the last one
            prevPage();
        });  

        })
        .catch( err => {
            errormessage.html(`${err}`);
            errormessage.siblings().hide();
            errormessage.parents().siblings().hide();
        });
}; // end getdata