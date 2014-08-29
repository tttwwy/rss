$(function() {
	
	init_settings();
	change_background_pattern();
	change_background_color();
	change_text_color();
	change_heading_color();
	reset_settings();
});

function init_settings() {
	
	$(".option_btn").click(function(){
		if( $("#option_wrapper").css("left") != "0px" ) {
			$("#option_wrapper").animate({left:"0px"},{duration:250});
			$(this).animate({left:"140px"},{duration:250});
			$(this).removeClass("settings-close").addClass("settings-open");
		}else {
			$("#option_wrapper").animate({left:"-212px"},{duration:300});
			$(".option_btn").animate({left:"-1px"},{duration:300});
			$(this).removeClass("settings-open").addClass("settings-close");
		}
	});
	
}

function change_background_pattern() {
	
	$("#bg_pattern a").click(function(){
		$("body").css("background", "url("+$(this).attr('rel')+")");
	});
}

function change_background_color() {
	
	$('#bg_colorSelector').ColorPicker({
		color: '#0000ff',
		onShow: function (colpkr) {
			$(colpkr).fadeIn(500);
			return false;
		},
		onHide: function (colpkr) {
			$(colpkr).fadeOut(500);
			return false;
		},
		onChange: function (hsb, hex, rgb) {
			var backgroundColor = hex;
			$('body').css('background', '#' + backgroundColor);
			$.cookie("sensation_bg_color", backgroundColor);
		}
	});
}

function change_text_color() {
	
	$('#text_colorSelector').ColorPicker({
		color: '#0000ff',
		onShow: function (colpkr) {
			$(colpkr).fadeIn(500);
			return false;
		},
		onHide: function (colpkr) {
			$(colpkr).fadeOut(500);
			return false;
		},
		onChange: function (hsb, hex, rgb) {
			var textColor = hex;
			$('.container').css('color', '#' + textColor);
			
			
			$.cookie("sensation_text_color", textColor);
		}
	});
}

function change_heading_color() {
	
	$('#heading_colorSelector').ColorPicker({
		color: '#0000ff',
		onShow: function (colpkr) {
			$(colpkr).fadeIn(500);
			return false;
		},
		onHide: function (colpkr) {
			$(colpkr).fadeOut(500);
			return false;
		},
		onChange: function (hsb, hex, rgb) {
			var headingColor = hex;
			$('h1, h2, h3, h4, h5, h6').css('color', '#' + headingColor);
			
			$.cookie("sensation_heading_color", headingColor);
		}
	});
}

function reset_settings() {
	
	$('.reset_settings').click(function() {
		$('body').css('background','url("images/patterns/bg_main.png")');
		$('h1, h2, h3, h4, h5, h6').css('color', '#444444');
		$('.footer h4').css('color', '#e6e6e6');
		$('.container').css('color','#777');
	});
}