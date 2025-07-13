export { names, item, material, area }

const names = {
    area: ['製造区', '団地跡地', '科学研究院跡地'],
    genre: ['遊方の巧具', '生薬', '百味の器', '虚室座修', '素朴な山装束', '祝祭の贈答品'],
    currency: ['輝嶺石', '不活性エーテルボンベ', 'ハイエントロピー合金'],
}

class item {
    static data = []
    static {
        fetch('./lib/item.csv')
            .then(res => res.text())
            .then(res => {
                res.trim().split('\n').slice(1).map(l => {
                    const data = l.split(',')
                    item.data.push({
                        id: Number(data[0]),
                        genre: data[1],
                        name: data[2],
                        price: {a: Number(data[3]), s: Number(data[4])},
                        material: {
                            primary: {id: data[5], amount: data[6]},
                            secondary: {id: data[7], amount: data[8]},
                        }
                    })
                })
                console.log(item.data)
            })
    }
    static getList(keys, sort) {
        const result = item.data.filter(e => keys[e.genre])
        if (sort != true) {
            return result
        } else {
            return result.sort((a,b) => a.price.s < b.price.s)
        }
    }
}

class material {
    static data = []
    static {
        fetch('./lib/material.csv')
            .then(res => res.text())
            .then(res => {
                res.trim().split('\n').slice(1).forEach(l => {
                    const data = l.split(',')
                    material.data.push({
                        id: Number(data[0]),
                        rank: Number(data[1]),
                        name: data[2],
                        buy: {price: data[6], currency: data[7]}
                    })
                })
                console.log(material.data)
            })
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

class area {
    static data = []
    static {
        fetch('./lib/area.csv')
            .then(res => res.text())
            .then(res => {
                res.trim().split('\n').slice(1).forEach(l => {
                    const data = l.split(',')
                    area.data.push({
                        id: data[0],
                        name: names.area[Number(data[1])-1]+data[2]+'-'+(data[3] == 4 ? '深層' : data[3]),
                        area: data[1],
                        block: data[2],
                        level: data[3],
                        material: {
                            primary: { id: data[5], amount: data[6] },
                            secondary: { id: data[7], amount: data[8] },
                        }
                    })
                })
                console.log(area.data)
            })
    }
    static getNameFromMaterial(id) {
        const primary = area.data.filter(e => e.material.primary.id == id)
        if(primary) return primary.map(e => e.name)
        const secondary = area.data.filter(e => e.material.secondary.id == id)
        if(secondary) return secondary.map(e => e.name)
        return ([])
    }
}