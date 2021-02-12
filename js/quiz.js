"use strict";

window.addEventListener("load",()=> { 
    getData();  
})
let point = 0;
let points = 0;
let correct_answers = [];

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

            page < 1 ? page = 1 : page > numPages ? page = numPages:null;
            questions.html("");
            for (let i = (page-1) * questions_per_page; i < (page * questions_per_page); i++) {
                questions.html( `
               <ul id="itemlist">
                   <li><h3 class="dashedbordercolored">${data[i].question}</h3>
                    <ul>
                        ${data[i].answers.map(answer => 
                        `
                        <li>
                            <p class="question tab"><input type="radio" class="answer" name="answer" value="${answer.text}"><label for="${answer.text}">${answer.text}</label><br>   
                            </p>
                            <p class="hidden">${answer.correct?points=1:points=0}</p>
                        </li>`).join("\n")}
                    </ul>
                   </li>
               </ul>
               `
               )
               checkAnswer(); 
            }
            page_span.html(page);
            page == 1?btn_prev.hide():btn_prev.show();
            page == numPages()?btn_next.hide():btn_next.show();
           
            
            $("input[type='radio']").change(function(){
                if($('input[type="radio"]').is(":checked")) {  
                    if( page_span.html()==data.length.toString()){
                        $("#sum").html("<button id='mybutton'>Αποτελέσματα</button></div>"); 
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
                
            });
        });

               
        $('#btn_prev').click( function(e) {e.preventDefault(); prevPage(); return false;} );
        $('#btn_next').click( function(e) {
            e.preventDefault(); 
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
        $('input[type="radio"]').removeClass('checked');
        let radioValue = $("input[name='answer']:checked").val();
        point = $("input[name='answer']:checked").parent('p').next(".hidden").html();
        if($('input[type="radio"]').is(":checked")) {
            if(radioValue){
                correct_answers.push(point);
                return correct_answers;
            }
            $(this).toggleClass('checked'); 
        }
    });  
}

