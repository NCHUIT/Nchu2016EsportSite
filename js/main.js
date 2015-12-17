
jQuery(document).ready(function(){
    jQuery('.special.cards .image').dimmer({
        on: 'hover'
    });
    $('.ui.accordion')
    .accordion()
    ;   

    function myCallback(data){
        data.reverse();
        console.log(data);
        // ActiveStart
        console.log(data[i])
        var temp1 = '<div class="title active"><i class="dropdown icon"></i>';  
        temp1 += data[0].title+'</div>' ;
        temp1 += '<div class="content active"><p>' + data[0].content + '</p></div>';
        $(temp1).appendTo("#insert");
        // ActiveEnd

        //限定新消息數量(if最多6則 else不足6則時取前6則)
        if (data.length<=6) {
            for (var i = 1 ; i < data.length ; i++){
                console.log(data[i])
                var temp = '<div class="title"><i class="dropdown icon"></i>';  
                temp += data[i].title+'</div>' ;
                temp += '<div class="content"><p>' + data[i].content + '</p></div>';
                $(temp).appendTo("#insert");
            }
        } 
        else { 
            for (var i = 1 ; i < 6 ; i++){
                console.log(data[i])
                var temp = '<div class="title"><i class="dropdown icon"></i>';  
                temp += data[i].title+'</div>' ;
                temp += '<div class="content"><p>' + data[i].content + '</p></div>';
                $(temp).appendTo("#insert");
            }                    
        }



        
    }
    var key = '1o3E8f8vD0tUWm2Ls-RZqsjzgCDEx-_IhNl2QtKii9Uk';
    var soup = new SpreadsheetSoup(key, myCallback);


});

//彈跳視窗
jQuery(document).ready(function(){
    $('.ui.inverted.button').click(function(){
        $('.ui.modal.LOL')
        .modal('show')
        ;
    });

    $('.ui.primary.button').click(function(){
        $('.ui.modal.HS')
        .modal('show')
        ;
    });
});