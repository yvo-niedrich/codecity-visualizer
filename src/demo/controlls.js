class Controlls {
    constructor(target, versions, renderFunction) {
        var div = document.createElement('div');
        div.style['float'] = 'left';
        div.style['clear'] = 'both';
        div.style['margin'] = '4px 2px';
        div.style['padding'] = '0 5px';
        div.style['border-width'] = '1px 1px 1px 0';
        div.style['border-style'] = 'dashed';
        div.style['border-color'] = '#888';

        this._controllDiv = div;

        this.appendLayout();
        this.appendRules();
        this.appendVersions(versions);
        this.appendDrawButton(renderFunction);

        target.appendChild(this._controllDiv);
    };

    appendLayout() {
        var layouts = [
            {key: 'grid', label: 'GRID'},
            {key: 'linear', label: 'Linear'}
        ];

        var margins = [];
        for (var i=0; i<=10; i++) {
            margins.push({label: i, key: i});
        }

        this.appendHeader('Layout');
        this.appendCheckbox('l_sort', 'Sort Houses by Size', 1);
        this.appendSelectBox('l_margin', 'House Margin', margins, 4);
        this.appendSelectBox('l_pack', 'House-Packing: ', layouts);

    }

    appendRules() {
        this.appendHeader('Rules');
        this.appendCheckbox('r_loc', 'LOC -> Height', 1);
        this.appendCheckbox('r_edit', 'Changes -> Width', 1);
        this.appendCheckbox('r_pack', 'Package -> Color', 1);
    }

    appendVersions(v) {
        this.appendHeader('Versions');
        this.appendSelectBox('version', '', v);
    }

    appendDrawButton(renderFunction) {
        var b = document.createElement('input');
        b.setAttribute('type', 'button');
        b.setAttribute('name', 'b_draw');
        b.setAttribute('id', 'draw');
        b.setAttribute('value', 'Draw City');
        b.style['padding'] = '6px 10px';
        b.style['margin'] = '5px 0 0 0';

        b.addEventListener('click', function(){
            var options = {
                'house.margin': 4,
                'evostreet.options' : {
                    'spacer.initial': 20,
                    'spacer.conclusive': 0,
                    'spacer.branches': 20
                }
            };

            if (document.getElementById('l_sort').checked) options['evostreet.options']['house.distribution'] = function(s) { return s.displayDimensions.base; };
            if (document.getElementById('l_pack').value === 'grid') options['evostreet.options']['house.container'] = require('../illustrator/container/grid.js');
            if (document.getElementById('l_margin')) options['house.margin'] = parseInt(document.getElementById('l_margin').value);

            var rules = [];
            if(document.getElementById('r_loc').checked) rules.push(require('../illustrator/rules/loc-to-height.js')());
            if(document.getElementById('r_edit').checked) rules.push(require('../illustrator/rules/editor-to-width.js')());
            if(document.getElementById('r_pack').checked) rules.push(require('../illustrator/rules/package-to-color.js')());

            var version = document.getElementById('version').value;

            renderFunction(options, rules, version);

            if (document.getElementById('legend_div')) {
                var legendDisplay = document.getElementById('r_pack').checked ? 'block' : 'none';
                document.getElementById('legend_div').style['display'] = legendDisplay;
            }

        });

        var container = document.createElement('div');
        container.appendChild(b);
        container.style['margin'] = '18px 0 2px 0';
        container.style['padding'] = '0 25px 0 0';
        container.style['text-align'] = 'center';
        this._controllDiv.appendChild(container);
    }




    appendCheckbox(id, label, value, checked = true) {
        var c = document.createElement('input');
        c.setAttribute('type', 'checkbox');
        c.setAttribute('name', id);
        c.setAttribute('id', id);
        c.setAttribute('value', value);
        c.style['margin'] = '2px';
        if (checked) {
            c.setAttribute('checked', true);
        }

        var l = document.createElement('label');
        l.setAttribute('for', id);
        l.style['padding'] = '0 2px'
        l.appendChild(document.createTextNode(label));

        var container = document.createElement('div');
        container.appendChild(c);
        container.appendChild(l);
        this._controllDiv.appendChild(container);
    }

    appendSelectBox(id, label, contents, defaultValue) {

        var s = document.createElement('select');
        s.setAttribute('name', id);
        s.setAttribute('id', id);
        s.style['margin-left'] = '5px';

        for(var option of contents) {
            var o = document.createElement('option');
            o.setAttribute('value', option.key);
            o.appendChild(document.createTextNode(option.label));

            if (defaultValue === option.key) {
                o.setAttribute('selected', true);
            }

            s.appendChild(o);
        }

        this._controllDiv.appendChild(s);

        var container = document.createElement('div');
        container.appendChild(document.createTextNode(label));
        container.appendChild(s);
        this._controllDiv.appendChild(container);
    }

    appendHeader(name) {
        var h = document.createElement('h3');
        h.style['margin'] = '16px 10px 4px 10px';
        h.appendChild(document.createTextNode(name));
        this._controllDiv.appendChild(h);
    }
}

module.exports = Controlls;
