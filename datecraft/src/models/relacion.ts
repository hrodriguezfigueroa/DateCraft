export default { 
    isInRelacion: async (payload, loves) => {
        let findRes = payload.find({
            collection: 'relaciones',
            where: {
                loves: {
                    contains: loves
                }
            },
            depth: 1
        })
        // TODO
    }
}