
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
}
