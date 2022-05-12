const sha256 = require("sha256");
const { json } = require("stream/consumers");

class Block{
    constructor(id, tarih, veri, prevHash=""){
        this.id = id;
        this.tarih = tarih;
        this.veri = veri;
        this.prevHash = prevHash;
        this.hash = this.hesapla();
    }

    hesapla(){
        return sha256(JSON.stringify(this.veri)).toString();
    }

    mineBlock(diff){
        while (!this.hash.startsWith(Array(diff + 1).join("0"))) {
            this.hash = this.hesapla();
        }
        console.log("mined: " + this.hash);
    }
}

class BlockChain{
    constructor(){
        this.chain = [this.ilkBlok()];
        this.diff = 0;
    }

    ilkBlok(){
        return new Block(0, "05.05.2022", "İlk Blok");
    }

    sonBlok(){
        return this.chain[this.chain.length-1];
    }

    blokEkle(yeniBlok){
        yeniBlok.prevHash = this.sonBlok().hash;
        yeniBlok.hash = yeniBlok.hesapla();
        yeniBlok.mineBlock(this.diff);
        this.chain.push(yeniBlok);
    }

    zincirGecerliMi(){
        for(let i =1; i<this.chain.length; i++){
            const mevcutBlok = this.chain[i];
            const oncekiBlok = this.chain[i-1];

            if(mevcutBlok.hash !== mevcutBlok.hesapla() || mevcutBlok.prevHash !== oncekiBlok.hash){
                return "Geçersiz";
            }
        }

        return "Geçerli";
    }
}

let pdpCoin = new BlockChain();

for(a=1; a<=5; a++){
    pdpCoin.blokEkle(new Block(a, Date.now(), {Miktar: a*30}));

}

console.log(JSON.stringify(pdpCoin,1,2));
console.log("Blok Zinciri Geçerli mi?: " + pdpCoin.zincirGecerliMi());

