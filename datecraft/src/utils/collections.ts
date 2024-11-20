export const populateCollection = async (collection, doc, previousDoc, payload) =>  { 
    try {
        let populatedData = {}
        for (var i=0; i<collection.fields.length; i++) {
            let fieldName = collection.fields[i]['name']
            if (previousDoc[fieldName] != doc[fieldName] && collection.fields[i]['relationTo']) {
                if (collection.fields[i]['hasMany']) {
                    if (doc[fieldName] && doc[fieldName].length > 0) {
                        for (let j=0; j<doc[fieldName].length; j++) {
                            if (!Array.isArray(populatedData[fieldName])) {
                                populatedData[fieldName] = []
                            }
                            populatedData[fieldName].push(await payload.findByID({ id: doc[fieldName][j], collection: collection.fields[i]['relationTo'] }))
                        }
                    } else {
                        populatedData[fieldName] = []
                    }
                } else {
                    populatedData[fieldName] = await payload.findByID({
                        collection: collection.fields[i]['relationTo'],
                        id: doc[fieldName]
                    })
                }
            } else {
                populatedData[fieldName] = doc[fieldName]
            }
        }
        return populatedData
    } catch (e) {
        console.log(e)
    }
}

export const isDocUnique = async (operation: string, slug: string, query:any, originalDoc: any, payload: any) => {
    let uniquenessFindRes = await payload.find({
        collection: slug,
        where: query,
        limit: 1
    })
    if ( uniquenessFindRes.totalDocs ) {
        if (operation == 'create' || (uniquenessFindRes.docs[0]?.id != originalDoc.id)) {
            return false
        }
    }
    return true
}