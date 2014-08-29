/*-----------------------------------------------------------------------------------
/*
/* Custom JS
 /*
-----------------------------------------------------------------------------------*/

/* Start Document */
jQuery(document).ready(function($) {

/*----------------------------------------------------*/
/*	Responsive Menu
/*----------------------------------------------------*/

			// Create the dropdown bases
			$("<select />").appendTo("#navigation");
			
			// Create default option "Go to..."
			$("<option />", {
			   "selected": "selected",
			   "value"   : "",
			   "text"    : "Menu"
			}).appendTo("#navigation select");
			
				
			// Populate dropdowns with the first menu items
			$("#navigation li a").each(function() {
			 	var el = $(this);
			 	$("<option />", {
			     	"value"   : el.attr("href"),
			    	"text"    : el.text()
			 	}).appendTo("#navigation select");
			});
			
				
			//make responsive dropdown menu actually work			
	     	$("#navigation select").change(function() {
		       	window.location = $(this).find("option:selected").val();
		   	});

/*----------------------------------------------------*/
/*	Isotope Portfolio Filter
/*----------------------------------------------------*/

	$(function() {
		var $container = $('#portfolio-wrapper');
		// initialize Isotope
		$container.isotope({
		  // options...
		  resizable: false, // disable normal resizing
		  // set columnWidth to a percentage of container width
		  masonry: { columnWidth: $container.width() / 12 }
		});

		// update columnWidth on window resize
		$(window).smartresize(function(){
		  $container.isotope({
			// update columnWidth to a percentage of container width
			masonry: { columnWidth: $container.width() / 12 }
		  });
		});
		
		
      $container.isotope({
        itemSelector : '.portfolio-item'
      });
      
      var $optionSets = $('#filters .option-set'),
          $optionLinks = $optionSets.find('a');

      $optionLinks.click(function(){
        var $this = $(this);
        // don't proceed if already selected
        if ( $this.hasClass('selected') ) {
          return false;
        }
        var $optionSet = $this.parents('.option-set');
        $optionSet.find('.selected').removeClass('selected');
        $this.addClass('selected');
  
        // make option object dynamically, i.e. { filter: '.my-filter-class' }
        var options = {},
            key = $optionSet.attr('data-option-key'),
            value = $this.attr('data-option-value');
        // parse 'false' as false boolean
        value = value === 'false' ? false : value;
        options[ key ] = value;
        if ( key === 'layoutMode' && typeof changeLayoutMode === 'function' ) {
          // changes in layout modes need extra logic
          changeLayoutMode( $this, options )
        } else {
          // otherwise, apply new options
          $container.isotope( options );
        }
        
        return false;
      });
});

/*----------------------------------------------------*/
/*	Back To Top Button
/*----------------------------------------------------*/
		var pxShow = 300;//height on which the button will show
		var fadeInTime = 400;//how slow/fast you want the button to show
		var fadeOutTime = 400;//how slow/fast you want the button to hide
		var scrollSpeed = 400;//how slow/fast you want the button to scroll to top. can be a value, 'slow', 'normal' or 'fast'

		jQuery(window).scroll(function(){
			if(jQuery(window).scrollTop() >= pxShow){
				jQuery("#backtotop").fadeIn(fadeInTime);
			}else{
				jQuery("#backtotop").fadeOut(fadeOutTime);
			}
		});
		 
		jQuery('#backtotop a').click(function(){
			jQuery('html, body').animate({scrollTop:0}, scrollSpeed); 
			return false; 
		}); 

/* End Document */
})();


