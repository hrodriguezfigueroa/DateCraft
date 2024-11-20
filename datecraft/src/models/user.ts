export default { 
    relaciones: async (payload, user) => {
        return await payload.find({
            collection: 'relaciones',
            where: {
                loves: { 
                    contains: user.id
                }
            }
        })
    }, 
    toLove: async (payload, user) => {
            let lovesFindRes = await payload.find({
            collection: 'loves',
            where: {
                user: { equals: user?.id }
            },
            limit: 1,
            depth: 1
        })
        return lovesFindRes.docs?.[0]
    }

}