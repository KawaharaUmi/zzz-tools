export { names, item, material, area }

const names = {
    area: ['製造区', '団地跡地', '科学研究院跡地'],
    genre: ['遊方の巧具', '生薬', '百味の器', '虚室座修', '素朴な山装束', '祝祭の贈答品'],
    currency: ['輝嶺石', '不活性エーテルボンベ', 'ハイエントロピー合金'],
}

class dataObj {
    static async fetchData(path) {
        return fetch(path)
            .then(res => (res.ok && res.status === 200) ? res.text() : Promise.reject(new Error('HTTP Response : ', res.status)))
            .then(res => res.trim().split('\n').slice(1).map(l => l.split(',').map(e => (e => !isNaN(Number(e)) ? Number(e) : e)(e.replaceAll('\r', '')))))
            .catch(e => console.log(e))
    }
}

class item extends dataObj {
    static data = []
    static async loadData() {
        const raw = await this.fetchData('./lib/item.csv')
        raw.forEach(l => this.data.push({
            id:     l[0],
            genre:  l[1],
            name:   l[2],
            price:  {a: l[3], s: l[4]},
            material: {
                primary: {id: l[5], amount: l[6]},
                secondary: {id: l[7], amount: l[8]},
            },
            pinned: false,
        }))
        console.log(this.data)
    }
    static getList(keys, pin = false, sort = false) {
        const result = this.data.filter(e => keys[e.genre] && (pin ? e.pinned : true))
        if (!sort) {
            return result
        } else {
            const sorted = result.sort((a,b) => a.price.s < b.price.s)
            return sorted
        }
    }
    static getListAll(sort = false) {
        if(!sort) return item.data
        const result = item.data.toSorted((a,b) => a.price.s < b.price.s)
        console.log(result)
        return result
    }
}

class material extends dataObj {
    static data = []
    static async loadData() {
        const raw = await super.fetchData('./lib/material.csv')
        raw.forEach(l => this.data.push({
            id:     l[0],
            rank:   l[1],
            name:   l[2],
            buy:    {price: l[6], currency: l[7]}
        }))
        console.log(this.data)
    }
    static getName(id) {
        return material.data.find(e => e.id == id).name
    }
    static getRank(id) {
        return material.data.find(e => e.id == id).rank
    }
    static getRarity(id) {
        switch(material.data.find(e => e.id == id).rank) {
            case 0: return 'C'
            case 1: return 'B'
            case 2: return 'A'
            case 3: return 'S'
        }
    }
    static getCurrency(id) {
        return material.data.find(e => e.id == id).buy.currency
    }
}

class area extends dataObj {
    static data = []
    static async loadData() {
        const raw = await super.fetchData('./lib/area.csv')
        raw.forEach(l => this.data.push({
            id:     l[0],
            name:   names.area[l[1]-1]+l[2]+'-'+(l[3] == 4 ? '深層' : l[3]),
            area:   l[1],
            block:  l[2],
            level:  l[3],
            material: {
                primary: { id: l[5], amount: l[6] },
                secondary: { id: l[7], amount: l[8] },
            }
        }))
        console.log(this.data)
    }
    static getNameFromMaterial(id) {
        const primary = area.data.filter(e => e.material.primary.id == id)
        if(primary) return primary.map(e => e.name)
        const secondary = area.data.filter(e => e.material.secondary.id == id)
        if(secondary) return secondary.map(e => e.name)
        return ([])
    }
}