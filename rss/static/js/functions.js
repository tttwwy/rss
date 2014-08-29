$(function(){
	init_menu();
	toggle_ui();
	tabs_ui();
	accordion_ui();
	init_tipsy();
	
	init_twitter();
	init_flickr();
	init_quicksand();
	contact_form();
	init_carousel();
	init_fancybox();
	
});


function init_menu() {
	
	$('ul.sf-menu').superfish(); 
}

function toggle_ui()
{
	$(".toggle h3").eq(0).addClass("active");
	$(".toggle .content").eq(0).show();

	$(".toggle h3").click(function(){
		$(this).next(".content").slideToggle("slow");
		$(this).toggleClass("active");
	});
}

function tabs_ui()
{
	$(".tab_content").hide();
	$("ul.tabs li:first").addClass("active").show();
	$(".tab_content:first").show();
	$("ul.tabs li").click(function() {
		$("ul.tabs li").removeClass("active");
		$(this).addClass("active");
		$(".tab_content").hide();
		var activeTab = $(this).find("a").attr("href");
		$(activeTab).fadeIn(1000);
		return false;
	});	
}

function accordion_ui()
{
	$(".accordion h3").eq(0).addClass("active");
	$(".acc_content").eq(0).show();

	$(".accordion h3").click(function(){
		$(this).next(".acc_content").slideToggle("slow")
		.siblings(".acc_content:visible").slideUp("slow");
		$(this).toggleClass("active");
		$(this).siblings("h3").removeClass("active");
	});	
}




function init_tipsy() {
	$('.tooltip').tipsy();
	$('.blog_tooltip').tipsy({ gravity : 's' });
}

function init_fancybox() {
	$('.fancybox').fancybox({
                'transitionIn' : 'fade',
                'transitionOut' : 'fade',
                'speedIn' : '800',
                'speedOut' : '400',
                'overlayShow' : true,
				'overlayColor' : '#fcfcfc',
				'padding' : '3',
                'hideOnContentClick' : true,
                'titlePosition' : 'outside',
                'titleFormat' : null
    });
}

function init_carousel() {
	$(".clients").jCarouselLite({
        btnNext: ".next",
        btnPrev: ".prev"
    });
}

function init_twitter() {
	$(".twitter_feed, .footer #twitter_feed").tweet({
        username: "mojothemes",
        join_text: "auto",
        avatar_size: 25,
        count: 3,
        auto_join_text_default: "we said,",
        auto_join_text_ed: "we",
        auto_join_text_ing: "we were",
        auto_join_text_reply: "we replied to",
        auto_join_text_url: "we were checking out",
        loading_text: "loading tweets..."
    });
}

function init_flickr() {
	
	$('#flickr_feed').jflickrfeed({
		limit: 8,
		qstrings: {
			id: '34903216@N04'
		},
		useTemplate: false,
		itemCallback: function(item){
			$(this).append("<li><a href='#'><img src='" + item.image_m + "' alt=''/></a></li>");
		}
	});
}

function init_quicksand() {
	$('ul.sort a').click(function() {
		$(this).css('outline','none');
		$('ul.sort .current').removeClass('current');
		$(this).parent().addClass('current');
		
		var filterVal = $(this).text().toLowerCase().replace(' ','-');
				
		if(filterVal == 'all') {
			$('ul.portfolio_sort li.hidden').fadeIn('slow').removeClass('hidden');
		} else {
			
			$('ul.portfolio_sort li').each(function() {
				if(!$(this).hasClass(filterVal)) {
					$(this).fadeOut('normal').addClass('hidden');
				} else {
					$(this).fadeIn('slow').removeClass('hidden');
				}
			});
		}
		
		return false;
	});
}



function contact_form() 
{
	$("#contact_send").click(function() {
		var name    = $("input#name").val();
		var email   = $("input#email").val();
		var subject = $("input#subject").val();
		var text    = $("textarea#text").val();
		var post    = 'name=' + name + '&email=' + email + '&subject=' + subject + '&text=' + text;
		$.post('sendmail.php', post, function(data) {
			$("div#responce").html(data);
		});
	});
	
}