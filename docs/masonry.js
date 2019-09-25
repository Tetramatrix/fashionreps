/***************************************************************
 *  Copyright notice
 *
 *  (c) 2011-2019 Chi Hoang <rebrobates@gmail.com>
 *  All rights reserved
 *
 ***************************************************************/
( function() {
  
  var $j;
  var boxCount = 0,
      counter = 0;
  var brick_stack = [];
  var url_stack = [];
  var url_back = [];
  var root_but = "Home";
  var about_but = "About Us";
  var mobile = false;
    
  function gridview ()
  {
    var btn = $(this);
    if (btn.data('running'))
      return;
    
    btn.data('running', true);
    var s = $j('#tx-charbeitsbeispiele-pi1 #singleview');
    var c = $j('#container');
    
    if ( url_stack.length > 1 || url_back.length > 0 )
    {
      if ( url_stack.length > 1 )
      {       
        // This represents the current link
        url = url_stack.pop();
        // This represents the past link
        url = url_stack.pop();
        url_back.push(url);
      } else
      {
        url = url_back.pop(url);
        url_back = [];
      }
      s.css({
        "position": "absolute",
        "top": "-600px",
        "height": "600px",
        "left" : "0px"
      })
      $j.getJSON(url, function(json)
      {    
        if (json)
        {
          s.empty().append($j("#singleviewTemplate").tmpl(json).css({
            "visibility": "visible",
            "position": "relative"
          })).animate({
            "opacity": "100.0",
            "top": "0px",
            "left": "0px"
          }, 900, function() {
            // Unset it here, this lets the button be clickable again
            btn.data('running', false);
          });  
        }  
      });
    } else
    {
      // This may be empty, or represent the current content
      url = url_stack.pop();
      url_back = [];
      
      s.animate({
        "opacity": "0.0",
        "top": "-=600px"
        }, 900, function()
        {
          // Animation complete.
          s.empty();
          c.css({
            "opacity": "0.0"
          }).animate({
              "opacity": "100.0",
              "left" : "0px",
              "top": "10px"
          }, 900, function()
            {
              url_stack = [];
              // Unset it here, this lets the button be clickable again
              btn.data('running', false);
        });
      });
    }
    
    if (c.outerHeight()>0) {
    	  c.after('<div id="footer"><a href="https://info.flagcounter.com/4WNR"><img src="https://s01.flagcounter.com/count2/4WNR/bg_FFFFFF/txt_000000/border_CCCCCC/columns_8/maxflags_24/viewers_0/labels_0/pageviews_1/flags_0/percent_0/" alt="Flag Counter" border="0"></a></div>');
    		$j('#footer').css({'top' : c.outerHeight()+7 + 'px','position' : 'absolute', 'margin-left':'170px'});
    }
  }
  
  function singleview (url)
  {
    var btn = $(this);
    if (btn.data('running'))
      return;
    
    var c = $j('#container');
    var s = $j('#tx-charbeitsbeispiele-pi1 #singleview');
    
    $j('#footer').remove();
    
    s.empty();
    btn.data('running', true);
  
    //url="http://"+url+"index.php?id="+id+"&eID=ch_arbeitsbeispiele_singleview";
    
    if (url_stack.length == 0 && url_back.length > 0)
    {
      bak = url_back.pop();
      url_stack.push(bak);
      url_back.push(bak);
      url_stack.push(url);
    } else
    {
      url_stack.push(url);  
      console.log(url_stack);
    }
    c.css({
      "z-index" : "-35",
      "position": "absolute",
      "left" : "0px",
      "top" : "10px"
    }).animate({
      "position": "relative",
      "opacity": "0.0",
      "top": "+=600px",
      "left" : "0px"
    }, 900, function()
      {
      
      //$('#singleview').load("https://cors-anywhere.herokuapp.com/"+url);
      // Animation complete.
      /*
      $j.ajax({url: "https://cors-anywhere.herokuapp.com/"+url,
      				type: 'GET',
      				dataType: 'html',
      			 success: function(json)
      {
      */
      
      $j.getJSON(url,function(json) {      
        if (json)
        {
        	 /* s.html(json); */

          s.css({
            "position": "absolute",
            "top": "-600px",
            "height": "600px",
            "left" : "170px"
          }).animate({
            "opacity": "100.0",
            "top": "10px",
            "left" : "170px"
          }, 900, function() {
            // Unset it here, this lets the button be clickable again
            btn.data('running', false);
          }).append($j("#singleviewTemplate").tmpl(json).css({
            "visibility": "visible",
            "position": "relative"
          }));
        }        
      });
            
    });
  }
  
  function ajax (self) {
    // Menu ajax script
    $j("#tx-charbeitsbeispiele-pi1 #menu li").click(function()
    {
    	var n = $j(this).find('a').text();
    	console.log(n);
    		// about button    	
    	if (n == about_but || self.url_stack().length>0) {
    		
				 console.log(self.url_stack());
				 if (self.url_stack().length==0) 
				 {
				 		// this changes the scrolling behavior to "smooth"
						window.scrollTo({ top: 0, behavior: 'smooth' });
				 		var toggle = $("#tx-charbeitsbeispiele-pi1 #menu li")[1];
						$(toggle).removeClass('ref_no').addClass('ref_act');
						var theHref = $(toggle).find('a').attr("href").replace(/\?toggle=.*/g, '');		
						$(toggle).find('a').attr("href", theHref + "?toggle=on");	
				 		singleview($j(this).find('a').attr('href'));
				 		
				 } else {
				 	
						bbut (); 	
				 }
    		return false;
    		
    	} else {
    		
    			$j.getJSON($j(this).find('a').attr('href'), function(json)
		      {
		        if (json && json.length)
		        {
		        	$j('#footer').remove();
		        	 
		          var container = $j('#tx-charbeitsbeispiele-pi1 #container');
		          container.masonry();
		          var toggle = this.url.match(/toggle=on/g);
		          var clrscreen = this.url.match(/screen=clear/g);
		          boxCount = json.length;
        			counter = 0;
        
		          if (clrscreen) {
		          	container.empty();
		          }

	            if (toggle)
	            {	
	            	
	            	// this changes the scrolling behavior to "smooth"
								window.scrollTo({ top: 0, behavior: 'smooth' });
								          
			          $j.each(json.reverse(), function(idx, ele)
			          {
			          	  //ele.Headline = ele.Headline.replace(/([()])/g, " ");
			          	  
			              if (ele.Additem == "Append" && ele.Isimage == "true" )
			              {
			              	var templ = "#brickTemplate";
			                
			              } else if (ele.Additem == "Append")
			              {
			              	var templ = "#defaultTemplate";

			                
			              } else if (ele.Additem == "Prepend" && ele.Isimage == "true" )
			              {
			              	var templ = "#brickTemplate";
			                 
			              } else
			              {
			              	var templ = "#defaultTemplate";		                
			              }
			              
			              var brick = $j(templ).tmpl(ele).css({
			                "display": "block"
			                });
			                
			              //console.log(brick);
			              container.prepend(brick).masonry('reload');
			              //container.prepend(brick);      
			              
						      	var content = brick.find(">div");
						        //console.log(content);
						        var height = brick.find("img").attr("height");
						        if ( height == undefined )
						        {
						          content.css({
						            height: "300px"
						          }); 
						         } else {
						          content.css({
						            height: height
						          }); 
						        }
						        
						        // bricks fade in
						        //brick.delay(Math.floor(Math.random() * 1600)).fadeIn('slow');
						        
						        /*
						        brick.imagesLoaded(function(){
						        	$j(this).find('.brick').delay(Math.floor(Math.random() * 1600)).fadeIn('slow');
						        });        
						        */
						        
						        brick.imagesLoaded().done(function(){
						        	brick.delay(Math.floor(Math.random() * 1600)).fadeIn('slow');
						        	++counter;
						        });
						        
						        //console.log(brick.find("a"));  
						        var touchtime = 0;
										brick.find("a").click(function() {
										    if (touchtime == 0) {
										        // set first click
										        touchtime = new Date().getTime();
										        if (mobile==false) {
										        		var href = $(this).attr("href");
																window.open(href);
										        }								        
										    } else {
										        // compare first click to this click and see if they occurred within double click threshold
										        if (((new Date().getTime()) - touchtime) < 800) {
										            // double click occurred
										            console.log("double clicked");
										            if (mobile==true) {
										            	touchtime = 0;
										            	var href = $(this).attr("href");
																	window.open(href);
																}
										        } else {
										            // not a double click so set as a new first click
										            touchtime = new Date().getTime();
										        }
										    }
										    return false;
										});
										
						        // Bind Mousemove
						        brick.bind('touchstart mousemove', function()
						        {
						        	//console.log("mousemove");
						        	
						          var content = brick.find(">div");
						          var summary = brick.find(".teaser");
						          var height = brick.find("img").attr("height");
						          if ( height == undefined )
						          {
						            height: "300px"
						          }
						          if (!content.is(":animated") && summary.is(":not(:visible)"))
						          {
						            content.css({
						              height: height,
						              position: "relative",
						              top: -35 - summary.height()
						            });
						            summary.show();
						            brick_stack.unshift(this);
						            content.animate({
						              top: 0
						            });
						            while (brick_stack.length > 1)
						            {
						              hide_summary(brick_stack.pop());
						            }
						          }
						        });
						        
						        // Bind mouseleave
						        brick.bind('touchend mouseleave', function()
						        {
						          hide_summary(brick_stack.pop());
						        });
						    }); // getJson	    
	           
	            } else //toggle 
	            {
	              $j.each(json.reverse(), function(idx, ele)
			          {
			          	//var str = ele.Headline; 
			          	//str = str.replace(/(['"])/g, "\\\\$1");
			          	//console.log($j(".brick :contains('"+ele.Headline.replace(/([()])/g, " ")+"')"));
		              //$j('.brick').remove(":contains(\"" + ele.Headline.replace(/([()])/g, " ") + "\")");
		              
		              $j(".brick").filter(function () {
    									//return $j.trim($j(this).text()) == ele.Headline;
    									//console.log($j(this).find("h3")[0]["textContent"]);
    									return $j(this).find("h3")[0]["textContent"] == ele.Headline;
									}).remove();

		            });
		            
		            container.masonry('reload');           
		      	 		
		      	 		/*
		      	 		$j('#container').after('<div id="footer"><a href="https://info.flagcounter.com/4WNR"><img src="https://s01.flagcounter.com/count2/4WNR/bg_FFFFFF/txt_000000/border_CCCCCC/columns_8/maxflags_24/viewers_0/labels_0/pageviews_1/flags_0/percent_0/" alt="Flag Counter" border="0"></a></div>');
								var boxc = $j('#container .brick').length;
								$j('#footer').css({'top' : (((boxc/3)+boxc%3)*(300+10))+7 + 'px','position' : 'absolute', 'margin-left':'170px'});	
	            	*/
	            }
	            
	            container.imagesLoaded()
		            .progress( function( instance, image ) {
		    					var result = image.isLoaded ? 'loaded'	: 'broken';
		    					console.log( 'image is ' + result + ' for ' + image.img.src );
		    				
		  					}).done(function()
		            {
		            	console.log(counter);
		            	
            			if (counter >= boxCount)
            			{            				
		            	 	console.log("loaded");    
		            	 	//container.masonry('reload');		            	 	
				      	 		/*
				      	 		$j('#container').after('<div id="footer"><a href="https://info.flagcounter.com/4WNR"><img src="https://s01.flagcounter.com/count2/4WNR/bg_FFFFFF/txt_000000/border_CCCCCC/columns_8/maxflags_24/viewers_0/labels_0/pageviews_1/flags_0/percent_0/" alt="Flag Counter" border="0"></a></div>');
				      	 		var boxc = $j('#container .brick').length;
										$j('#footer').css({'top' : (((boxc/3)+boxc%3)*(300+10))+7 + 'px','position' : 'absolute', 'margin-left':'170px'});	*/							 		
		            	} 
		            	   
	          		}); // imagesLoaded
	          		
		        } else //getJson
		        {
		          return false; // don't follow the link!
		        } // else
		      });
      		    	  
    	} //else
    });
  }
  
  function reload (self)
  {
    $j(window).unload(function()
    {
      var reloadLink = $j("#tx-charbeitsbeispiele-pi1 #menu li:first").find("a"); 
      var theHref = reloadLink.attr('href').replace(/\?toggle=.*/g, '');
      reloadLink.attr("href", theHref + "&screen=reload");
      $j.get(reloadLink.attr('href'), function(response) {
          // screen unloaded;    
      });
    });
    
    // Start masonry animated
    $j('#tx-charbeitsbeispiele-pi1 #container').masonry({
      itemSelector: '.brick',
      columnWidth: 390,
      isAnimated: !Modernizr.csstransitions,
      animationOptions: {
        duration: 500,
        easing: 'linear',
        queue: false
      }
    });

    // Menu hover script
    var menu = $j("#tx-charbeitsbeispiele-pi1 #menu li");
    menu.hover(
     function() {
       if ($j(this).hasClass('ref_no')) {
         $j(this).removeClass('ref_no').addClass('ref_hover');
       }
     }, function() {
       if ($j(this).hasClass('ref_hover')) {
        if ($j(this).hasClass('ref_act')) {
          $j(this).removeClass('ref_hover');
        } else {
          $j(this).removeClass('ref_hover').addClass('ref_no');
        }
      }
    });

    // Menu toggle script
    menu.toggle(
      function() {
      	if (self.url_stack().length==0) {
      		var n = $j(this).find('a').text();
	        // Klick "Alle"-Button
	        if (n == root_but) {
	        	var container = $j('#tx-charbeitsbeispiele-pi1 #container');
	        	container.empty();
	          $j.each(menu, function(idx, ele)
	          {
	          // Alle anderen buttons off
	          if ($j(ele).find('a').text() != root_but) {
	            $j(ele).removeClass('ref_act').addClass('ref_no');
	            var theHref = $j(ele).find('a').attr("href").replace(/\?toggle=.*/g, '');
	            $j(ele).find('a').attr("href", theHref + "?toggle=off");
	          } else {
	            // Alle buttons on
	            $j(ele).removeClass('ref_no').addClass('ref_act');
	            var theHref = $j(ele).find('a').attr("href").replace(/\?toggle=.*/g, '');
	            $j(ele).find('a').attr("href", theHref + "?toggle=on");
	          }
	        });
      	}
      	
      	var params = "?toggle=on";
    
		    $j.each(menu, function(idx, ele) {
		      if ($j(ele).find('a').text() == n) {
		       params += "&but="+n;
		        $j(ele).removeClass('ref_no').addClass('ref_act');
		        var theHref = $j(ele).find('a').attr("href").replace(/\?toggle=.*/g, '');
		        $j(ele).find('a').attr("href", theHref + params);
		  
		      } else if ($j(ele).find('a').text() == root_but && n != about_but && $j(ele).hasClass('ref_act')) {
		        params += "&screen=clear";
		        $j(ele).removeClass('ref_act').addClass('ref_no');
		        var theHref = $j(ele).find('a').attr("href").replace(/\?toggle=.*/g, '');
		        $j(ele).find('a').attr("href", theHref + "?toggle=off");
		      }
		    });
		   	$j(this).trigger('mouseleave touchend');	
      }
    },
    
    function() {
      var n = $j(this).find('a').text();
      if (n != root_but) {
        var params = "?toggle=off";
        $j.each(menu, function(idx, ele) {
          if ($j(ele).find('a').text() == n) {
            if ($j(ele).hasClass('ref_no')) {
              $j(ele).removeClass('ref_no').addClass('ref_act');
              var theHref = $j(ele).find('a').attr("href").replace(/\?toggle=.*/g, '');
              $j(ele).find('a').attr("href", theHref + "?toggle=on&screen=clear");
            } else {
              $j(ele).removeClass('ref_act').addClass('ref_no');
              var theHref = $j(ele).find('a').attr("href").replace(/\?toggle=.*/g, '');
              $j(ele).find('a').attr("href", theHref + params);
            }
          }
          // Home-Button Active
          if ($j(ele).hasClass('ref_act') && $j(ele).find('a').text() == root_but && n != about_but) {
            // Clear Screen
            params += "&screen=clear";
            $j(ele).removeClass('ref_act').addClass('ref_no');
            var theHref = $j(ele).find('a').attr("href").replace(/\?toggle=.*/g, '');
            $j(ele).find('a').attr("href", theHref + "?toggle=off");
    
          }
        });
      } else if (n == root_but) {
        $j.each(menu, function(idx, ele) {
          if ($j(ele).find('a').text() == root_but) {
            $j(this).removeClass('ref_no').addClass('ref_act');
            var theHref = $j(this).find('a').attr("href").replace(/\?toggle=.*/g, '');
            $j(this).find('a').attr("href", theHref + "?toggle=on");
    
          } else if ($j(ele).find('a').text() != root_but) {
            $j(ele).removeClass('ref_act').addClass('ref_no');
            var theHref = $j(ele).find('a').attr("href").replace(/\?toggle=.*/g, '');
            $j(ele).find('a').attr("href", theHref + "?toggle=off");
          }
        });
      }
      $j(this).trigger('mouseleave touchend');
    });

     // First time, Reload, Tab closed, Browser, Close, Cookie deleted, PHPSESSIONID deleted
     $j.getJSON($j("#tx-charbeitsbeispiele-pi1 #menu li:first").find("a").attr('href'), xcallback);
  	}
	  
	  function xcallback (response,status, xhr)
    {
    	console.log(xhr.getAllResponseHeaders());
    	console.log(xhr.getResponseHeader("Last-Modified"));
    	//console.log(JSON.stringify(response));
      // Start masonry animated
      if (response && response.length)
      {
        var container = $j('#tx-charbeitsbeispiele-pi1 #container');
        container.masonry({
          itemSelector: '.brick',
          columnWidth: 390,
          isAnimated: !Modernizr.csstransitions
        });
        boxCount = response.length;
        counter = 0;
        var d = 0;
        $j.each(response.reverse(), function(idx, ele)
        {
        	var upd = $j("#tx-charbeitsbeispiele-pi1 #date");
        	
        	//ele.Headline = ele.Headline.replace(/([()])/g, " ");
        	
        	if (d<new Date(ele.date)) {
        			d = new Date(ele.date);
		        	console.log(d);
		        	upd.text("Last update: "+ele.date);
        	}
        	 
          if (ele.Isimage == "true")
          {
          	var brick = $j("#brickTemplate").tmpl(ele);
          } else {
          	var brick = $j("#defaultTemplate").tmpl(ele);
          }
        
        	//console.log(brick);
	        container.prepend(brick).masonry('reload');    
	        //container.prepend(brick);  
	        
	      	var content = brick.find(">div");
	        //console.log(content);
	        var height = brick.find("img").attr("height");
	        if ( height == undefined )
	        {
	          content.css({
	            height: "300px"
	          }); 
	         } else {
	          content.css({
	            height: height
	          }); 
	        }
	        
	        // bricks fade in
	        //brick.delay(Math.floor(Math.random() * 1600)).fadeIn('slow');
	        
	        /*
	        brick.imagesLoaded(function(){
	        	$j(this).find('.brick').delay(Math.floor(Math.random() * 1600)).fadeIn('slow');
	        });        
	        */
	        
	        brick.imagesLoaded().done(function(){
	        	brick.delay(Math.floor(Math.random() * 1600)).fadeIn('slow');
	        });
	        
	        //console.log(brick.find("a"));  
	        var touchtime = 0;
					brick.find("a").click(function() {
					    if (touchtime == 0) {
					        // set first click
					        touchtime = new Date().getTime();
					        if (mobile==false) {
					        		var href = $(this).attr("href");
											window.open(href);
					        }								        
					    } else {
					        // compare first click to this click and see if they occurred within double click threshold
					        if (((new Date().getTime()) - touchtime) < 800) {
					            // double click occurred
					            console.log("double clicked");
					            if (mobile==true) {
					            	touchtime = 0;
					            	var href = $(this).attr("href");
												window.open(href);
											}
					        } else {
					            // not a double click so set as a new first click
					            touchtime = new Date().getTime();
					        }
					    }
					    return false;
					});
					
	        // Bind Mousemove
	        brick.bind('touchstart mousemove', function()
	        {
	        	//console.log("mousemove");
	        	
	          var content = brick.find(">div");
	          var summary = brick.find(".teaser");
	          var height = brick.find("img").attr("height");
	          if ( height == undefined )
	          {
	            height: "300px"
	          }
	          if (!content.is(":animated") && summary.is(":not(:visible)"))
	          {
	            content.css({
	              height: height,
	              position: "relative",
	              top: -35 - summary.height()
	            });
	            summary.show();
	            brick_stack.unshift(this);
	            content.animate({
	              top: 0
	            });
	            while (brick_stack.length > 1)
	            {
	              hide_summary(brick_stack.pop());
	            }
	          }
	        });
	        
	        // Bind mouseleave
	        brick.bind('touchend mouseleave', function()
	        {
	          hide_summary(brick_stack.pop());
	        });
        
          container.imagesLoaded()
          .progress(function( instance, image ) {
    					var result = image.isLoaded ? 'loaded' : 'broken';
    					console.log( 'image is ' + result + ' for ' + image.img.src );
  					})
          .done(function()
          {          			
          	console.log(counter);
            ++counter;
            
            if (counter >= boxCount)
            {                        	
              // Menu slidedown
              $j('#tx-charbeitsbeispiele-pi1 #menu').slideDown('slow');
              //container.masonry('reload');
               
            } // if
          }); // ImagesLoadead
        }); // each
          
        var reloadLink = $j("#tx-charbeitsbeispiele-pi1 #menu li:first");
        reloadLink.removeClass('ref_no').addClass('ref_act');
        var theHref = reloadLink.find('a').attr("href").replace(/\?toggle=.*/g, '');
        reloadLink.find('a').attr("href", theHref + "?toggle=off");  
      }
   }
    
  function bbut () {  	
  	var toggle = $("#tx-charbeitsbeispiele-pi1 #menu li")[1];
		//toggle.attr("unchecked", !toggle.attr("unchecked")).button("refresh");
		$(toggle).removeClass('ref_act').addClass('ref_no');
		var theHref = $(toggle).find('a').attr("href").replace(/\?toggle=.*/g, '');		
		$(toggle).find('a').attr("href", theHref + "?toggle=off");
  	maxmedia.gridview();
  }
  
  // Privat function
  function hide_summary(ele)
  {
    var content = $j(ele).find(">div");
    var summary = $j(ele).find(".teaser");
    content.animate({
      top: -35 - summary.height()
    }, function() {
      content.css({
        position: "static"
      });
      summary.hide();
    });
  }
  
  // Public functions
  Arbeitsbeispiele.prototype.singleview = function ( url, id )
  {
    return singleview ( url, id );
  }
  
  Arbeitsbeispiele.prototype.gridview = function ()
  {
    return gridview ( );
  }
  
  Arbeitsbeispiele.prototype.ajax = function (self)
  {
    return ajax(self);
  }
  
  Arbeitsbeispiele.prototype.reload = function (self)
  {
    return reload(self);
  }

  Arbeitsbeispiele.prototype.bbut = function ()
  {
    return bbut();
  }

  Arbeitsbeispiele.prototype.url_stack = function ()
  {
    return url_stack;
  }
    
  function Arbeitsbeispiele (anonymous)
  {
  	if (/Mobi|Android/i.test(navigator.userAgent)) {
    	// mobile!
    	mobile = true;
		}
    $j = anonymous;
    return true;
  }
  window.Arbeitsbeispiele = Arbeitsbeispiele;
})();

/*
$("#spinner").bind("ajaxSend", function() { $(this).show(); })
$("#spinner").bind("ajaxStop", function() { $(this).hide(); })
$("#spinner").bind("ajaxError", function() { $(this).hide(); });
*/


var maxmedia;
var $ = jQuery.noConflict();
$(document).ready(function() {
  $("#container").draggable({zIndex:-35});
  maxmedia = new Arbeitsbeispiele($);
  maxmedia.reload(maxmedia);
  maxmedia.ajax(maxmedia);
  
  const nav = document.querySelector('#navigation');
	const navTop = nav.offsetTop;

   /*
	function stickyNavigation() {
  	console.log('navTop = ' + navTop);
  	console.log('scrollY = ' + window.scrollY);
	}
		
	window.addEventListener('scroll', stickyNavigation);	
	*/	

	$('.lazy').Lazy({
        // your configuration goes here
        scrollDirection: 'vertical',
        effect: 'fadeIn',
        visibleOnly: true,
        onError: function(element) {
            console.log('error loading ' + element.data('src'));
        }
   });

});