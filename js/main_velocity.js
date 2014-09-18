
var PagesSwipe,Page1Scroll,TabsScroll,$tabs,activeNav,$mask,body;
var tab_press_call=false;

            $.fn.isOnScreen = function(){
                var win = $(window);

                var viewport = {
                    top : win.scrollTop(),
                    left : win.scrollLeft()
                };
                viewport.right = viewport.left + win.width();
                viewport.bottom = viewport.top + win.height();

                var bounds = this.offset();
                bounds.right = bounds.left + this.outerWidth();
                bounds.bottom = bounds.top + this.outerHeight();

                return (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));

            };


var pullDownEl, pullDownOffset, generatedCount = 0;



var current_tab=1;

            $(document).on('ready',function(){

                document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

                var $toggleSlideLeft=$(".toggle-slide-left"),
                    $close_menu=$(".close-menu");

                body = document.body;
                $mask=$("<div class='mask'></div>");


                $toggleSlideLeft.on("tap", showSideMenu);
                $mask.on("tap", hideSideMenu);
                $close_menu.on("tap", hideSideMenu);

                /*      pullDownEl = document.getElementById('pullDown');
                pullDownOffset = pullDownEl.offsetHeight;*/
    /*            pullUpEl = document.getElementById('pullUp');
                pullUpOffset = pullUpEl.offsetHeight;*/

                var width_screen=getViewportSize('w');
                var $page_elems=$('.page');
                var $wraper_pages=$('.pages');

                $tabs=$('ul.tabs').find('li');

                var ancho_container_tabs=0;


                $wraper_pages.css('width',$page_elems.length*width_screen);
                $page_elems.css('width',width_screen);
                $page_elems.css('height',getViewportSize('h')-100);


                for (var i = $tabs.length - 1; i >= 0; i--) {
                      console.log('tab_p'+(i+1)+" :: "+$tabs.eq(i).innerWidth());
                    ancho_container_tabs+=$tabs.eq(i).innerWidth();
                };

                var ajuste_offset=$page_elems.length+10;
                $('ul.tabs').css('width',ancho_container_tabs+ajuste_offset);



                var pages_container=document.querySelector('#wrapper');

                var mc = new Hammer(pages_container);

                mc.on('swipeleft',function(ev){
//
//                    alert(3);
//                   console.log(ev);
//                    $wraper_pages.animate({left: "-=100"}, 500);
                   var offset_movement=getViewportSize('w')*current_tab;
                    current_tab++;
//                    console.log(Velocity);
                    $wraper_pages.velocity({
                        translateX: -offset_movement+"px",
                        translateY:0
                    });

//                    $("#event").text("swipe left");
//                    alert( ev.type +" gesture detected.");
                });
                mc.on('swiperight',function(ev){

                    var pros_transfom=$('.pages').css('transform');
                    var matrix = new WebKitCSSMatrix(pros_transfom);

                   var desplazaX=matrix.m41;  // -770
//
//      console.log(ev);
                   current_tab--;
                   var offset_movement=Math.abs(desplazaX)-getViewportSize('w');
         /*           move('.pages')
                        .x(-offset_movement)
                        .end(function () {

                            console.log(current_tab);
                        });*/
                    $wraper_pages.velocity({
                        translateX: -offset_movement+"px",
                        translateY:0
                    });
                    console.log( ev.type +" gesture detected.");
                });

//                PagesSwipe = Swipe(document.getElementById('wrapper'),{
//                    continuous: false,
////                    disableScroll: true,
//                     callback: function(index, element) {
//                       selectTab(index);
//                     }/*,
//                      transitionEnd: function(index, element) {
//                        console.log('transitionEnd');
//                        console.log(index);
//                        console.log(element);
//                      }*/
//                });

            /*    Page1Scroll = new IScroll('#page1',{
                    bounce :false*/
                /*
                      scrollX: false,
                       scrollY: true,
                    onRefresh: function () {
                        if (pullDownEl.className.match('loading')) {
                            pullDownEl.className = '';
                            pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Pull down to refresh...';
                        } else if (pullUpEl.className.match('loading')) {
                            pullUpEl.className = '';
                            pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Pull up to load more...';
                        }
                    },
                    onScrollMove: function () {
                        if (this.y > 5 && !pullDownEl.className.match('flip')) {
                            pullDownEl.className = 'flip';
                            pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Release to refresh...';
                            this.minScrollY = 0;
                        } else if (this.y < 5 && pullDownEl.className.match('flip')) {
                            pullDownEl.className = '';
                            pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Pull down to refresh...';
                            this.minScrollY = -pullDownOffset;
                        } else if (this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('flip')) {
                            pullUpEl.className = 'flip';
                            pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Release to refresh...';
                            this.maxScrollY = this.maxScrollY;
                        } else if (this.y > (this.maxScrollY + 5) && pullUpEl.className.match('flip')) {
                            pullUpEl.className = '';
                            pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Pull up to load more...';
                            this.maxScrollY = pullUpOffset;
                        }
                    },
                    onScrollEnd: function () {
                        if (pullDownEl.className.match('flip')) {
                            pullDownEl.className = 'loading';
                            pullDownEl.querySelector('.pullDownLabel').innerHTML = 'Loading...';
                            pullDownAction();	// Execute custom function (ajax call?)
                        } else if (pullUpEl.className.match('flip')) {
                            pullUpEl.className = 'loading';
                            pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Loading...';
                            pullUpAction();	// Execute custom function (ajax call?)
                        }
                    }*/
//                });


                TabsScroll=new IScroll('.sub-header-bar',{
                    eventPassthrough: true,
                    scrollX: true,
                    scrollY: false,
                    preventDefault: false
                });

                $(window).on('resize',function(){
                    width_screen=getViewportSize('w');
                    $wraper_pages.css('width',$page_elems.length*width_screen);
                    $page_elems.css('width',width_screen);
                    $page_elems.css('height',getViewportSize('h')-100);
                });

                $tabs.on('tap',pressTab);

            });

            function getViewportSize(p){
                if(p==='w')
                    return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
                else if(p==='h')
                    return  Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

            }
            function underline_tab(index){
                $el_li=$tabs.eq(index);
                $el_li.siblings().removeClass('activo');
                $el_li.addClass('activo');
            }
            function selectTab(index){

  /*              if(tab_press_call===true){
                      tab_press_call=false;
                    return;
                }else{*/
                 console.log('esto es por el swipe');
                // console.log(this.currentPage);

                    underline_tab(index);
                // if(!tab_press_call){
                    $el_li=$tabs.eq(index);
                    if(!$el_li.isOnScreen()){
                        console.log('entra');
                         updateTabViewport(index);
                    }
                // }

                // }
            }
            function pressTab(){
                // console.log(this.id);
               var indice=$tabs.index($(this));
               underline_tab(indice);
               // $(this).addClass('activo').siblings().removeClass('activo');
               // console.log('indice:'+indice);
               PagesSwipe.slide(indice);
               tab_press_call=true;
               // selectTab(indice);
            }

            function updateTabViewport(index){
                 // $el=$tabs.find('#ab_p'+(index+1)
                 TabsScroll.scrollToElement('#tab_p'+(index+1),null,true,null);
            }
            function showSideMenu(){
                    body.classList.add("sml-open" );
                    body.appendChild($mask.get(0));
                    activeNav = "sml-open";
            }
            function hideSideMenu(){
                     body.classList.remove(activeNav);
                     activeNav = "";
                     body.removeChild($mask.get(0));
            }