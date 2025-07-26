class UniUser{
    #username;
    #morphAddress;
    #listOfAddress = {};


     setUsername(username){
        this.#username = username;
    }
    setMorphAddress(morphAddress){
        this.#morphAddress = morphAddress;
    }

    setListOfAddress(chainName, address){
        this.#listOfAddress[chainName] = address;
    }
    getListOfAddress(chainName){
        return this.#listOfAddress[chainName];
    }

    getUsername(){
        return this.#username;
    }
    getMorphAddress(){
        return this.#morphAddress;
    }
}


