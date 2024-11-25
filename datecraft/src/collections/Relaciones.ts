import findByID from 'payload/dist/collections/operations/findByID'
import { CollectionConfig } from 'payload/types'

const Relaciones: CollectionConfig = {
  slug: 'relaciones',
  admin: {
    useAsTitle: 'title',
  },
  access: {
      create: async ({ req: {user} }) => {
        if (!user) { return false }

        return !user.relacion || user.relacion.length <= 0 
      },
      read: ({req: {user}}) => {
        return {
          participants: {
            contains: user.id 
          }
        }
      }
  },
  fields: [
    {
      name: 'title', type: 'text', 
      required: true
    },
    {
      name: 'participants', type: 'relationship',
      relationTo: 'users',
      hasMany: true,
      required: true
    }
  ],
  hooks: {
    beforeChange: [
      async ({req: {user}, req: {payload}, data}) => {
        if (data.participants && !data.participants.includes(user.id)) {
          data.participants.push(user.id)
        }
        let orQuery = []
        data.participants.forEach((participantId) => {
          orQuery.push({
            participants: {
              contains: participantId
            }
          })
        })
        let r = await payload.find({
          collection: 'relaciones',
          where: { or: orQuery },
          depth: 1
        })
        
        if (r?.docs?.length > 0) {
          r.docs.forEach((rela: any) => {
            rela.participants.forEach((id) => {
              if(!data.participants.includes(id)) {
                throw new Error('Users can only participate in one relationship at a time')
              }
            })
          })
        }
        
        if (data.participants.length <= 1) {
          throw new Error('Relationships need more than 1 participant')
        }

        return data
      }
    ],
    afterChange: [async ({ req: {payload}, doc }) => {
      doc.participants.forEach(async (usrId) => {
        try { 
          let usr = await payload.findByID({
            collection: 'users',
            id: usrId,
            depth: 1
          })
          
          usr.relacion = doc.participants
          delete usr.id
          await payload.update({
            collection: 'users',
            id: usrId,
            data: usr
          })
        } catch (e) {
          console.log(e)
        }
      });
    }],
    afterDelete: [async ({doc, req: {payload}}) => {
      doc.participants.forEach(async (u) => {
            
        try { 
          let usr = await payload.findByID({
            collection: 'users',
            id: u.id
          })
          usr.relacion = []
          delete usr.id
          
          await payload.update({
            collection: 'users',
            id: u.id,
            data: usr
          })
        } catch (e) {
          console.log(e)
        }
      });
    }]
  }
}

export default Relaciones
