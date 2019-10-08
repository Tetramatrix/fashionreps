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
  var root_btn = "Home";
  var about_btn = "About Us";
  var haul_btn = "My haul";
  var mobile = false;
  var appuid = "TLF!";
  var colw = 310;
  var imgh = 300;
  var loadmenu = 4;
  var scrw = 0;
  var brickw = 300;
  var svw = 550;
  var svh = 20;
  var svh_mobi = 40;
  var navw = 170;
  var navw_mobi = 20;
  var dbl_click = 900;
  var dbstart = 900;
  var dbend = 2900;
  var long_press = 3500;
  let xsDown, ysDown, xsUp, ysUp;
  
  function getTouch (e) {
		if (e!==undefined && e.changedTouches!==undefined) {
			return e.changedTouches[0];	
		} else if (e!==undefined) {
				return e;
		}
	  return false;
	}

  function getAllLocalStorage() {
		return Object.keys(localStorage)
		    .reduce((obj, k) => {
		        return { ...obj, [k]: localStorage.getItem(k)}}, {});
	}
        
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
      	"opacity": "0.0",
        "position": "absolute",
        "top": "-600px",
        "height": "600px",
      })
      $j.getJSON(url, function(json)
      {    
        if (json)
        {
          s.empty().append($j("#singleviewTemplate").tmpl(json).css({
            "visibility": "visible",
            "position": "relative"
          })).animate({
            "opacity": "1.0",
            "top": "0px",
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
          //s.empty();
          c.css({
            "opacity": "0.0"
          }).animate({
              "opacity": "1.0",
              "top": "0px"
          }, 900, function()
            {
              url_stack = [];
              // Unset it here, this lets the button be clickable again
              btn.data('running', false);
        });
      });
    }
    
    /*
    if (c.outerHeight()>0) {
    	  c.after('<div id="footer"><a href="https://info.flagcounter.com/4WNR"><img src="https://s01.flagcounter.com/count2/4WNR/bg_FFFFFF/txt_000000/border_CCCCCC/columns_8/maxflags_24/viewers_0/labels_0/pageviews_1/flags_0/percent_0/" alt="Flag Counter" border="0"></a></div>');
    		$j('#footer').css({'top' : c.outerHeight()+7 + 'px','position' : 'absolute', 'margin-left':'170px'});
    }
    */
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
    /*
    c.css({
      "z-index" : "-35",
      "position": "absolute",
      "left" : "0px",
      "top" : "0px"
    }).
    */
    
    c.animate({
      "opacity": "0.0",
      "top": "+=600px",
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
            "left" : navw,
            "width" : svw
          }).animate({
            "opacity": "1.0",
            "top": svh,
            "left" : navw
          }, 900, function() {
            // Unset it here, this lets the button be clickable again
            btn.data('running', false);
          }).append($j("#singleviewTemplate").tmpl(json).css({
            "visibility": "visible",
            "position": "relative"
          })
          ).find("a").click(function(e) {
          		e.stopPropagation();
          		bbtn();
          	});
        	}        
      });            
    });
  }
  
  function addBricks(data, tmpl) {
  	
  		var container = $j('#tx-charbeitsbeispiele-pi1 #container');
		  var upd = $j("#tx-charbeitsbeispiele-pi1 #date");
		  
		   
		   boxCount = data.length;
       counter = 0;
       var d = 0;
        
  	  $j.each(data.reverse(), function(idx, ele)
	    { 	
        	//ele.Headline = ele.Headline.replace(/([()])/g, " ");
        	
        	if (d<new Date(ele.date)) {
        			d = new Date(ele.date);
		        	console.log(d);
		        	upd.text("Last update: "+ele.date);
        	}
        	
	    	  //ele.Headline = ele.Headline.replace(/([()])/g, " ");
	    	  
	        if (ele.Additem == "Append" && ele.Isimage == "true" )
	        {	        	
	          var templ = tmpl === void 0 ? "#addBrickTemplate" : templ;
	          
	        } else if (ele.Additem == "Append")
	        {
	        	var templ = "#defaultTemplate";
	          
	        } else if (ele.Additem == "Prepend" && ele.Isimage == "true" )
	        {
	        	var templ = tmpl === void 0 ? "#addBrickTemplate" : tmpl;
	           
	        } else
	        {
	        	var templ = "#defaultTemplate";		                
	        }
	        
	        var brick = $j(templ).tmpl(ele).css({
	          "display": "block"
	        });
	        
	         cube = brick.find(".cube");
	         
	        if (mobile && ele.morepics.length>1) {
	       		//for (const i of ele.morepics) {
	        	//	img.append('<img data-src="https://'+i+'" />');
	        	//}	
						
	        	 cube.append("<div class=\"right\"><img data-src=\"https://"+ele.morepics[0]+"\" width=\""+(brickw+scrw)+"px\" height=\""+(brickw+scrw)+"px\" />");	        	 	        	 
	        	 cube.append("<div class=\"back\"><img data-src=\"https://"+ele.morepics[1]+"\" width=\""+(brickw+scrw)+"px\" height=\""+(brickw+scrw)+"px\" />");
	        	 if (ele.morepics[2]!==undefined) {
	        	 		cube.append("<div class=\"left\"><img data-src=\"https://"+ele.morepics[2]+"\" width=\""+(brickw+scrw)+"px\" height=\""+(brickw+scrw)+"px\" />");
	        	 } else {
	        	 		cube.append("<div class=\"left\"><img data-src=\"https://"+ele.morepics[0]+"\" width=\""+(brickw+scrw)+"px\" height=\""+(brickw+scrw)+"px\" />");
	        	 }
	        	 	        	 
	        	 var t =(brickw+scrw)/2+"px";
							
							cube.css({
								  height: brickw+scrw,
			            width: brickw+scrw,
			            "transform-origin": t+ ' ' + t+' 0px',
							});
							
							cube.find(".front").css({
								"transform": "transform: translateZ("+t+")",
							});
							
							cube.find(".back").css({
								transform: "rotateY(180deg) translateZ("+t+")",
							});
							
							cube.find(".right").css({
								transform: "rotateY(90deg) translateZ("+t+")",
							});
							
							cube.find(".left").css({
								 transform: "rotateY(-90deg) translateZ("+t+")",   
							});
	       	}
	       	
	        var img = brick.find("img");
	        var content = brick.find(">div");
	        
	         
	        img.lazy({
							scrollDirection: 'vertical',
				      effect: 'fadeIn',
				      visibleOnly: true,
				      threshold: 40,
				      skip_invisible : false,
				      autoDestroy: true,
              chainable: false,
				      onError: function(element) {
				          console.log('error loading ' + element.data('src'));
				      },
				       beforeLoad: function(element) {
				  			// called before an elements gets handled
				  			console.log("lazy before");
						  },afterLoad: function(element) {
		            // called after an element was successfully handled
		            console.log("lazy after");
		         		//element.delay(Math.floor(Math.random() * 4200)).fadeIn('slow');
		         		element.css({"opacity": "0.0"}).animate({"opacity": "1.0"},900);		         		
		         		++counter;
	        
		         		if (counter > loadmenu) {
		         			// Menu slidedown
		            	$j('#tx-charbeitsbeispiele-pi1 #menu').slideDown('slow');  	
		         		}
		         },onFinishedAll: function() {
				    		// called once all elements was handled
				    		console.log("lazy loaded");		  		
							}
				   });				  
	        	        
	        //console.log(brick);
	        container.prepend(brick);
	        //container.prepend(brick);   
	        
	        if (!mobile) 
	        {
	        	  var height = img.attr("height");
 							var tmp = (height == undefined) ? content.css({height: imgh+scrw+"px"}) : content.css({height: height}); 
			        
	        } else {
	        	
	        	  brick.width(brick.width()+scrw);
	        	  brick.height(brick.height()+scrw);
	        	  
		         	content.each(function() {
	    						$(this).width($(this).width()+scrw);
	    						$(this).height($(this).height()+scrw);
							});
							
							brick.find("div .teaser").each(function() {
	    						$(this).width($(this).width()+scrw);
							});
														
							brick.find("h3").each(function() {
	    						$(this).width($(this).width()+scrw);
							});							
							
							brick.find("hr").each(function() {
	    						$(this).width($(this).width()+scrw);
							});
														
						 	brick.find("p").each(function() {
						 		  $(this).width($(this).width()+scrw);
							});
							
							img.css({
			            height: brickw+scrw,
			            width: brickw+scrw
			        }); 
							img.height(brickw+scrw).width(brickw+scrw);							
		      }
	           
	        container.masonry("reload");
	        var touchtime = 0;

	         // Bind link (a href)
	        brick.find("a").click({param1: ele}, function(e) {
	        	  e.stopPropagation();
							//this == the link that was clicked
							//var href = $(this).attr("href");
							//console.log(href);
														
							if (this.innerText == "+") {
								e.data.param1.Headline+=" ";
								localStorage.setItem(appuid+e.data.param1.uid, JSON.stringify(e.data.param1));
							} else if (this.innerText == "-") {
								localStorage.removeItem(appuid+e.data.param1.uid);
								
							 	$j(".brick").filter(function () {
									//return $j.trim($j(this).text()) == ele.Headline;
									//console.log($j(this).find("h3")[0]["textContent"]);
									return $j(this).find("h3")[0]["textContent"] == e.data.param1.Headline;
								}).remove()
								 container.masonry('reload');  
							}							
					});
					
						       
	        brick.bind({
	        	
	        	// Bind touchstart	   
	        	'touchstart' : function (e) {
	        		
	        		  if (e.originalEvent.changedTouches!==undefined) {

									xsDown = e.originalEvent.changedTouches[0].clientX;
									ysDown = e.originalEvent.changedTouches[0].clientY;  

								} else {

									xsDown = e.clientX;
									ysDown = e.clientY;
								}
							 	 
	        	},
	        	
	        		// Bind mouseup
	        	/*
	        	'touchend' : function (e) {
	        		
					         if (e.originalEvent.changedTouches!==undefined) {
										
											xsUp = e.originalEvent.changedTouches[0].clientX;
		  								ysUp = e.originalEvent.changedTouches[0].clientY;  
		  							
								 	 } else {
								 	 		xsUp = e.clientX;
								 	 		ysUp = e.clientY;
								 	 }
									  
								  const xsDiffAbs = Math.abs(xsDown - xsUp);
								  const ysDiffAbs = Math.abs(ysDown - ysUp);
								  
								    // at least <offset> are a swipe
			  					if (xsDiffAbs > 100 ) {
			  						
			  						 e.stopPropagation();
			  						
			  						console.log("swipe")			  						

										mycube=brick.find("div .cube");
										if (mycube.hasClass("rot360")) {
											mycube.removeClass("rot90 rot180 rot270 rot360");
										}
										if (!mycube.hasClass("rot90")) {
											mycube.addClass("rot90");
			  						} else if (!mycube.hasClass("rot180")) {
			  							mycube.addClass("rot180");
			  						} else if (!mycube.hasClass("rot270")) {
			  							mycube.addClass("rot270");
			  						} else if (!mycube.hasClass("rot360")) {
			  							mycube.addClass("rot360");
			  						}			  						
			  					}
	        	},
	        	*/
	        	// Bind Mouseclick
	        	'click' : function(e) {
	        	  e.stopPropagation();
					    if (touchtime == 0) {
					        
					        // set first click
					        touchtime = new Date().getTime();
					        
					        if (mobile==false) {
					        		touchtime = 0;
					        		//var href = $(this).attr("href");
											window.open(ele.Link);
											
					        }	else if ($j("#nav_mobi_bar").hasClass('nav_toggle')) {

												 $j("#nav_mobi_bar").removeClass("nav_toggle");
												
												 $j("#nav").animate({
										      "opacity": "1.0",
										      "left" : -(navw+navw_mobi)
										     }, 300);
								    		
								    		 $j("#container").animate({
										      "opacity": "1.0",
										      "left" : "0px"
										    }, 300);
									}
					    } else {
					        // compare first click to this click and see if they occurred within double click threshold
					        if (((new Date().getTime()) - touchtime) < dbl_click) {
					            // double click occurred
					            console.log("double clicked");
					            if (mobile==true) {
					            	touchtime = 0;
					            	//var href = $(this).attr("href");
												window.open(ele.Link);
											}
					        } else {
					            // not a double click so set as a new first click
					            touchtime = new Date().getTime();
					        }
					    }
					    return false;
						},
	        	
	        	 // Bind Mousemove
	        	'mousemove': function(e)
	        	{
	        			//console.log("mousemove");
	        	
			          var summary = brick.find(".teaser");
			          var height = img.attr("height");
			          if (height == undefined)
			          {
			            height: imgh+scrw+"px"
			          }
			          
			          content.css('cursor', 'pointer');
			          
			          var scrollPos = container.scrollTop();
			          
			          $(this).delay(dbstart).queue( (next) => {
				          if ((!content.is(":animated") && summary.is(":not(:visible)") && !mobile) || 
				          		(!content.is(":animated") && summary.is(":not(:visible)") && mobile && scrollPos == container.scrollTop())
				          )
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
				            		
				            /*				            
				           	$(this).delay(dbend).queue( (next) => {
					            while (brick_stack.length > 1)
					            {
					             /hide_summary(brick_stack.pop());
					            }
					            next();
					          });
					          */
			          	}
	          		 next();
					      });
	          },
	          
	          // Bind mouseleave
	          'touchend mouseleave': function(e)
		        {
	        	 		if (e.originalEvent.changedTouches!==undefined) {
									
										xsUp = e.originalEvent.changedTouches[0].clientX;
	  								ysUp = e.originalEvent.changedTouches[0].clientY;  
	  							
							 	} else {
							 		
							 	 		xsUp = e.clientX;
							 	 		ysUp = e.clientY;
							 	}
								  
							  const xsDiffAbs = Math.abs(xsDown - xsUp);
							  const ysDiffAbs = Math.abs(ysDown - ysUp);
							  
							    // at least <offset> are a swipe
		  					if (mobile && xsDiffAbs > 75 && ele.morepics.length>1) {
		  						
			  						// e.stopPropagation();
			  						
			  						console.log("swipe")			  						

										mycube=brick.find("div .cube");
										if (mycube.hasClass("rot360")) {
											mycube.removeClass("rot90 rot180 rot270 rot360");
										}
										if (!mycube.hasClass("rot90")) {
											mycube.addClass("rot90");
			  						} else if (!mycube.hasClass("rot180")) {
			  							mycube.addClass("rot180");
			  						} else if (!mycube.hasClass("rot270")) {
			  							mycube.addClass("rot270");
			  						} else if (!mycube.hasClass("rot360")) {
			  							mycube.addClass("rot360");
			  						}			  						
			  						
			  				} else  if ((new Date().getTime() - touchtime) < long_press && mobile==true) {
					          
					          // long press
					          console.log("long press");
			  					
			  						hide_summary(brick_stack.pop());
			  						
				  					var summary = brick.find(".teaser");
					          var height = img.attr("height");
					          if (height == undefined)
					          {
					            height: imgh+scrw+"px"
					          }
					          
					          content.css('cursor', 'pointer');
					          
					          var scrollPos = container.scrollTop();
					          
					          //$(this).delay(dbstart).queue( (next) => {
						          if ((!content.is(":animated") && summary.is(":not(:visible)") && !mobile) || 
						          		(!content.is(":animated") && summary.is(":not(:visible)") && mobile && scrollPos == container.scrollTop())
						          )
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
						            		
						            /*				            
						           	$(this).delay(dbend).queue( (next) => {
							            while (brick_stack.length > 1)
							            {
							             /hide_summary(brick_stack.pop());
							            }
							            next();
							          });
							          */
					          	}
			          		 //next();
							      //});
			  				}
			  					
		        		$(this).delay(dbstart).queue((next) => {
		        			if ((mobile && brick_stack.length > 1) || !mobile) {
		        				hide_summary(brick_stack.pop());
		        			}
		          		next();
		          });
		        }
	        });
	        
	    }); // each
	    
	    container.trigger("scroll");
  }
  
  function ajax (self) {
  	
    // Menu ajax script
    $j("#tx-charbeitsbeispiele-pi1 #menu li").click(function()
    {
    	
    	Pace.restart(); 
    		
    	var n = $j(this).find('a').text();
    	console.log(n);
    		// about button    	
    	if (n == about_btn || self.url_stack().length>0) {
    		
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
				 	
						bbtn (); 	
				 }
    		return false;
    		
    	} else if (n == haul_btn) {
    		 
    		 var json=getAllLocalStorage();    		 
    		 //console.log(json);
    		 
    		 arr=[];
    		 Object.keys(json).forEach((key)=> {
 						//console.log(key +' -> '+ json[key]);
 						if (key.startsWith(appuid)) {
 							arr.push(JSON.parse(json[key]));
 						} 						
					});
					//console.log(arr);
    		 
    		  $j('#footer').remove();
		        	 
		      var container = $j('#tx-charbeitsbeispiele-pi1 #container');
		      container.masonry();
		      var toggle = this.innerHTML.match(/toggle=on/g);
		      var clrscreen = this.innerHTML.match(/screen=clear/g);
		      boxCount = json.length;
					counter = 0;
					
					if (clrscreen) {
		          container.empty();
          }

          if (toggle)
          {
          	
          	// this changes the scrolling behavior to "smooth"
						window.scrollTo({ top: 0, behavior: 'smooth' });
						          
	          addBricks(arr, "#minusBrickTemplate");	    
         
          } else //toggle 
          {
            $j.each(arr.reverse(), function(idx, ele)
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
								          
			          addBricks(json);	    
	           
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
      columnWidth : brickw+scrw+10,
      isAnimated: !Modernizr.csstransitions,
      animationOptions: {
        duration: 500,
        easing: 'linear',
        queue: false
      }
    });

		 // Mobi menu toggle script
		$j("#nav_mobi_bar").click(function() {
    		
     	if ($j(this).hasClass('nav_toggle')) {
				
				 $j(this).removeClass("nav_toggle");
				
				 $j("#nav").animate({
		      "opacity": "1.0",
		      "left" : -(navw+navw_mobi)
		     }, 300);
    		
    		 $j("#container").animate({
		      "opacity": "1.0",
		      "left" : "0px"
		    }, 300);
				    		 
     } else {
     	
     		$j(this).addClass("nav_toggle");
     		
     		$j("#nav").animate({
		      "opacity": "1.0",
		      "left" : 0
		     }, 300);
    		
    		 $j("#container").animate({
		      "opacity": "1.0",
		      "left" : navw
		    }, 300);
		    
		    // Menu slidedown
		    $j('#tx-charbeitsbeispiele-pi1 #menu').slideDown('slow'); 		    
		    
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
	        if (n == root_btn) {
	        	var container = $j('#tx-charbeitsbeispiele-pi1 #container');
	        	container.empty();
	          $j.each(menu, function(idx, ele)
	          {
	          // Alle anderen buttons off
	          if ($j(ele).find('a').text() != root_btn) {
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
		  
		      } else if ($j(ele).find('a').text() == root_btn && n != about_btn && $j(ele).hasClass('ref_act')) {
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
      if (n != root_btn) {
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
          if ($j(ele).hasClass('ref_act') && $j(ele).find('a').text() == root_btn && n != haul_btn && n != about_btn) {
            // Clear Screen
            params += "&screen=clear";
            $j(ele).removeClass('ref_act').addClass('ref_no');
            var theHref = $j(ele).find('a').attr("href").replace(/\?toggle=.*/g, '');
            $j(ele).find('a').attr("href", theHref + "?toggle=off");
    
          }
        });
      } else if (n == root_btn) {
        $j.each(menu, function(idx, ele) {
          if ($j(ele).find('a').text() == root_btn) {
            $j(this).removeClass('ref_no').addClass('ref_act');
            var theHref = $j(this).find('a').attr("href").replace(/\?toggle=.*/g, '');
            $j(this).find('a').attr("href", theHref + "?toggle=on");
    
          } else if ($j(ele).find('a').text() != root_btn) {
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
    	// this changes the scrolling behavior to "smooth"
			window.scrollTo({ top: 0, behavior: 'smooth' });
							
      var container = $j('#tx-charbeitsbeispiele-pi1 #container');
      
      container.masonry({
        itemSelector: '.brick',
        columnWidth: brickw+scrw+10,
        isAnimated: !Modernizr.csstransitions,
         animationOptions: {
	        duration: 500,
	        easing: 'linear',
	        queue: false
	      }
      });
     
      boxCount = response.length;
     	counter = 0;
     	var d = 0;
            
			addBricks(response);        
      
      var reloadLink = $j("#tx-charbeitsbeispiele-pi1 #menu li:first");
      reloadLink.removeClass('ref_no').addClass('ref_act');
      var theHref = reloadLink.find('a').attr("href").replace(/\?toggle=.*/g, '');
      reloadLink.find('a').attr("href", theHref + "?toggle=off");  
    }
  }
    
  function bbtn () {  	
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

  Arbeitsbeispiele.prototype.bbtn = function ()
  {
    return bbtn();
  }

  Arbeitsbeispiele.prototype.url_stack = function ()
  {
    return url_stack;
  }
    
  function Arbeitsbeispiele (anonymous)
  {
  	$j = anonymous;
  	if (/Mobi|Android/i.test(navigator.userAgent)) {
    	// mobile!
    	mobile = true;
		}
		
		if (mobile==true) {
			
			$j("#nav").addClass('mobi_nav');
			$j("#nav").css({"zIndex": 100, "margin-top":"42px"});
			$j("#nav_mobi_bar").removeClass('nav_hid');
			$j("#container").addClass('mobi_container');
			$j("#container").css({"margin-top":"42px"});
			$j("#ads-right").remove();
			$j("#tx-charbeitsbeispiele-pi1").addClass("mobi_plugin"); 
			$j("#nav_logo").addClass("nav_hid"); 
			$j("#footer").css({"margin-left":"0px"});
			$j("#container").removeClass("ui-draggable");
  	
      scrw = $(window).width()-brickw;
  		svw = $(window).width()-(navw+navw_mobi);
     	svh+=svh_mobi;
		} else {
			scrw = 0;
			dbstart=0;
			dbend=0;
		}
    
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
	
  //$("#container").draggable({zIndex:-35});
  
  maxmedia = new Arbeitsbeispiele($);
  maxmedia.reload(maxmedia);
  maxmedia.ajax(maxmedia);
          
  $("#footer").find("img").lazy({
			scrollDirection: 'vertical',
      effect: 'fadeIn',
      visibleOnly: true,
      threshold: 40,
      skip_invisible : false,
      autoDestroy: true,
      chainable: false,
      onError: function(element) {
          console.log('error loading ' + element.data('src'));
      },
       beforeLoad: function(element) {
  			// called before an elements gets handled
  			console.log("lazy before");
		  },afterLoad: function(element) {
        // called after an element was successfully handled
        console.log("lazy after");
     		//element.delay(Math.floor(Math.random() * 4200)).fadeIn('slow');
     		element.css({"opacity": "0.0"}).animate({"opacity": "1.0"},900);		         		
      },onFinishedAll: function() {
    		// called once all elements was handled
    		console.log("lazy loaded");		  		
			}
  });
  
  paceOptions = {
	  elements: {
	    trackMethods: ['GET', 'POST', 'PUT', 'DELETE', 'REMOVE'],
	     restartOnRequestAfter: 5,
	  }
	}

   /*
    const nav = document.querySelector('#nav');
	  const navTop = nav.offsetTop;
	
	 function stickyNavigation() {
  	console.log('navTop = ' + navTop);
  	console.log('scrollY = ' + window.scrollY);
	 }
		
	 window.addEventListener('scroll', stickyNavigation);	
	*/	
});