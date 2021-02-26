"use strict";

window.addEventListener("load",()=> { 
    getData();  
})
let point = 0;
let points = 0;
let correct_answers = [];
const encode=(str)=>str.replace(/[&<>'"]/g, HTMLentity => ({'&': '&amp;','<': '&lt;','>': '&gt;',"'": '&#39;','"': '&quot;'}[HTMLentity])); //keep special characters

$(document).ready ( function () {
    $(document).on ("click", ".question.tab", function (e) {
            e.preventDefault();
            e.stopPropagation();
            $(this).children("input[type='radio']").prop('checked', true).trigger("change");     
    });

});

function removelastTwoItems(arr){arr.splice(arr.length - 2, 1); arr.pop(); return arr;};

const getData = function() {
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
      
        function changePage(page)
        {
            let btn_next = $("#btn_next");
            let btn_prev = $("#btn_prev");
            let questions = $("#main");
            let page_span = $("#page");
            let answerslist = "#answerlist > li > ul"; // path of elements to be shuffled as a string value

            page < 1 ? page = 1  : page > numPages ? page = numPages:null;
            questions.html("");
            for (let i = (page-1) * questions_per_page; i < (page * questions_per_page); i++) {
                questions.html( `
               <ul id="answerlist">
                   <li><h3 class="dashedbordercolored">${data[i].question}</h3>
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
               `
               )
               shuffleElements(answerslist); //shuffle elements
       
               checkAnswer();
             
               $("input[type='radio']").change(function(){
                    $("input[type='radio']").prop("disabled", true);
                    var $el = $(this);
                    if ($el.is(":checked")) {
                        $el.siblings().prop("disabled", true);
                    }
                    else {
                        $el.siblings().prop("disabled",false);
                    }
                });  
         
            }
     
            page_span.html(page);
            page == 1?btn_prev.hide():btn_prev.show();
            page == numPages()?btn_next.hide():btn_next.show();
           
            $("input[type='radio']").change(function(){
                if($('input[type="radio"]').is(":checked")) {  
                    if( page_span.html()==data.length.toString()){
                        $("#sum").html("<button id='mybutton'>Δείξε αποτελέσματα</button></div>"); 
                    }
                    else{
                        $("#sum").html("");
                    }
                }
                else{
                    return;
                }
            }); 
          

        }

        $(document).ready ( function () {
            $(document).on ("click", "#mybutton", function () {
                let sum = correct_answers.reduce((result,current)=>parseInt(result)+parseInt(current),0);
                $('#sum').html(`<p>Απαντήσατε σωστά ${sum} στις ${data.length} ερωτήσεις</p>`);
                $("#btn_prev").hide();
               $('#main').html("<button type='button' id='restart' class='btn btn-danger'>Restart</button>");
              $("#main").append( `
              <ul id="answerlist">
                  <li><h3 class="dashedbordercolored">Αποτελέσματα</h3>
                  <ul id="results" class="grid">
                     ${ correct_answers.map(el => 
                        `
                            <li class="item">
                                <div class="xoverlay"><i class="far fa-${el[0]==1?"check":"times"}-circle"></i></div>
                                <p class="question tab">${encode(el[1])}</p/>   
                            </li>
                    `).join("\n")}
                    </ul>
                </li>
               </ul>
               `
               )
                
            });
        });
        function restart() {
            window.location.replace("main.html");
        }  
        
        $(document).ready ( function () {
            $(document).on ("click", "#restart", function () {
                restart();
            });
        });

        $('#btn_prev').click( function(e) {
            e.preventDefault();
            $("#btn_next").removeClass("animate__animated animate__infinite animate__heartBeat done").blur();
            if($('input[type="radio"]').is(":checked")) {   
                $('#btn_prev:focus > i').removeClass("btnalert");
                prevPage();
            }
            else{
                $('#btn_prev:focus > i').addClass("btnalert");
                return;
             }
              return false;
        });
        $('#btn_next').click( function(e) {
            e.preventDefault(); 
            $("#btn_next").removeClass("animate__animated animate__infinite animate__heartBeat done").blur();
            if($('input[type="radio"]').is(":checked")) {   
                $('#btn_next:focus > i').removeClass("btnalert"); 
                nextPage();
            }
            else{
                $('#btn_next:focus > i').addClass("btnalert");
                return;
             }
            return false;
        } );

        })
        .catch(err => console.log(err))
};

function checkAnswer() {
    $("input[type='radio']").change(function(){
        $('input[type="radio"]').parent(".question.tab").removeClass('checked');
        $("input[type='radio']").not(this).parent('.question.tab').addClass('notchecked');
        $('input[type="radio"]').each(function () {
            if (this.checked) {
                $(this).parent(".question.tab").removeClass('notchecked').toggleClass('checked'); 
                let radioValue = $(this).val();
                if(radioValue){ 
                point = $(this).parent('p').next(".hidden").html();
                let thecorrect_answer = $(this).closest('ul').closest('li').find('h3').html();  // print question
                    let pointarray = Array.of(point);
                    if ($(this).parent(".question.tab").hasClass("checked")) {
                        correct_answers.push(pointarray);
                        pointarray.push(thecorrect_answer);
                        $("#btn_next").addClass("animate__animated animate__infinite animate__heartBeat done");
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


//function to shuffle elements after append
function shuffleElements(el) {
    let elements = $(el).children();
    while (elements.length) {
        $(el).append(elements.splice(Math.floor(Math.random() * elements.length), 1)[0]);
    }
}
