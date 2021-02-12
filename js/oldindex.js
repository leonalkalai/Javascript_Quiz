"use strict";

window.addEventListener("load",()=> { 
    getData();  
})

const getData = function() {
    const url = 'js/questions.json';
    fetch(url)
        .then(res => res.json())
        .then(data => {
            let current_page = 1;
            let records_per_page = 1;
            let numPages = ()=> Math.ceil(data.length / records_per_page);
            let count = `<h2>Σύνολο ερωτήσεων: ${data.length}</h2>`;
            let pageNumber = `<p>${numPages()}</p>`; 
            changePage(1);
          

            // let limit = 5;
            // let getpage = document.location.href;
            // let offset = getpage * limit;
            // document.location.pathname === '/' ||  document.location.pathname.indexOf('index') >-1 ? getpage = -1 : getpage = 0;
            // data.slice(offset,1);
            
        $('#main').append(count,pageNumber);
       // $('#main').append(questionstext(data));  

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
            //let numPages = data => Math.ceil(JSON.stringify(data.length)/ records_per_page);
            //let numPages = Math.ceil(JSON.stringify(data.length)/ records_per_page);
            //let numOfPages = $('#main > p').html();
            let btn_next = $("#btn_next");
            let btn_prev = $("#btn_prev");
            let questions = $("#main");
            let page_span = $("#page");
            // Validate page
            // if (page < 1) page = 1;
            // if (page > numPages) page = numPages;
           
            page < 1 ? page = 1 : page > numPages ? page = numPages:null;
            questions.html("");
            for (let i = (page-1) * records_per_page; i < (page * records_per_page); i++) {
               // questions.html(data[i].question + "<br>"); 
               questions.html( `
               <ul id="itemlist">
                   <li><h2>${data[i].question} ${i}</h2>
                    <ul>
                        ${data[i].answers.map(answer => `<li><p><input type="radio" class="answer" name="answer" value="${answer.text}"><label for="${answer.text}">${answer.text}</label><br>
                        ${answer.correct}</p></li>`).join("\n")}
                    </ul>
                   </li>
               </ul>
               `
               )
            }
            page_span.html(page);
            page == 1?btn_prev.hide():btn_prev.show();
            page == numPages()?btn_next.hide():btn_next.show();
            // if (page == 1) {
            //     btn_prev.hide();
            // } else {
            //     btn_prev.show();
            // }

           // if (page == numPages()) {
            //     btn_next.hide();
            // } else {
            //     btn_next.show();
            // }

         

        

        }
        
       
        //function numPages(){return Math.ceil(data.length / records_per_page);}
       
        $('#btn_prev').click( function(e) {e.preventDefault(); prevPage(); return false;} );
        $('#btn_next').click( function(e) {e.preventDefault(); nextPage(); return false;} );
        
        })
        .catch(err => console.log(err))
};

//let numPages = data => Math.ceil(JSON.stringify(data.length)/ records_per_page);

   // let numPages = data => Math.ceil(Object.keys(data).length / records_per_page);

let questionstext = data => data.map((item,index) => {
    return `
    <ul id="itemlist">
        <li><h2>${item.question} ${index}</h2>
            <ul>
            ${item.answers.map(answer => `<li><p><input type="radio" class="answer" name="answer" value="${answer.text}"><label for="${answer.text}">${answer.text}</label><br>
            ${answer.correct}</p></li>`).join("\n")}
            </ul>
        </li>
    </ul>
    `;
}).join("\n");

//let count = data => `<h2>Σύνολο ερωτήσεων: ${data.length}</h2>`;

function checkAnswer() {
    $("input[type='radio']").change(function(){
        $('input[type="radio"]').removeClass('checked');
        let radioValue = $("input[name='answer']:checked").val();
        if($('input[type="radio"]').is(":checked")) {
            if(radioValue){
                console.log(radioValue);
            }
            $(this).toggleClass('checked'); 
        }
    });   
}


//${data[i].answers.map( answer => `<li><p> ${answer.text}</p></li>`).join("\n")}