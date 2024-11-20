import { CollectionConfig } from 'payload/types'

const Citas: CollectionConfig = {
  slug: 'citas',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: ({ req: { user } }) => {
      // Check if user has the 'admin' role
      if (!user) { return false }

      return {
        loves: { contains: user.id }   
      }
    }
  },
  fields: [
    { name: 'title', type: 'text', required: true }, 
    { name: 'loves', type: 'relationship', relationTo: 'loves', hasMany: true, required: true },
    { name: 'wishes', type: 'relationship', hasMany: true, relationTo: 'wishes' }
  ]
}

export default Citas
