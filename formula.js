
class Formula {
    constructor(latex, selector, w) {
        this.latex = latex;
        this.elem = document.querySelector(selector);
        // if (!(this.elem && this.elem.tagName==="SPAN")) {
        //     console.log(this.table);
        //     alert("Не найден элемент span по селектору "+tableSelector);
        // }
        d3.select(this.elem).classed("formula", true);
        temml.render(latex, this.elem);
        
    }

    async set(latex) {
        this.latex = latex;
        temml.render(this.latex, this.elem);
    }

    async append(add) {
        this.latex += add;
        temml.render(this.latex, this.elem);
    }

    async setAnimated(i,j,val,color1, returnColor) {
        const c = this.selectOne(i,j);
        let color2 = (returnColor==="restore") ? c.getFillColors() : returnColor;
        if (val!=null){
            this.text(i,j).innerHTML = val;
            if (this.cellToMatrixSync) this.v[i][j]=Number(val);
        }
        c.setFillColor(color1);
        await Transitions.waitForDelay();
        //console.log(c.node(),"OK");
        if (color2) {
            c.setFillColor(color2);
            await Transitions.waitForDelay();
        }
    }

    async changeSelection(color1, returnColor, values) {
        let color2 = (returnColor==="restore") ? this.selection.getFillColors() : returnColor;
        this.selection.setFillColor(color1);
        //await this.wait(this.selection);
        await Transitions.waitForDelay();
        if (values!=null) this.updateSelection(values);
        if (color2) {
            this.selection.setFillColor((_,i)=>color2[i]);
            await Transitions.waitForDelay();
        }
    }

}
