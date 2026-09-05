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
});;;