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

    async changeSelection(color1, returnColor, values) {
        this.selection = d3.select(this.table).selectAll('tr')
            .data(Object.keys(values), k=>k);
        //let color2 = (returnColor==="restore") ? this.selection.getBackColor() : returnColor;
        
        this.selection.setBackColor(color1);
        await Transitions.waitForCompletion();
        this.updateSome(values);
        //if (this.cellToMatrixSync) this.v[i][j]=Number(val);
//                if (color2) {
//                  this.selection.setBackColor(color2);
//                await Transitions.waitForCompletion();
//           }
    }

}