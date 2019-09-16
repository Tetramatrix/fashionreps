/***************************************************************
 *  Copyright notice
 *
 *  (c) 2011-2019 Chi Hoang <info@chihoang.de>
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
  var root_button = "Home"
    
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
        "left" : "140px"
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
            "left": "140px"
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
              "left" : "140px",
              "top": "10px"
          }, 900, function()
            {
              url_stack = [];
              // Unset it here, this lets the button be clickable again
              btn.data('running', false);
        });
      });
    }
  }
  
  function singleview (url)
  {
    var btn = $(this);
    if (btn.data('running'))
      return;
    
    var c = $('#container');
    var s = $j('#tx-charbeitsbeispiele-pi1 #singleview');
    
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
    }
    c.css({
      "z-index" : "-35",
      "position": "absolute",
      "left" : "140px",
      "top" : "0px"
    }).animate({
      "position": "relative",
      "opacity": "0.0",
      "top": "+=600px",
      "left" : "140px"
    }, 900, function()
      {
      // Animation complete.
      $j.getJSON(url, function(json)
      {
        if (json)
        {
          s.css({
            "position": "absolute",
            "top": "-600px",
            "height": "600px",
            "left" : "140px"
          }).animate({
            "opacity": "100.0",
            "top": "10px",
            "left" : "140px"
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
  
  function ajax () {
    // Menu ajax script
    $j("#tx-charbeitsbeispiele-pi1 #menu li").click(function()
    {
      $j.getJSON($j(this).find('a').attr('href'), function(json)
      {
        if (json && json.length)
        {
          var container = $j('#tx-charbeitsbeispiele-pi1 #container');
          container.masonry();
          var toggle = this.url.match(/toggle=on/g);
          var clrscreen = this.url.match(/screen=clear/g);
          
          if (clrscreen) {
          	container.empty();
          }
          
          $j.each(json.reverse(), function(idx, ele)
          {
            //if (ele.toggle == "on")
            if (toggle)
            {
              if (ele.Additem == "Append" && ele.Isimage == "true" )
              {
                container.append($j("#brickTemplate").tmpl(ele).css({
                "display": "block"
                })).masonry('reload');  
              } else if (ele.Additem == "Append")
              {
                container.append($j("#defaultTemplate").tmpl(ele).css({
                "display": "block"
                })).masonry('reload');
              } else if (ele.Additem == "Prepend" && ele.Isimage == "true" )
              {
                container.prepend($j("#brickTemplate").tmpl(ele).css({
                  "display": "block"
                })).masonry('reload');  
              } else
              {
                container.prepend($j("#defaultTemplate").tmpl(ele).css({
                  "display": "block"
                })).masonry('reload');
              }
            } else
            {
              $j('.brick').remove(":contains('" + ele.Headline + "')");
              container.masonry('reload');
            }
            container.imagesLoaded(function()
            {
              // bricks correct height
              $j("#tx-charbeitsbeispiele-pi1 #container .brick").each(function()
              {
                var height = $j(this).find("img").attr("height");
                if ( height == undefined )
                {
                  $j(this).find(">div").css({
                    height: "300px"
                  }); 
                } else {
                  $j(this).find(">div").css({
                    height: height
                  }); 
                }
                $j(this).mousemove(function()
                {
                  var content = $j(this).find(">div");
                  var summary = $j(this).find(".teaser");
                  var height = $j(this).find("img").attr("height");
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
                $j(this).mouseleave(function() {
                  hide_summary(brick_stack.pop());
                });
              });
            });
          });
        } else
        {
          return false; // don't follow the link!
        }
      });
      return false; // don't follow the link!
    });
  }
  
  function reload ()
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
        var n = $j(this).find('a').text();
        // Klick "Alle"-Button
        if (n == root_button) {
        	var container = $j('#tx-charbeitsbeispiele-pi1 #container');
        	container.empty();
          $j.each(menu, function(idx, ele)
          {
          // Alle anderen buttons off
          if ($j(ele).find('a').text() != root_button) {
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
    
        } else if ($j(ele).find('a').text() == root_button && $j(ele).hasClass('ref_act')) {
          params += "&screen=clear";
          $j(ele).removeClass('ref_act').addClass('ref_no');
          var theHref = $j(ele).find('a').attr("href").replace(/\?toggle=.*/g, '');
          $j(ele).find('a').attr("href", theHref + "?toggle=off");
        }
      });
      $j(this).trigger('mouseleave');
    },
    
    function() {
      var n = $j(this).find('a').text();
      if (n != root_button) {
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
          // Alle-Button Active
          if ($j(ele).hasClass('ref_act') && $j(ele).find('a').text() == root_button) {
            // Clear Screen
            params += "&screen=clear";
            $j(ele).removeClass('ref_act').addClass('ref_no');
            var theHref = $j(ele).find('a').attr("href").replace(/\?toggle=.*/g, '');
            $j(ele).find('a').attr("href", theHref + "?toggle=off");
    
          }
        });
      } else if (n == root_button) {
        $j.each(menu, function(idx, ele) {
          if ($j(ele).find('a').text() == root_button) {
            $j(this).removeClass('ref_no').addClass('ref_act');
            var theHref = $j(this).find('a').attr("href").replace(/\?toggle=.*/g, '');
            $j(this).find('a').attr("href", theHref + "?toggle=on");
    
          } else if ($j(ele).find('a').text() != root_button) {
            $j(ele).removeClass('ref_act').addClass('ref_no');
            var theHref = $j(ele).find('a').attr("href").replace(/\?toggle=.*/g, '');
            $j(ele).find('a').attr("href", theHref + "?toggle=off");
          }
        });
      }
      $j(this).trigger('mouseleave');
    });

    // First time, Reload, Tab closed, Browser, Close, Cookie deleted, PHPSESSIONID deleted
    $j.getJSON($j("#tx-charbeitsbeispiele-pi1 #menu li:first").find("a").attr('href'), function(response)
    {
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
        $j.each(response.reverse(), function(idx, ele)
        {
          if (ele.Isimage == "true")
          {
            container.prepend($j("#brickTemplate").tmpl(ele)).masonry('reload');  
          } else {
            container.prepend($j("#defaultTemplate").tmpl(ele)).masonry('reload');
          }
          container.imagesLoaded(function()
          {
            ++counter;
            if (counter >= boxCount)
            {
              // Menu slidedown
              $j('#tx-charbeitsbeispiele-pi1 #menu').slideDown('slow');
              // bricks correct height  
              $j("#tx-charbeitsbeispiele-pi1 #container .brick").each(function()
              {
                var content = $j(this).find(">div");
                var height = $j(this).find("img").attr("height");
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
                $j(this).delay(Math.floor(Math.random() * 1600)).fadeIn('slow');
                // Bind Mousemove
                $j(this).mousemove(function()
                {
                  var content = $j(this).find(">div");
                  var summary = $j(this).find(".teaser");
                  var height = $j(this).find("img").attr("height");
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
                $j(this).mouseleave(function()
                {
                  hide_summary(brick_stack.pop());
                });
              });
            }
          }); // ImagesLoadead
        }); // each
        var reloadLink = $j("#tx-charbeitsbeispiele-pi1 #menu li:first");
        reloadLink.removeClass('ref_no').addClass('ref_act');
        var theHref = reloadLink.find('a').attr("href").replace(/\?toggle=.*/g, '');
        reloadLink.find('a').attr("href", theHref + "?toggle=off");  
      }
    });
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
  
  Arbeitsbeispiele.prototype.ajax = function ()
  {
    return ajax();
  }
  
  Arbeitsbeispiele.prototype.reload = function ()
  {
    return reload();
  }

  function Arbeitsbeispiele (anonymous)
  {
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
  maxmedia.reload();
  maxmedia.ajax();
  
  const nav = document.querySelector('#navigation');
	const navTop = nav.offsetTop;

	function stickyNavigation() {
  	console.log('navTop = ' + navTop);
  	console.log('scrollY = ' + window.scrollY);
	}

	window.addEventListener('scroll', stickyNavigation);

});