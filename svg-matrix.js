d3.selection.prototype.setFillColor = function(v) {
    return this.style("fill", v);
}
d3.selection.prototype.getFillColors = function() {
    return this.nodes().map(q=>q.style['fill']);
}

class Matrix extends Array {
    constructor(n,m) {
        super(n);
        for (let i=0;i<n;i++) {
            this[i]=new Array(m);
            for (let j=0;j<m;j++) {
                this[i][j]='';
                //this[i][j]=i*10+j;
            }
        }
        this.m=m;
        this.n=n;
    }
}

class SVGMatrix {
    constructor(n,m, tableSelector, w) {
        Matrix.emptyCell = document.body.appendChild(document.createElement('td'));
        Matrix.emptyCell.style.display='none';
    
        const data = new Matrix(n,m);
        this.m=m;
        this.n=n;
        this.w=w||45;
        this.v = data;
        this.table = document.querySelector(tableSelector);
        if (!(this.table && this.table.tagName==="g")) {
            console.log(this.table);
            alert("Не найден элемент g (svg) по селектору "+tableSelector);
        }
        d3.select(this.table).classed("matrix", true);
        this.selection = null;
        this.cellToMatrixSync = true;
        this.cells=[];
    }

    updateAll() {
        const w = this.w;
        let {x,y} = this.table.dataset;
        x=Number(x||0); y=Number(y||0);
        
        const cells = new Array(this.n);
        const texts = new Array(this.n);

        d3.select(this.table).selectAll('g')
            .data(this.v)
            .join(
                enter=>enter.append('g'),
                update=>update,
                exit=>exit.remove()
            )
            .attr('data-row',(_,i)=>i)
            .selectAll('g')
            .data(d=>d)
            .join('g').classed("cell",true)
            .html(function (d,j) {//`<rect />`);
                const i=this.parentNode.getAttribute('data-row');
                const x1=x+j*w;
                const y1=y+i*w;
                return `<rect x='${x1}' y='${y1}' width='${w}' height='${w}' />
                        <text x='${x1+w/2}' y='${y1+w/2}'>${d}</text>`
            });
    
        d3.select(this.table).selectAll('g').selectAll('g').select('text').each(function (d,j) {//`<rect />`);
            const i=Number(this.parentNode.parentNode.getAttribute('data-row'));
            console.log(i,j,d);
            if (!texts[i]) texts[i]=new Array(this.m);
            texts[i][j]=this;
        });
        d3.select(this.table).selectAll('g').selectAll('g').select('rect').each(function (d,j) {//`<rect />`);
            const i=Number(this.parentNode.parentNode.getAttribute('data-row'));
            console.log(i,j,d);
            if (!cells[i]) cells[i]=new Array(this.m);
            cells[i][j]=this;
        });
        this.cells=cells;
        this.texts=texts;
        

    }

    updateSelection(values) {
        this.selection.data(values).html(d=>d);
    }

    updateAllColors() {
        const color = d3.scaleSequential(d3.interpolateTurbo);

        const rows = d3.select(this.table).selectAll('tr');
        const max = d3.max(d3.max(m.v))+2;
        console.log(max)
        return rows.data(this.v)
            .join(
                enter=> enter.append('tr'),
                update=>update,
                exit=>exit.remove()
            ).selectAll('td').data(d=>d)
            .join('td').style("background-color",
                 (val,idx,arr)=>{
                     //console.log(val,idx)
                     return color((val+2)/max);//`hsl(${val/max*360}deg 75% 50%)`;
                 }
            );
    }

    clear() {
        const data = new Matrix(this.n,this.m);
        this.v = data;
        this.updateAll();
    }

    cell(i,j) {
        return this.cells[i]?.[j];
    }
    text(i,j) {
        return this.texts[i]?.[j];
    }

    selectOne(i, j) {
        return this.selection=d3.select(this.cell(i,j));
    }
    selectMulti(coords) {
        return this.selection=d3.selectAll(
            coords.map(p=>this.cell(p[0],p[1]))
        );
    }

    static emptyCell = null;
    selectRange(i1, i2, j1, j2) {
        const sel=[];
        for (let i = i1; i <= i2; i++) {
            for (let j = j1; j <= j2; j++) {
                sel.push(this.cell(i,j)||Matrix.emptyCell);
            }
        }
        return this.selection=d3.selectAll(sel);
    }
    selectRow(i) {
        return this.selectRange(i,i,0,this.m-1);
    }
    selectColumn(j) {
        return this.selectRange(0,this.n-1,j,j);
    }

    setMath(i,j,tex) {
        temml.render(tex, this.cell(i,j));
    }

    set(i,j,val) {
        this.text(i,j).innerHTML = val;
        if (this.cellToMatrixSync) this.v[i][j]=Number(val);
    }
    
    // wait(elem) {
    //     return Transitions.waitForCompletion(elem.node()||this.selection.node());
    // }
    
    async setAnimated(i,j,val,color1, returnColor) {
        const c = this.selectOne(i,j);
        let color2 = (returnColor==="restore") ? c.getFillColors() : returnColor;
        if (val!=null){
            this.text(i,j).innerHTML = val;
            if (this.cellToMatrixSync) this.v[i][j]=Number(val);
        }
        c.setFillColor(color1);
        //console.log("Waiting ",c.node());
        //await this.wait(c);
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
