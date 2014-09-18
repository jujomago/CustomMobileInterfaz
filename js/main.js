

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


            var PagesScroll,Page1Scroll,TabsScroll,$tabs,activeNav,$mask,body;

            $(document).on('ready',function(){

                var $toggleSlideLeft=$(".toggle-slide-left"),
                    $close_menu=$(".close-menu");
                
                body = document.body;
                $mask=$("<div class='mask'></div>");

                /* slide menu left */
                $toggleSlideLeft.on("tap", showSideMenu);
            
                /* hide active menu if mask is clicked */
                $mask.on( "tap", hideSideMenu);

                /* hide active menu if close menu button is clicked */
                 $close_menu.on( "tap", hideSideMenu);



                
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
                
                PagesScroll = new IScroll('#wrapper',{  
                    eventPassthrough: true, 
                    scrollX: true, 
                    scrollY: false, 
                    preventDefault: false,
                    snap: '.page',
                    momentum:false
                    }
                ); 
                
                PagesScroll.on('scrollEnd',selectTab);


    /*            SwipePagesScroll.on('scroll',function(){
                    console.log(this.currentPage);
                    console.log(this);
                    // console.log(this);
                    current_tab='#tab_p'+(this.currentPage.pageX+1);
                    elnext=$(current_tab).next();
                    // next_tab='#tab_p'+(this.currentPage.pageX+2)
                    console.log(elnext+" is visible:");
                    // if(!$(current_tab).next().isOnScreen()){
                        TabsScroll.scrollTo(this.x,0);
                    // }
                    



                 });  */


                Page1Scrll = new IScroll('#page1',{
                    scrollbars:true,
                    fadeScrollbars:true
                }); 

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
            function selectTab(){
                // console.log(this.currentPage);
                 $el_li=$tabs.eq(this.currentPage.pageX);
                 $el_li.addClass('activo').siblings().removeClass('activo');
               
                if(!$el_li.isOnScreen()){
                    console.log('entra');
                     updateTabViewport(this.currentPage.pageX);                 
                }                  
            }   
            function pressTab(){
                // console.log(this.id);
               var indice=$tabs.index($(this));
               $(this).addClass('activo').siblings().removeClass('activo');
               console.log('indice:'+indice);
               PagesScroll.goToPage(indice, 0,300);
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