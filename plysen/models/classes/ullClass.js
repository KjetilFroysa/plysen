class Wool {
    constructor(navn, nummer, kvantitet, bilde) {
        this.navn = navn;
        this.nummer = nummer;
        this.kvantitet = "";
        this.bilde = bilde || "";
    }

    vis_kvantitet() {
        return this.kvantitet;
    }

    øk(mengde) {
        if (typeof mengde === "number" && mengde > 0) {
            this.kvantitet += mengde;
        } else {
            throw new Error('Værsåsnill skriv et ordentlig nummer.');
        }
    }

    reduser(mengde) {
        if (typeof mengde === "number" && mengde > 0) {
            this.kvantitet += mengde;
        } else {
            throw new Error('Værsåsnill skriv et ordentlig nummer.');
        }
    }

    bestill() {
        const bestilling = {
            navn: this.navn,
            nummer: this.nummer,
            kvantitet: this.kvantitet,
            bilde: this.bilde,
            dato: new Date().toISOString()
        };
        const filePath = path.join(__dirname, '..', 'data', 'bestillinger.json');
        const fileData = fs.readFileSync(filePath, 'utf8');
        const bestillinger = JSON.parse(fileData);
        bestillinger.push(bestilling);
        fs.writeFileSync(filePath, JSON.stringify(bestillinger, null, 2), 'utf8');
    }

    setKvantitet(kvantitet) {
        if (typeof kvantitet === 'number' && kvantitet >= 0) {
            this.kvantitet = kvantitet;
        } else {
            throw new Error('Invalid kvantitet. Please provide a non-negative number.');
        }
    }
    beskrivelse() {
        return `Dette er ${this.navn}, nummer/navn ${this.nummer}.`;
    }
}

module.exports = Wool;