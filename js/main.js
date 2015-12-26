jQuery(document).ready(function(){
      //control the top sidebar menu
      $("#mbutton").on({
        mouseenter: function(){
          $(this).addClass('animated jello');
        },
        mouseleave: function(){
          $(this).removeClass("animated jello");
        },
        click: function(){
          $('.ui.sidebar')
          .sidebar('setting', 'transition', 'push')
          .sidebar('toggle') ;
        }
      });

      //control the top sidebar menu's items
      //logo
      $("#mit1").on({
        mouseenter: function(){
          $(this).addClass("active purple");
        },
        mouseleave: function(){
          $(this).removeClass("active purple");
        },
        click: function(){
          $('html,body').animate({scrollTop:$('#logo').offset().top},600);
        }
      });
      // NEWS
      $("#mit2").on({
        mouseenter: function(){
          $(this).addClass("active orange");
        },
        mouseleave: function(){
          $(this).removeClass("active orange");
        },
        click: function(){
          $('html,body').animate({scrollTop:$('#NEWS').offset().top},600);
        }
      });
      // 4 games intro
      $("#mit3").on({
        mouseenter: function(){
          $(this).addClass("active teal");
        },
        mouseleave: function(){
          $(this).removeClass("active teal");
        },
        click: function(){
          $('html,body').animate({scrollTop:$('#intro').offset().top},600);
        }
      });

      // detail
      $("#mit4").on({
        mouseenter: function(){
          $(this).addClass("active yellow");
        },
        mouseleave: function(){
          $(this).removeClass("active yellow");
        },
        click: function(){
          $('html,body').animate({scrollTop:$('#detail').offset().top},600);
        }
      });

      // report
      $("#mit5").on({
        mouseenter: function(){
          $(this).addClass("active green");
        },
        mouseleave: function(){
          $(this).removeClass("active green");
        },
        click: function(){
          $('html,body').animate({scrollTop:$('#report').offset().top},600);
        }
      });

      //control scroll back to top button
      $("#gotopbutton").on({
        mouseenter: function(){
          $(this).addClass('animated shake');
        },
        mouseleave: function(){
          $(this).removeClass('animated shake');
        },
        click: function(){
          $('html,body').animate({scrollTop:$('#logo').offset().top},600);
        }
      });




    //report card dimmer
    jQuery('.special.cards .image').dimmer({
        on: 'hover'
    });
    $('.ui.accordion')
    .accordion()
    ;   

    //Regulation menu
    $('.menu .item')
      .tab()
    ;    

    function myCallback(data){
        data.reverse();
        console.log(data);
        // ActiveStart
        console.log(data[i])
        var temp1 = '<div class="title active"><i class="dropdown icon"></i>' + data[0].title + '</div>'
                    +'<div class="content active"><p>' + data[0].content + '</p></div>';
        $(temp1).appendTo("#insert");
        // ActiveEnd

        //限定新消息數量(active除外 if最多6則，else不足6則時取前6則)
        if (data.length<=6) {
            for (var i = 1 ; i < data.length ; i++){
                console.log(data[i])
                var temp = '<div class="title"><i class="dropdown icon"></i>' + data[i].title +'</div>' 
                            + '<div class="content"><p>' + data[i].content + '</p></div>';  
                $(temp).appendTo("#insert");
            }
        } 
        else { 
            for (var i = 1 ; i < 7 ; i++){
                console.log(data[i])
                var temp = '<div class="title"><i class="dropdown icon"></i>' + data[i].title +'</div>' 
                            + '<div class="content"><p>' + data[i].content + '</p></div>';  
                $(temp).appendTo("#insert");
            }                    
        }
     
    }
    var key = '1o3E8f8vD0tUWm2Ls-RZqsjzgCDEx-_IhNl2QtKii9Uk';
    var soup = new SpreadsheetSoup(key, myCallback);





    //彈跳視窗
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

    $('.ui.secondary.button').click(function(){
        $('.ui.modal.minigame')
        .modal('show')
        ;
    });


    // Logo附著效果
    // $('.garena01')
    //   .transition('scale')
    // ;
    $('.garena01').click(function(){
      $(this).transition('scale');
    });

});

