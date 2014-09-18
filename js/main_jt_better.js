$(document).on('ready',function(){
    MobileApp.init();
    document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
    $(window).on('resize',MobileApp.changeOrientation);
});


//var MobileApp = MobileApp || {};
var MobileApp={
   current_tab:1,
   current_page_scroll:null,
   ancho_container_tabs:0,
   swapping:false,
   ajuste_offset_x:10,
   init:function(){
        this.width_screen=this.getViewportSize().width;
        this.$body=$("body");
        this.$mask=$("<div class='mask'></div>");

        this.$wraper_pages=$('.pages');
        this.$pages=this.$wraper_pages.find('.page');
        this.$wrapper_tabs=$('ul.tabs');
        this.$tabs=this.$wrapper_tabs.find('li');

        this.$toggleSlideLeft=$(".toggle-slide-left");
        this.$close_menu=$(".close-menu");


       this.changeOrientation();
       this.TabsScroll= new IScroll('.sub-header-bar',{
           eventPassthrough: true,
           scrollX: true,
           scrollY: false,
           preventDefault: false
       });

       this.bind_gestures();
       var first_page=this.$pages.first().attr('id'); // select first page to aply vertical scroll
       this.aplyVerticalScroll("#"+first_page);
   },
   changeOrientation:function(){
       var $tabs=MobileApp.$tabs;
       var $pages=MobileApp.$pages;
       var $wraper_pages=MobileApp.$wraper_pages;
       var $wraper_tabs=MobileApp.$wrapper_tabs;

       var widthScr=MobileApp.getViewportSize().width;
       var heightScr=MobileApp.getViewportSize().height-100; // 100 es el alto del header y el subheader con tabs

       // AJUSTE ANCHO WRAPPER PAGES Y DIMESIONES DE CADA PAGE
       //==============
       $wraper_pages.css('width',$pages.length*widthScr);
       $pages.css({
           'width':widthScr,
           'height':heightScr
       });
       //==============

       // AJUSTE ANCHO WRAPPER TABS, ES SUMATORIA POR QUE CADA TAB PUEDE TENER UN ANCHO DIFERENTE
       //==============
       for (var i = $tabs.length - 1; i >= 0; i--)
           this.ancho_container_tabs+=$tabs.eq(i).innerWidth();

       $wraper_tabs.css('width',this.ancho_container_tabs+this.ajuste_offset_x);
       //==============

       // AJUSTE DEL OFFSET PARA EL TRANSFORM PARA QUE COINCIDA CON LA PAGE ACTUAL
       //==============
       var current_movement=MobileApp.getXOffset($wraper_pages);
       var current_index=MobileApp.current_tab;
       var valorajustar=$pages.eq(current_index-1).offset().left;

       $wraper_pages.css('transform','translateX(-'+(current_movement+valorajustar)+'px)');
       //==============
   },
   bind_gestures:function(){
       var $tabs=this.$tabs;
       var $pages=this.$pages;
       var $wraper_pages=this.$wraper_pages;

       console.log("dade3:"+$wraper_pages.length);

       for (var i = $tabs.length - 1; i >= 0; i--) {
           var tab_gesture = new Hammer($tabs[i]);
           tab_gesture.on("tap",this.pressTab);
       }

       var pages_container=$('#wrapper')[0];

       var mc = new Hammer(pages_container);
       var offset_movement=0;
       mc.on('swipeleft',function(ev){

           if(MobileApp.current_tab < $pages.length) {
               offset_movement = MobileApp.getViewportSize().width * MobileApp.current_tab;
               console.log('offset_mov:'+offset_movement);
               console.log('curren_tab:'+MobileApp.current_tab);
               MobileApp.slidePage($wraper_pages, offset_movement, 'easeOutQuart', 'left');
           }
       });

       mc.on('swiperight',function(ev){
           if(MobileApp.current_tab> 1) {
               var desplazaX = MobileApp.getXOffset($wraper_pages);
               offset_movement = Math.abs(desplazaX) -  MobileApp.getViewportSize().width;
               MobileApp.slidePage($wraper_pages, offset_movement, 'easeOutQuart', 'right');
           }
       });

       var toggleSide = new Hammer(this.$toggleSlideLeft.get(0));
       toggleSide.on("tap",function(ev){
           if(MobileApp.activeNav==="sml-open")
               MobileApp.hideSideMenu();
           else
                MobileApp.showSideMenu();
       });

   },
   getViewportSize:function(){
       return {
           width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
           height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
       };
   },
   aplyVerticalScroll:function(selector){
       this.current_page_scroll = new IScroll(selector);
   },
   slidePage:function(elem,offset,ease,dir,mycallback){
       var direction=dir||'none';
       console.log(offset);
//       console.log(elem.attr('class'));
       if(this.swapping===false){
           this.swapping=true;
           elem.animate(
               {
                   transform: 'translate('+(-offset)+'px)'
               },{
                   easing :ease,
                   queue:false,
                   duration:270,
                   start:function(){

                       if(direction=='left'){
                           MobileApp.current_tab++;
                       }else if(direction=='right'){
                           MobileApp.current_tab--;
                       }
                      if(direction!=='none')
                           MobileApp.selectTab( MobileApp.current_tab);
                   },
                   done: function() {
                       MobileApp.swapping=false;
                       var elselector="#"+MobileApp.$pages.get( MobileApp.current_tab-1).id;
                       MobileApp.aplyVerticalScroll(elselector);
                       $(".title").text( MobileApp.current_tab);
                   },
                   complete:mycallback
               }
           );
       }
   },
   underline_tab:function(index){
       var $el_li=this.$tabs.eq(index);
       $el_li.siblings().removeClass('activo');
       $el_li.addClass('activo');
   },
   selectTab:function(index){
       if(index>0)
           index--;

       this.underline_tab(index);

       var $el_li=this.$tabs.eq(index);
//       console.log($el_li);
       if(!$el_li.isOnScreen()){
           console.log('entra');
           this.updateTabViewport(index);
       }
   },
   getXOffset:function(elem){
       var matrix = elem.css('transform');
       if(matrix=='none') return 0;

       var matrix_ = matrix.substring(matrix.indexOf("(") + 1, matrix.indexOf(")"));

       return Math.abs(matrix_.split(',')[4]);
   },
   pressTab:function(evt){
       console.log(MobileApp.$tabs);
       if(MobileApp.swapping===false){
           var $thetab=MobileApp.$tabs.filter("#"+evt.target.id);
           MobileApp.current_tab=$thetab.index()+1;
           MobileApp.underline_tab($thetab.index());
           $thetab.addClass('activo').siblings().removeClass('activo');
           var page_objetive=$thetab.attr('data-page');
           var $next_page=MobileApp.$pages.filter("#"+page_objetive);
           var left_next_page=$next_page.offset().left;

           var offset_movement=MobileApp.getXOffset(MobileApp.$wraper_pages)+left_next_page;

           MobileApp.slidePage(MobileApp.$wraper_pages,offset_movement ,'easeOutQuart');
       }
   },
    updateTabViewport: function (index) {
        this.TabsScroll.scrollToElement('#tab_p'+(index+1),null,true,null);
    },
    showSideMenu:function() {
        this.activeNav = "sml-open";
        this.$body.addClass(this.activeNav).append(this.$mask);
    },
    hideSideMenu:function(){
        this.$body.removeClass(this.activeNav).find(".mask").remove();
        this.activeNav = "";
    }
};


