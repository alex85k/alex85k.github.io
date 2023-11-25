d3.selection.prototype.setBackColor = function(v) {
    return this.style("background-color", v);
}
d3.selection.prototype.getBackColors = function() {
    return this.nodes().map(q=>q.style['background-color']);
}

class Matrix extends Array {
    constructor(n,m) {
        super(n);
        for (let i=0;i<n;i++) {
            this[i]=new Array(m);
            for (let j=0;j<m;j++) {
                this[i][j]='';//i*10+j;
            }
        }
        this.m=m;
        this.n=n;
    }
}

class MatrixTable {
    constructor(n,m, tableSelector) {
        Matrix.emptyCell = document.body.appendChild(document.createElement('td'));
        Matrix.emptyCell.style.display='none';
    
        const data = new Matrix(n,m);
        this.m=m;
        this.n=n;
        this.v = data;
        this.table = document.querySelector(tableSelector);
        if (!(this.table && this.table.tagName==="TABLE")) {
            alert("Не найден элемент table по селектору "+tableSelector);
        }
        d3.select(this.table).classed("matrix", true);
        this.selection = null;
        this.cellToMatrixSync = true;
    }

    updateAll() {
        d3.select(this.table).selectAll('tr')
            .data(this.v)
            .join(
                enter=> enter.append('tr'),
                update=>update,
                exit=>exit.remove()
            ).selectAll('td').data(d=>d)
            .join('td').html(d=>d);
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
        return this.table.rows[i]?.cells[j];
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
        this.cell(i,j).innerHTML = val;
        if (this.cellToMatrixSync) this.v[i][j]=Number(val);
    }
    
    wait(elem) {
        return Transitions.waitForCompletion(elem.node()||this.selection.node());
    }
    
    async setAnimated(i,j,val,color1, returnColor) {
        const c = this.selectOne(i,j);
        let color2 = (returnColor==="restore") ? c.getBackColors() : returnColor;
        if (val!=null){
            this.cell(i,j).innerHTML = val;
            if (this.cellToMatrixSync) this.v[i][j]=Number(val);
        }
        c.setBackColor(color1);
        //console.log("Waiting ",c.node());
        await this.wait(c);
        //console.log(c.node(),"OK");
        if (color2) {
            c.setBackColor(color2);
            await this.wait(c);
        }
    }

    async changeSelection(color1, returnColor, values) {
        let color2 = (returnColor==="restore") ? this.selection.getBackColors() : returnColor;
        this.selection.setBackColor(color1);
        await this.wait(this.selection);
        if (values!=null) this.updateSelection(values);
        if (color2) {
            this.selection.setBackColor((_,i)=>color2[i]);
            await this.wait(this.selection);
        }
    }

    
}
