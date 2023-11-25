
class Transitions {
    static _d=0.5;
    static defaultD=0.5;
    
    static rule=null;
    static rule2=null;
    
    static init(d) {
        Transitions.rule = document.styleSheets[1].cssRules[
    document.styleSheets[1].insertRule("table.matrix td { transition-property: background-color; transition: "+Transitions.defaultD+"s;}")
    ];

        Transitions.rule2 = document.styleSheets[1].cssRules[
        document.styleSheets[1].insertRule("table.varstable tr { transition-property: background-color; transition: "+Transitions.defaultD+"s;}")
    ];
        this.D = d;
    }

    static resetD() {
        Transitions.D=Transitions.defaultD;
    }
    static set D(t) {
        this._d=t;
        Transitions.rule.style['transition-duration']=t+'s';
        Transitions.rule2.style['transition-duration']=t+'s';
    }

    static waitForCompletion(elem) {
        if (!elem) alert("waitForCompletion: укажите элемент, анимацию которого мы ждем");
        let resolve;
        
        const p = new Promise((rs,rj)=>{resolve = rs; });
        elem.addEventListener("transitionend", (q) => {
            console.log("Transition ended: ",elem);
            resolve(q);
        },{once:true});

        return p;
    }
    
}
