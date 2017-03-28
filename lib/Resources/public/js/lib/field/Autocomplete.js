ag.ns("ag.admin.field");

(function(){
var
    scrollKeys = [33, 34, 35, 36, 38, 40],

    defaultFormatter = entity => ag.ui.tool.fmt.out(entity ? entity.name || entity.id : ""),

    autocomplete = function(endpoint, minSearchLength, inputFormatter, listItemFormatter)
    {
        this.extend(this, ag.ui.tool.tpl("agitadmin-autocomplete", ".autocomplete"));

        this.endpoint = endpoint;
        this.minLength = minSearchLength || 3;
        this.inputFormatter = inputFormatter || defaultFormatter;
        this.listItemFormatter = listItemFormatter || defaultFormatter;

        this.input = this.find("input");

        this.indicator = new ag.ui.elem.InlineIndicator();
        this.find("span").replaceWith(this.indicator);
        this.list = this.find("ul");
        this.rows = [];
        this.activeRow = null;

        this.lastRequestValue = "";
        this.currentEntity = null;

        this.input.focus(() => {
            this.rows.length && this.list.addClass("preview");
        });

        this.input.blur(() => {
            if (!this.keepOpen) // list.focus causes input.blur; but if we hide the list now, focus will fail/abort
            {
                this.list.removeClass("preview");
                this.input.val(this.inputFormatter(this.currentEntity));
            }

            this.keepOpen = false;
        });

        this.list.focus(() => {
            if (this.rows.length && !this.activeRow)
                this.selectRow(this.rows[0]);

            this.list.removeClass("preview"); // clean up if input.blur skipped removing the class
        });

        this.list.blur(() => {
            this.list.removeClass("preview");
            this.input.val(this.inputFormatter(this.currentEntity));
        });

        this.list.mouseleave(() => this.keepOpen = false);

        // prevent auto-scroll of the container
        this.list.on("keydown", ev => {
            if (scrollKeys.indexOf(ev.which) > -1)
                ev.preventDefault();
        });

        this.list.on("keyup", ev => {
            var keyCode = ev.which, move = 0;

            if (keyCode === 13 || keyCode === 27) // esc/enter
            {
                this.input.blur();
                this.list.blur();

                if (keyCode === 13 && this.activeRow)
                {
                    this.setValue(this.activeRow.entity);
                }
            }
            else if (keyCode === 38 || keyCode === 40) // up/down
            {
                if (!this.activeRow)
                {
                    this.rows.length && this.selectRow(this.rows[0]);
                }
                else
                {
                    var idx = this.rows.indexOf(this.activeRow);

                    if (keyCode === 38)
                    {
                        if (idx > 0)
                        {
                            this.selectRow(this.rows[--idx]);
                            move = -1;
                        }
                        else
                        {
                            this.selectRow(null);
                            this.input.focus();
                        }
                    }
                    else if (keyCode === 40 && idx + 1 < this.rows.length)
                    {
                        this.selectRow(this.rows[++idx]);
                        move = 1;
                    }

                    if (this.activeRow)
                    {
                        var
                            num = idx + 1,
                            listHeight = this.list.outerHeight(),
                            rowHeight = this.activeRow.outerHeight(),
                            visibleRows = listHeight / rowHeight,
                            scrollOffset = this.list.scrollTop(),
                            minScrollOffset = num * rowHeight - visibleRows * rowHeight,
                            maxScrollOffset = idx * rowHeight;

                        if (move === -1 && scrollOffset > maxScrollOffset)
                            this.list.scrollTop(maxScrollOffset);
                        else if (move === 1 && scrollOffset < minScrollOffset)
                            this.list.scrollTop(minScrollOffset);
                    }
                }
            }

            this.keyNav = true; // lock state to avoid mousemove trigger on scrolling
        });

        var typingTimer;

        this.input.on("keyup", (ev) => {
            window.clearTimeout(typingTimer);

            var keyCode = ev.which;

            if (keyCode === 13 || keyCode === 27) // esc/enter
            {
                this.input.blur();
                this.list.blur();

                if (keyCode === 13 && this.activeRow)
                {
                    this.setValue(this.activeRow.entity);
                }
            }
            else if (keyCode === 40) // down
            {
                if (this.rows.length)
                {
                    this.selectRow(this.rows[0]);
                    this.keepOpen = true;
                    this.list.focus();
                }
            }
            else
            {
                typingTimer = window.setTimeout(typingLoop.bind(this), 300);
            }
        });
    },

    typingLoop = function()
    {
        var currentValue = this.input.val();

        if (currentValue.length >= this.minLength && currentValue !== this.lastRequestValue)
        {
            this.lastRequestValue = currentValue;
            this.selectRow(null);

            ag.srv("api").doCall(this.endpoint, currentValue, result => {
                this.list.empty();
                this.rows.length = 0;

                if (result && result.length)
                {
                    result.forEach(entity => {
                        var row = $("<li>").html(this.listItemFormatter(entity));
                        this.rows.push(row);
                        row.entity = entity;

                        row.on("mousemove", () => {
                            if (row !== this.activeRow && !this.keyNav)
                            {
                                this.keepOpen = true;
                                this.list.focus();
                                this.selectRow(row);
                            }

                            this.keyNav = false; // if the last keyup event locked the state, we can release it now
                        });

                        row.click(() => this.setValue(row.entity));

                    });

                    this.list.html(this.rows);
                }
                else
                {
                    this.list.html(ag.ui.tool.tpl("agitadmin-autocomplete", ".empty"));
                }

                this.list.addClass("preview");
            }, this.indicator);
        }
    };

autocomplete.prototype = Object.create(ag.ui.field.ComplexField.prototype);

autocomplete.prototype.selectRow = function(row)
{
    this.rows.forEach(r => r.removeClass("current"));
    row && row.addClass("current");
    this.activeRow = row || null;
};

autocomplete.prototype.setValue = function(value)
{
    this.currentEntity = value;
    this.input.val(this.inputFormatter(value));
    this.list.blur();
    this.rows.length = 0;
    this.lastRequestValue = "";

    this.triggerHandler("ag.field.set");
    return this;
};

autocomplete.prototype.getValue = function()
{
    return this.currentEntity;
};

autocomplete.prototype.setTargetId = function(id)
{
    this.input.attr("id", id);
};

autocomplete.prototype.disable = function()
{
    this.list.blur();
    this.list.hide();
    return this.attr("disabled", "disabled");
};

autocomplete.prototype.enable = function()
{
    return this.attr("disabled", false);
};

autocomplete.prototype.clear = function()
{
    this.input.val(this.inputFormatter(""));
    this.list.hide();
};

ag.admin.field.Autocomplete = autocomplete;
})();
