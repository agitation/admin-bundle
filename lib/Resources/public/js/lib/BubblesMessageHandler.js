ag.ns("ag.admin");

(function(){
    var
        $container,
        bubbles = {},
        removeBubble = function(bubble)
        {
            // bubble && bubble.fadeOut(1500, bubble.remove.bind(bubble));
        },

        msgH = function()
        {
            if (!$container) $container = $("<div class='message-bubbles'>").appendTo($("body"));
        };

msgH.prototype = Object.create(ag.ui.elem.ModalMessageHandler.prototype);

msgH.prototype.clear = function(category)
{
    Object.keys(bubbles).forEach(cat => {
        if (category === undefined || cat === category)
        {
            bubbles[cat].forEach(bubble => removeBubble(bubble));
        }
    });
};

msgH.prototype.alert = function(text, type, category, closeCallback)
{
    type = type || "error";
    category = category || "?";

    var
        bubble = ag.ui.tool.tpl("agitui-msg-bubbles", ".message-bubble"),
        removeThisBubble = removeBubble.bind(this, bubble);

    bubble.addClass(type)
        .appendTo($container)
        .find(".icon i." + type).addClass("on").end()
        .find(".msg").text(text).end()
        .fadeIn(400)
        .click(removeThisBubble)
        .animate({ opacity:0.9 }, 1000);

    // start disappearing after 10 seconds
    window.setTimeout(removeThisBubble, 10000);

    if (!bubbles[category])
        bubbles[category] = [];

    bubbles[category].push(bubble);

    closeCallback && window.setTimeout(closeCallback, 3000); // give user some time to read before executing callback
};

ag.admin.BubblesMessageHandler = msgH;
})();
