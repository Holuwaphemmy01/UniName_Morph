// class UniUser{
//     #username;
//     #morphAddress;
//     #listOfAddress = {};

//     constructor(username, morphAddress, listOfAddress){
//         this.#username = username;
//         this.#morphAddress = morphAddress;
//         this.#listOfAddress = listOfAddress;
//     }


//      setUsername(username){
//         this.#username = username;
//     }
//     setMorphAddress(morphAddress){
//         this.#morphAddress = morphAddress;
//     }

//     setListOfAddress(chainName, address){
//         this.#listOfAddress[chainName] = address;
//     }
//     getListOfAddress(chainName){
//         return this.#listOfAddress[chainName];
//     }

//     getUsername(){
//         return this.#username;
//     }
//     getMorphAddress(){
//         return this.#morphAddress;
//     }
// }


// module.exports = UniUser;
class UniUser {
  constructor() {
    this.username = "";
    this.morphAddress = "";
    this.listOfAddress = [];
  }

  setUsername(username) {
    this.username = username;
  }

  setMorphAddress(address) {
    this.morphAddress = address;
  }

  setListOfAddress(chainName, address) {
    this.listOfAddress.push({ chainName, address });
  }

  getUsername() {
    return this.username;
  }

  getMorphAddress() {
    return this.morphAddress;
  }

  getListOfAddress() {
    return this.listOfAddress;
  }
}

module.exports = UniUser;