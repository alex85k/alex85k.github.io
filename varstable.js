class VariableTable {
    constructor(varsObject, tableSelector) {
        this.table = document.querySelector(tableSelector);
        
        if (Array.isArray(varsObject)) {
        }
        this.updateAll(varsObject);
    }

    updateAll(keyValues) {
        //const pairs = Object.entries(keyValues);//pairs=>pairs, pair=>pair[0]
        d3.select(this.table).classed("varstable",true).selectAll('tr')
            .data(Object.keys(keyValues), k=>k)
        .join(
            enter=>enter.append('tr'),
            update=>update,
            exit=>exit.remove()
        ).html(q=>`<td>${q}</td><td>${keyValues[q]}</td>`);
    }
    
    updateSome(keyValues) {
        //const pairs = Object.entries(keyValues);//pairs=>pairs, pair=>pair[0]
        d3.select(this.table).selectAll('tr').data(Object.keys(keyValues), k=>k)
        .html(q=>`<td>${q}</td><td>${keyValues[q]}</td>`);
    }

    // wait(elem) {
    //     return Transitions.waitForCompletion(elem.node()||this.selection.node());
    // }
    
    async changeSelection(color1, returnColor, values) {
        this.selection = d3.select(this.table).selectAll('tr')
            .data(Object.keys(values), k=>k);
        //let color2 = (returnColor==="restore") ? this.selection.getBackColor() : returnColor;
        //const changed = this.selection.node().style['background-color']!==color1;
        

        this.selection.setBackColor(color1);
        if (values) this.updateSome(values);
        
        await Transitions.waitForDelay();
        // console.log("Waiting for", this.selection.node());
        // await this.wait(this.selection);
        // console.log("ready");
        //if (this.cellToMatrixSync) this.v[i][j]=Number(val);
//                if (color2) {
//                  this.selection.setBackColor(color2);
//                await Transitions.waitForCompletion();
//           }
    }

}