var scrollToTopInProgress = false

/**
 * @param {Int} position Description
 * @param {Element} _div Description
 * @return {void} description
 */
function ScrollToTop(position,_div) {
    var div = _div || window;
    var targetY = position || 0,
        initialY = window.pageYOffset,
        lastY = initialY,
        delta = targetY - initialY,
        // duration in ms, make it a bit shorter for short distances
        // this is not scientific and you might want to adjust this for
        // your preferences
        speed = Math.min(750, Math.min(1500, Math.abs(initialY - targetY))),
        // temp variables (t will be a position between 0 and 1, y is the calculated scrollTop)
        start, t, y,
        // use requestAnimationFrame or polyfill
        frame = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function(callback) {
            setTimeout(callback, 15)
        },
        cancelScroll = function() {
            abort()
        }

    // abort if already in progress or nothing to scroll 
    if (scrollToTopInProgress) return
    if (delta == 0) return

    // quint ease-in-out smoothing, from
    // https://github.com/madrobby/scripty2/blob/master/src/effects/transitions/penner.js#L127-L136
    function smooth(pos) {
        if ((pos /= 0.5) < 1) return 0.5 * Math.pow(pos, 5)
        return 0.5 * (Math.pow((pos - 2), 5) + 2)
    }

    function abort() {
        div.removeEventListener('touchstart', cancelScroll,false)
        scrollToTopInProgress = false
    }

    function scrollTop(){
    	
    }

    // when there's a touch detected while scrolling is in progress, abort
    // the scrolling (emulates native scrolling behavior)
    div.addEventListener('touchstart', cancelScroll,false)
    scrollToTopInProgress = true

    // start rendering away! note the function given to frame
    // is named "render" so we can reference it again further down
    frame(function render(now) {
        if (!scrollToTopInProgress) return
        if (!start) start = now
            // calculate t, position of animation in [0..1]
        t = Math.min(1, Math.max((now - start) / speed, 0))
            // calculate the new scrollTop position (don't forget to smooth)
        y = Math.round(initialY + delta * smooth(t))
            // bracket scrollTop so we're never over-scrolling
        if (delta > 0 && y > targetY) y = targetY
        if (delta < 0 && y < targetY) y = targetY
            // only actually set scrollTop if there was a change fromt he last frame
        if (lastY != y) window.scrollTo(window.scrollX,y);
        lastY = y
            // if we're not done yet, queue up an other frame to render,
            // or clean up
        if (y !== targetY) frame(render)
        else abort()
    })
}

typeof module != 'undefined' ? module.exports = ScrollToTop : this[ScrollToTop] = ScrollToTop;
