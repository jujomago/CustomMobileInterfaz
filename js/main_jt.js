
var PagesSwipe,Page1Scroll,TabsScroll,$tabs,activeNav,$mask,body;
var tab_press_call=false;


var pullDownEl, pullDownOffset, generatedCount = 0;

var CurrentPageScroll;

var current_tab=1;
var swapping=false;
var $page_elems;
var $wraper_pages;

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
                $page_elems=$('.page');
                $wraper_pages=$('.pages');

                $tabs=$('ul.tabs').find('li');

                var ancho_container_tabs=0;


                $wraper_pages.css('width',$page_elems.length*width_screen);
                $page_elems.css('width',width_screen);
                $page_elems.css('height',getViewportSize('h')-100);
                mobileScroll("#page"+current_tab);

                for (var i = $tabs.length - 1; i >= 0; i--) {
                    var thetab = $tabs[i];
                    var mc2 = new Hammer(thetab);
                    mc2.on("tap",pressTab);

                    console.log('tab_p'+(i+1)+" :: "+$tabs.eq(i).innerWidth());
                    ancho_container_tabs+=$tabs.eq(i).innerWidth();
                }

                var ajuste_offset=$page_elems.length+10;
                $('ul.tabs').css('width',ancho_container_tabs+ajuste_offset);

                var pages_container=document.querySelector('#wrapper');

                var mc = new Hammer(pages_container);

                mc.on('swipeleft',function(ev){
                    if(current_tab<$page_elems.length) {
                        var offset_movement = getViewportSize('w') * current_tab;
                        mover($wraper_pages, offset_movement, 'easeOutQuart', 'left',pruebita);
                    }
                });

                mc.on('swiperight',function(ev){
                    if(current_tab>1) {
                        var desplazaX = getXOffset($wraper_pages);
                        var offset_movement = Math.abs(desplazaX) - getViewportSize('w');
                        mover($wraper_pages, offset_movement, 'easeOutQuart', 'right',pruebita);
                    }
                });

                TabsScroll=new IScroll('.sub-header-bar',{
                    eventPassthrough: true,
                    scrollX: true,
                    scrollY: false,
                    preventDefault: false
                });

                //TODO: FALTA AJUSTAR ON RESIZE ....
                $(window).on('resize',function(){
                    width_screen=getViewportSize('w');
                    $wraper_pages.css('width',$page_elems.length*width_screen);
                    $page_elems.css('width',width_screen);
                    $page_elems.css('height',getViewportSize('h')-100);
                });

           });


            function pruebita(){

                console.log('callback del complete');
                console.log('estamos en el page:'+current_tab);
            }
            function mover(elem,offset,ease,dir,mycallback){
                var direction=dir||'none';

                if(swapping===false){
                    swapping=true;
                    elem.animate(
                            {
                            transform: 'translate('+(-offset)+'px)'
                            },{
                                easing :ease,
                                queue:false,
                                duration:270,
                                start:function(){

                                    if(direction=='left'){
                                        current_tab++;
                                    }else if(direction=='right'){
                                        current_tab--;
                                    }
                                    if(direction!=='none')
                                         selectTab(current_tab);
                                },
                                done: function() {
                                    swapping=false;
                                    var elselector="#"+$page_elems.get(current_tab-1).id;
                                    mobileScroll(elselector);
                                    $(".title").text(current_tab);
                                },
                                complete:mycallback
                            }
                    );
                }
            }

            function mobileScroll(selector){


                    CurrentPageScroll = new IScroll(selector,{
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
                    }
                });
            }

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
                 if(index>0)
                    index--;
                    underline_tab(index);

                    $el_li=$tabs.eq(index);
                    if(!$el_li.isOnScreen()){
                        console.log('entra');
                         updateTabViewport(index);
                    }

            }
            function getXOffset(elem){

                var matrix = elem.css('transform');
                if(matrix=='none') return 0;

                var matrix_ = matrix.substring(matrix.indexOf("(") + 1, matrix.indexOf(")"));

                return Math.abs(matrix_.split(',')[4]);

            }
            function pressTab(e){
                if(swapping===false){
                        var $thetab=$tabs.filter("#"+e.target.id);
                        current_tab=$thetab.index()+1;
                        underline_tab($thetab.index());
                        $thetab.addClass('activo').siblings().removeClass('activo');
                        var page_objetive=$tabs.filter("#"+e.target.id).attr('data-page');
                        var $next_page=$page_elems.filter("#"+page_objetive);
                        var left_next_page=$next_page.offset().left;

                        var offset_movement=getXOffset($wraper_pages)+left_next_page;
                        console.log(page_objetive +" left:"+left_next_page);
                        console.log(getXOffset($wraper_pages));

                        mover($wraper_pages,offset_movement , 'easeOutQuart');
                }
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