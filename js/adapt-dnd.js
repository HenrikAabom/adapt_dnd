define(function(require) {

    var ComponentView = require('coreViews/componentView');
    var Adapt = require('coreJS/adapt');
    var GSAP = require('libraries/TweenMax.min');
    var GSAPdraggable = require('libraries/Draggable.min');

    var DnD = ComponentView.extend({

        overlapThreshold: null,
        dropArea: null,
        drag_object: null,

        preRender: function() {
            this.checkIfResetOnRevisit();
        },

        postRender: function() {
            this.setReadyStatus();

            this.setupInview();

            this.overlapThreshold = "10%";
            this.dropArea = $(".drop-target-image");
            this.drag_object = $(".drag-object");


            Draggable.create(this.drag_object, {onDragEnd:function() {
                if (this.hitTest("img")) {
                  console.log("HIT!");
                }
              },
              bounds: window,
              onDrag: function(e) {
                if (this.hitTest(this.dropArea, this.overlapThreshold)) {
                  $(this.target).addClass("highlight");
                  //Profile img----
                  TweenMax.to($("img"), 0.2, {ease: Power1.easeOut, paddingLeft:"35%"});
                  TweenMax.to($("img"), 0.2, {ease: Power1.easeOut, paddingRight:"35%"});
                  TweenMax.to($("img"), 0, {backgroundColor:"#0a304e"});
                  TweenMax.to($("img"), 0.2, {ease: Power1.easeOut, borderRadius:"10px"});
                  //---------------
                } else {
                  $(this.target).removeClass("highlight");
                  //Profile img----
                  TweenMax.to($("img"), 0.2, {paddingLeft:0});
                  TweenMax.to($("img"), 0.2, {paddingRight:0});
                  TweenMax.to($("img"), 0.5, {backgroundColor:"none"});
                  TweenMax.to($("img"), 0.5, {borderRadius:"50%"});
                  //---------------
                }
              },
              onDragEnd: function(e) {
                
              //instead of doing hitTest again, just see if it has the highligh class.
              if (!$(this.target).hasClass("highlight")) {
                //if there isn't a highlight, send it back to starting position
                TweenMax.to(this.target, 0.2, {
                  x: 0,
                  y: 0
                });
              }
                else {
                  $(this.target).prependTo("#drop-container");
                  TweenMax.to(this.target, 0, {
                    x: 0,
                    y: 0
                  });
                  TweenMax.from(this.target, 0.5, {opacity: 0});
                  //Profile img----
                  TweenMax.to($("img"), 0.2, {paddingLeft:0});
                  TweenMax.to($("img"), 0.2, {paddingRight:0});
                  TweenMax.to($("img"), 0.5, {backgroundColor:"none"});
                  TweenMax.to($("img"), 0.5, {borderRadius:"50%"});
                  //---------------
                }
            }
            });


        },

        setupInview: function() {
            var selector = this.getInviewElementSelector();

            if (!selector) {
                this.setCompletionStatus();
            } else {
                this.model.set('inviewElementSelector', selector);
                this.$(selector).on('inview', _.bind(this.inview, this));
            }
        },

        /**
         * determines which element should be used for inview logic - body, instruction or title - and returns the selector for that element
         */
        getInviewElementSelector: function() {
            if(this.model.get('body')) return '.component-body';

            if(this.model.get('instruction')) return '.component-instruction';
            
            if(this.model.get('displayTitle')) return '.component-title';

            return null;
        },

        checkIfResetOnRevisit: function() {
            var isResetOnRevisit = this.model.get('_isResetOnRevisit');

            // If reset is enabled set defaults
            if (isResetOnRevisit) {
                this.model.reset(isResetOnRevisit);
            }
        },

        inview: function(event, visible, visiblePartX, visiblePartY) {
            if (visible) {
                if (visiblePartY === 'top') {
                    this._isVisibleTop = true;
                } else if (visiblePartY === 'bottom') {
                    this._isVisibleBottom = true;
                } else {
                    this._isVisibleTop = true;
                    this._isVisibleBottom = true;
                }

                if (this._isVisibleTop && this._isVisibleBottom) {
                    this.$(this.model.get('inviewElementSelector')).off('inview');
                    this.setCompletionStatus();
                }
            }
        },

        remove: function() {
            if(this.model.has('inviewElementSelector')) {
                this.$(this.model.get('inviewElementSelector')).off('inview');
            }
            
            ComponentView.prototype.remove.call(this);
        }
    },
    {
        template: 'dnd'
    });

    Adapt.register('dnd', DnD);

    return DnD;
});
