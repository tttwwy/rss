/**
 * Sexy LightBox - for jQuery 1.3.2
 * @name      sexylightbox.v2.3.js
 * @author    Eduardo D. Sada - http://www.coders.me/web-html-js-css/javascript/sexy-lightbox-2
 * @version   2.3.4
 * @date      10-Nov-2009
 * @copyright (c) 2009 Eduardo D. Sada (www.coders.me)
 * @license   MIT - http://es.wikipedia.org/wiki/Licencia_MIT
 * @example   http://www.coders.me/ejemplos/sexy-lightbox-2/
*/

jQuery.bind = function(object, method){
  var args = Array.prototype.slice.call(arguments, 2);  
  return function() {
    var args2 = [this].concat(args, $.makeArray( arguments ));  
    return method.apply(object, args2);  
  };  
};  

(function($) {

  SexyLightbox = {
    getOptions: function() {
      return {
        name          : 'SLB',
        zIndex        : 32000,
        color         : 'black',
        find          : 'sexylightbox',
        dir           : 'sexyimages',
        emergefrom    : 'top',
        background    : 'bgSexy.png',
        backgroundIE  : 'bgSexy.gif',
        buttons       : 'buttons.png',
        displayed     : 0,
        showDuration  : 200,
        closeDuration : 400,
        moveDuration  : 1000,
        moveEffect    : 'easeInOutBack',
        resizeDuration: 1000,
        resizeEffect  : 'easeInOutBack',
        shake         : {
                          distance   : 10,
                          duration   : 100,
                          transition : 'easeInOutBack',
                          loops      : 2
                        },
        BoxStyles     : { 'width' : 486, 'height': 320 },
        Skin          : {
                          'white' : { 'hexcolor': '#FFFFFF', 'captionColor': '#000000', 'background-color': '#000000', 'opacity': 0.6 },
                          'black' : { 'hexcolor': '#000000', 'captionColor': '#FFFFFF', 'background-color': '#000000', 'opacity': 0.6 },
                          'blanco': { 'hexcolor': '#FFFFFF', 'captionColor': '#000000', 'background-color': '#000000', 'opacity': 0.6 },
                          'negro' : { 'hexcolor': '#000000', 'captionColor': '#FFFFFF', 'background-color': '#000000', 'opacity': 0.6 }
                        }
      };
    },

    overlay: {
      create: function(options) {
        this.options = options;
        this.element = $('<div id="'+new Date().getTime()+'"></div>');
        this.element.css($.extend({}, {
          'position'  : 'absolute',
          'top'       : 0,
          'left'      : 0,
          'opacity'   : 0,
          'display'   : 'none',
          'z-index'   : this.options.zIndex
        }, this.options.style));
        
        this.element.bind('click', $.bind(this, function(obj, event) {
          if (this.options.hideOnClick) {
              if (this.options.callback) {
                this.options.callback();
              } else {
                this.hide();
              }
          }
          event.preventDefault();
        }));
        
        this.hidden = true;
        this.inject();
      },

      inject: function() {
        this.target = $(document.body);
        this.target.append(this.element);

        //if((Browser.Engine.trident4 || (Browser.Engine.gecko && !Browser.Engine.gecko19 && Browser.Platform.mac)))
        if($.browser.msie && $.browser.version=="6.0")
        // No tengo tiempo para agregar la detección del OS que debería
        // haber estado integrada en jQuery, pero que el estúpido de su creador no puso
        // Me cago en John Resig
        {
          var zIndex = parseInt(this.element.css('zIndex'));
          if (!zIndex)
          {
            zIndex = 1;
            var pos = this.element.css('position');
            if (pos == 'static' || !pos)
            {
              this.element.css({'position': 'relative'});
            }
            this.element.css({'zIndex': zIndex});
          }
          // Diossss por diosss, pongan funciones útiles en jQuery,
          // no todo es Selectores! la puta madre, lo que hay que hacer
          // para detectar si una variable está definida:
          zIndex = (!!(this.options.zIndex || this.options.zIndex === 0) && zIndex > this.options.zIndex) ? this.options.zIndex : zIndex - 1;
          if (zIndex < 0)
          {
            zIndex = 1;
          }
          this.shim = $('<iframe id="IF_'+new Date().getTime()+'" scrolling="no" frameborder=0 src=""></div>');
          this.shim.css({
            zIndex    : zIndex,
            position  : 'absolute',
            top       : 0,
            left      : 0,
            border    : 'none',
            opacity   : 0
          });
          this.shim.insertAfter(this.element);
        }

      },

      resize: function(x, y) {
        this.element.css({ 'height': 0, 'width': 0 });
        if (this.shim) this.shim.css({ 'height': 0, 'width': 0 });

        var win = { x: $(document).width(), y: $(document).height() };
        var chromebugfix = $.browser.safari ? (win.x - 25 < document.body.clientWidth ? document.body.clientWidth : win.x) : win.x;

        this.element.css({
          width  : x ? x : chromebugfix, //* chrome fix
          height : y ? y : win.y
        });

        if (this.shim)
        {
          this.shim.css({ 'height': 0, 'width': 0 });
          this.shim.css({
            width  : x ? x : chromebugfix, //* chrome fix
            height : y ? y : win.y
          });
        }
        return this;
      },

      show: function() {
        if (!this.hidden) return this;
        if (this.transition) this.transition.stop();
        this.target.bind('resize', $.bind(this, this.resize));
        this.resize();
        if (this.shim) this.shim.css({'display': 'block'});
        this.hidden = false;


        this.transition = this.element.fadeIn(this.options.showDuration, $.bind(this, function(){
          this.element.trigger('show');
        }));
        
        return this;
      },

      hide: function() {
        if (this.hidden) return this;
        if (this.transition) this.transition.stop();
        this.target.unbind('resize');
        if (this.shim) this.shim.css({'display': 'none'});
        this.hidden = true;

        this.transition = this.element.fadeOut(this.options.closeDuration, $.bind(this, function(){
          this.element.trigger('hide');
          this.element.css({ 'height': 0, 'width': 0 });
        }));

        return this;
      }

    },

    backwardcompatibility: function(option) {
      this.options.dir = option.imagesdir || option.path || option.folder || option.dir;
      this.options.OverlayStyles = $.extend(this.options.Skin[this.options.color], this.options.OverlayStyles || {});
    },

    preloadimage: function(url) {
      img     = new Image();
      img.src = url;
    },

    initialize: function(options) {
      this.options = $.extend(this.getOptions(), options);
      this.backwardcompatibility(this.options);

      var strBG = this.options.dir+'/'+this.options.color+'/'+((((window.XMLHttpRequest == undefined) && (ActiveXObject != undefined)))?this.options.backgroundIE:this.options.background);
      var name  = this.options.name;
      
      this.preloadimage(strBG);
      this.preloadimage(this.options.dir+'/'+this.options.color+'/'+this.options.buttons);

      this.overlay.create({
        style       : this.options.Skin[this.options.color],
        hideOnClick : true,
        zIndex      : this.options.zIndex-1,
        callback    : $.bind(this, this.close),
        showDuration  : this.options.showDuration,
        showEffect    : this.options.showEffect,
        closeDuration : this.options.closeDuration,
        closeEffect   : this.options.closeEffect
      });

      this.lightbox = {};

			$('body').append('<div id="'+name+'-Wrapper"><div id="'+name+'-Background"></div><div id="'+name+'-Contenedor"><div id="'+name+'-Top" style="background-image: url('+strBG+')"><a id="'+name+'-CloseButton" href="#">&nbsp;</a><div id="'+name+'-TopLeft" style="background-image: url('+strBG+')"></div></div><div id="'+name+'-Contenido"></div><div id="'+name+'-Bottom" style="background-image: url('+strBG+')"><div id="'+name+'-BottomRight" style="background-image: url('+strBG+')"><div id="'+name+'-Navegador"><strong id="'+name+'-Caption"></strong></div></div></div></div></div>');
      
      this.Wrapper      = $('#'+name+'-Wrapper');
      this.Background   = $('#'+name+'-Background');
      this.Contenedor   = $('#'+name+'-Contenedor');
      this.Top          = $('#'+name+'-Top');
      this.CloseButton  = $('#'+name+'-CloseButton');
      this.Contenido    = $('#'+name+'-Contenido');
      this.bb           = $('#'+name+'-Bottom');
      this.innerbb      = $('#'+name+'-BottomRight');
      this.Nav          = $('#'+name+'-Navegador');
      this.Descripcion  = $('#'+name+'-Caption');

      this.Wrapper.css({
        'z-index'   : this.options.zIndex,
        'display'   : 'none'
      }).hide();
      
      this.Background.css({
        'z-index'   : this.options.zIndex + 1
      });
      
      this.Contenedor.css({
        'position'  : 'absolute',
        'width'     : this.options.BoxStyles['width'],
        'z-index'   : this.options.zIndex + 2
      });
      
      this.Contenido.css({
        'height'            : this.options.BoxStyles['height'],
        'border-left-color' : this.options.Skin[this.options.color].hexcolor,
        'border-right-color': this.options.Skin[this.options.color].hexcolor
      });
      
      this.CloseButton.css({
        'background-image'  : 'url('+this.options.dir+'/'+this.options.color+'/'+this.options.buttons+')'
      });
      
      this.Nav.css({
        'color'     : this.options.Skin[this.options.color].captionColor
      });

      this.Descripcion.css({
        'color'     : this.options.Skin[this.options.color].captionColor
      });


          
      /**
       * AGREGAMOS LOS EVENTOS
       ************************/

      this.CloseButton.bind('click', $.bind(this, function(){
        this.close();
        return false;
      }));
      
      $(document).bind('keydown', $.bind(this, function(obj, event){
        if (this.options.displayed == 1) {
          if (event.keyCode == 27){
            this.close();
          }

          if (event.keyCode == 37){
            if (this.prev) {
              this.prev.trigger('click', event);
            }
          }

          if (event.keyCode == 39){
            if (this.next) {
              this.next.trigger('click', event);
            }
          }
        }
      }));

      $(window).bind('resize', $.bind(this, function() {
        if(this.options.displayed == 1) {
          this.replaceBox();
          this.overlay.resize();
        }
      }));

      $(window).bind('scroll', $.bind(this, function() {
        if(this.options.displayed == 1) {
          this.replaceBox();
        }          
      }));

      this.refresh();

    },
    
    hook: function(enlace) {
      enlace = $(enlace);
      enlace.blur();
      this.show((enlace.attr("title") || enlace.attr("name") || ""), enlace.attr("href"), (enlace.attr('rel') || false));
    },
    
    close: function() {
      this.animate(0);
    },
    
    refresh: function() {
      var self = this;
      this.anchors = [];

      $("a, area").each(function() {
        if ($(this).attr('rel') && new RegExp("^"+self.options.find).test($(this).attr('rel'))){
          $(this).click(function(event) {
            event.preventDefault();
            self.hook(this);
          });

          if (!($(this).attr('id')==self.options.name+"-Left" || $(this).attr('id')==self.options.name+"-Right")) {
            self.anchors.push(this);
          }
        }
      });
    },
    
    animate: function(option) {
      if(this.options.displayed == 0 && option != 0 || option == 1)
      {
        this.overlay.show();
        this.options.displayed = 1;
        this.Wrapper.css({'display': 'block'});
      }
      else //Cerrar el Lightbox
      {
        this.Wrapper.css({
          'display' : 'none',
          'top'     : -(this.options.BoxStyles['height']+280)
        }).hide();

        this.overlay.hide();
        this.overlay.element.bind('hide', $.bind(this, function(){
          if (this.options.displayed) {
            if (this.Image) this.Image.remove();
            this.options.displayed = 0;
          }
        }));
      }
    },
    
    /*
    Function: replaceBox
    @description  Cambiar de tamaño y posicionar el lightbox en el centro de la pantalla
    */
    replaceBox: function(data) {
      var size   = { x: $(window).width(), y: $(window).height() };
      var scroll = { x: $(window).scrollLeft(), y: $(window).scrollTop() };
      var width  = this.options.BoxStyles['width'];
      var height = this.options.BoxStyles['height'];
      
      if (this.options.displayed == 0)
      {
        var x = 0;
        var y = 0;
        
        // vertically center
        y = scroll.x + ((size.x - width) / 2);

        if (this.options.emergefrom == "bottom")
        {
          x = (scroll.y + size.y + 80);
        }
        else // top
        {
          x = (scroll.y - height) - 80;
        }
      
        this.Wrapper.css({
          'display' : 'none',
          'top'     : x,
          'left'    : y
        });
        this.Contenedor.css({
          'width'   : width
        });
        this.Contenido.css({
          'height'  : height - 80
        });
      }

      data = $.extend({}, {
        'width'  : this.lightbox.width,
        'height' : this.lightbox.height,
        'resize' : 0
      }, data);

      if (this.MoveBox) this.MoveBox.stop();

      this.MoveBox = this.Wrapper.animate({
        'left': (scroll.x + ((size.x - data.width) / 2)),
        'top' : (scroll.y + (size.y - (data.height + (this.navigator ? 80 : 48))) / 2)
      }, {
        duration  : this.options.moveDuration,
        easing    : this.options.moveEffect
      });

      if (data.resize) {
        if (this.ResizeBox2) this.ResizeBox2.stop();
        this.ResizeBox2 = this.Contenido.animate({
          height    : data.height
        }, {
          duration  : this.options.resizeDuration,
          easing    : this.options.resizeEffect
        });

        if (this.ResizeBox) this.ResizeBox.stop();

        this.ResizeBox = this.Contenedor.animate({
          width     : data.width
        }, {
          duration  : this.options.resizeDuration,
          easing    : this.options.resizeEffect,
          complete  : function(){
            $(this).trigger('complete');
          }
        });
      }

    },
    
    getInfo: function (image, id) {
      image=$(image);
      IEuta = $('<a id="'+this.options.name+'-'+id+'" title="'+image.attr('title')+'" rel="'+image.attr('rel')+'">&nbsp;</a>');
      IEuta.css({ 'background-image' : 'url('+this.options.dir+'/'+this.options.color+'/'+this.options.buttons+')' });
      IEuta.attr('href', image.attr('href')); //IE fix
      return IEuta;
    },
    
    display: function(url, title, force) {
      return this.show(title, url, '', force);
    },
    
    show: function(caption, url, rel, force) {
      this.showLoading();

      var baseURL     = url.match(/(.+)?/)[1] || url;
      var imageURL    = /\.(jpe?g|png|gif|bmp)/gi;
      var queryString = url.match(/\?(.+)/);
      if (queryString) queryString = queryString[1];
      var params      = this.parseQuery( queryString );

      if (this.ResizeBox) this.ResizeBox.unbind('complete'); //fix for jQuery

      params = $.extend({}, {
        'width'     : 0,
        'height'    : 0,
        'modal'     : 0,
        'background': '',
        'title'     : caption
      }, params || {});

      params['width']   = parseInt(params['width']);
      params['height']  = parseInt(params['height']);
      params['modal']   = parseInt(params['modal']);

      this.overlay.options.hideOnClick = !params['modal'];
      this.lightbox  = $.extend({}, params, { 'width' : params['width'] + 14 });
      this.navigator = this.lightbox.title ? true : false;

      if ( force=='image' || baseURL.match(imageURL) )
      {
          this.img = new Image();
          this.img.onload = $.bind(this, function(){
              this.img.onload=function(){};
              if (!params['width'])
              {
                var objsize = this.calculate(this.img.width, this.img.height);
                params['width']   = objsize.x;
                params['height']  = objsize.y;
                this.lightbox.width = params['width'] + 14;
              }

              this.lightbox.height = params['height'] - (this.navigator ? 21 : 35);
              
              this.replaceBox({ 'resize' : 1 });
              
              // Mostrar la imagen, solo cuando la animacion de resizado se ha completado
              this.ResizeBox.bind('complete', $.bind(this, function(){
                this.showImage(this.img.src, params);
              }));
          });

          this.img.onerror = $.bind(this, function() {
            this.show('', this.options.imagesdir+'/'+this.options.color+'/404.png', this.options.find);
          });

          this.img.src = url;
          
      } else { //code to show html pages

          this.lightbox.height = params['height']+($.browser.opera?2:0);
          this.replaceBox({'resize' : 1});
        
          if (url.indexOf('TB_inline') != -1) //INLINE ID
          {
            this.ResizeBox.bind('complete', $.bind(this, function(){
              this.showContent($('#'+params['inlineId']).html(), this.lightbox);
            }));
          }
          else if(url.indexOf('TB_iframe') != -1) //IFRAME
          {
            var urlNoQuery = url.split('TB_');
            this.ResizeBox.bind('complete', $.bind(this, function(){
              this.showIframe(urlNoQuery[0], this.lightbox);
            }));
          }
          else //AJAX
          {
            this.ResizeBox.bind('complete', $.bind(this, function(){
              $.ajax({
                url: url,
                type: "GET",
                cache: false,
                error: $.bind(this, function(){this.show('', this.options.imagesdir+'/'+this.options.color+'/404html.png', this.options.find)}),
                success: $.bind(this, this.handlerFunc)
              });
            }));
          }

      }
      

      this.next = false;
      this.prev = false;
       //Si la imagen pertenece a un grupo
      if (rel.length > this.options.find.length)
      {
          this.navigator = true;
          var foundSelf  = false;
          var exit       = false;
          var self       = this;

          $.each(this.anchors, function(index){
            if ($(this).attr('rel') == rel && !exit) {
              if ($(this).attr('href') == url) {
                  foundSelf = true;
              } else {
                  if (foundSelf) {
                      self.next = self.getInfo(this, "Right");
                       //stop searching
                      exit = true;
                  } else {
                      self.prev = self.getInfo(this, "Left");
                  }
              }
            }
          });
      }

      this.addButtons();
      this.showNavBar(caption);
      this.animate(1);
    },// end function

    calculate: function(x, y) {
      // Resizing large images
      var maxx = $(window).width() - 100;
      var maxy = $(window).height() - 100;

      if (x > maxx)
      {
        y = y * (maxx / x);
        x = maxx;
        if (y > maxy)
        {
          x = x * (maxy / y);
          y = maxy;
        }
      }
      else if (y > maxy)
      {
        x = x * (maxy / y);
        y = maxy;
        if (x > maxx)
        {
          y = y * (maxx / x);
          x = maxx;
        }
      }
      // End Resizing
      return {x: parseInt(x), y: parseInt(y)};
    },

    handlerFunc: function(obj, html) {
      this.showContent(html, this.lightbox);
    },

    addButtons: function(){
      if(this.prev) this.prev.bind('click', $.bind(this, function(obj, event) {event.preventDefault();this.hook(this.prev);}));
      if(this.next) this.next.bind('click', $.bind(this, function(obj, event) {event.preventDefault();this.hook(this.next);}));
    },

    showNavBar: function() {
      if (this.navigator)
      {
        this.bb.addClass("SLB-bbnav");
        this.Nav.empty();
        this.innerbb.empty();
        this.innerbb.append(this.Nav);
        this.Descripcion.html(this.lightbox.title);
        this.Nav.append(this.prev);
        this.Nav.append(this.next);
        this.Nav.append(this.Descripcion);
      }
      else
      {
        this.bb.removeClass("SLB-bbnav");
        this.innerbb.empty();
      }
    },

    showImage: function(image, size) {
      this.Background.empty().removeAttr('style').css({'width':'auto', 'height':'auto'}).append('<img id="'+this.options.name+'-Image"/>');
      this.Image = $('#'+this.options.name+'-Image');
      this.Image.attr('src', image).css({
        'width'  : size['width'],
        'height' : size['height']
      });
    
      this.Contenedor.css({
        'background' : 'none'
      });

      this.Contenido.empty().css({
          'background-color': 'transparent',
          'padding'         : '0px',
          'width'           : 'auto'
      });
    },

    showContent: function(html, size) {
      this.Background.empty().css({
        'width'            : size['width']-14,
        'height'           : size['height']+35,
        'background-color' : size['background'] || '#ffffff'
      });
      
      this.Contenido.empty().css({
        'width'             : size['width']-14,
        'background-color'  : size['background'] || '#ffffff'
      }).append('<div id="'+this.options.name+'-Image"/>');

      this.Image = $('#'+this.options.name+'-Image');
      this.Image.css({
        'width'       : size['width']-14,
        'height'      : size['height'],
        'overflow'    : 'auto',
        'background'  : size['height'] || '#ffffff'
      }).append(html);

      this.Contenedor.css({
        'background': 'none'
      });
    },

    showIframe: function(src, size, bg) {
      this.Background.empty().css({
        'width'           : size['width']-14,
        'height'          : size['height']+35,
        'background-color': size['background'] || '#ffffff'
      });

      var id = "if_"+new Date().getTime()+"-Image";

      this.Contenido.empty().css({
        'width'             : size['width']-14,
        'background-color'  : size['background'] || '#ffffff',
        'padding'           : '0px'
      }).append('<iframe id="'+id+'" frameborder="0"></iframe>');
      
      this.Image = $('#'+id);
      this.Image.css({
          'width'       : size['width']-14,
          'height'      : size['height'],
          'background'  : size['background'] || '#ffffff'
      }).attr('src', src);

      this.Contenedor.css({
        'background' : 'none'
      });
    },

    showLoading: function() {
      this.Background.empty().removeAttr('style').css({'width':'auto', 'height':'auto'});
      this.Contenido.empty().css({
        'background-color'  : 'transparent',
        'padding'           : '0px',
        'width'             : 'auto'
      });

      this.Contenedor.css({
        'background' : 'url('+this.options.imagesdir+'/'+this.options.color+'/loading.gif) no-repeat 50% 50%'
      });

      this.Contenido.empty().css({
          'background-color': 'transparent',
          'padding'         : '0px',
          'width'           : 'auto'
      });

      this.replaceBox($.extend(this.options.BoxStyles, {'resize' : 1}));
    },
  
    parseQuery: function (query) {
      if( !query )
        return {};
      var params = {};

      var pairs = query.split(/[;&]/);
      for ( var i = 0; i < pairs.length; i++ ) {
        var pair = pairs[i].split('=');
        if ( !pair || pair.length != 2 )
          continue;
        params[unescape(pair[0])] = unescape(pair[1]).replace(/\+/g, ' ');
       }
       return params;
    },

    shake: function() {
      var d=this.options.shake.distance;
      var l=this.Wrapper.position();
      l=l.left;
      for(x=0;x<this.options.shake.loops;x++) {
       this.Wrapper.animate({left: l+d}, this.options.shake.duration, this.options.shake.transition)
       .animate({left: l-d}, this.options.shake.duration, this.options.shake.transition);
      }
       this.Wrapper.animate({"left": l+d}, this.options.shake.duration, this.options.shake.transition)
       .animate({"left": l}, this.options.shake.duration, this.options.shake.transition);
    }
    
  }
})(jQuery);