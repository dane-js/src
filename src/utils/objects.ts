exports.completeAssign = (target : {[key: string]: any}, ...sources : Array<{[key: string]: any}>) : {[key: string]: any} =>{
    sources.forEach(source => {
        let descriptors = Object.keys(source).reduce((descriptors : {[key: string]: any}, key) => {
            descriptors[key] = Object.getOwnPropertyDescriptor(source, key);
        
            return descriptors;
        }, {});
      
        // Par défaut, Object.assign copie également
        // les symboles énumérables
        Object.getOwnPropertySymbols(source).forEach((sym : any) => {
            let descriptor = Object.getOwnPropertyDescriptor(source, sym);
            if (descriptor?.enumerable) {
                descriptors[sym] = descriptor;
            }
        });
        Object.defineProperties(target, descriptors);
    });
    
    return target;
}